import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../env";

/**
 * Newsletter routes — uses Workers KV for persistence instead of filesystem.
 * Requires a KV namespace bound as "NEWSLETTER_KV" in wrangler.jsonc.
 *
 * Key structure in KV:
 *   subscriber:<email>  -> { email, subscribedAt }
 *   subscriber-count    -> number (string)
 */

const router = new Hono<{ Bindings: Env }>();

const subscribeSchema = z.object({
  email: z.string().email("Valid email is required"),
});

/**
 * POST /subscribe — Subscribe an email to the newsletter.
 */
router.post("/subscribe", zValidator("json", subscribeSchema), async (c) => {
  const { email } = c.req.valid("json");
  const kv = (c.env as any).NEWSLETTER_KV;

  if (!kv) {
    // Fallback: in-memory if no KV bound
    console.warn("NEWSLETTER_KV not bound, using in-memory fallback");
    return c.json({ message: "Subscribed successfully (memory fallback)", email });
  }

  const existing = await kv.get(`subscriber:${email}`);
  if (existing) {
    return c.json({ message: "Email already subscribed" }, 409);
  }

  const subscriber = {
    email,
    subscribedAt: new Date().toISOString(),
  };

  await kv.put(`subscriber:${email}`, JSON.stringify(subscriber));

  // Update count
  const countStr = await kv.get("subscriber-count");
  const count = (parseInt(countStr || "0", 10)) + 1;
  await kv.put("subscriber-count", count.toString());

  return c.json({ message: "Subscribed successfully", email, count }, 201);
});

/**
 * POST /unsubscribe — Unsubscribe an email.
 */
router.post("/unsubscribe", zValidator("json", subscribeSchema), async (c) => {
  const { email } = c.req.valid("json");
  const kv = (c.env as any).NEWSLETTER_KV;

  if (!kv) {
    return c.json({ message: "Unsubscribed successfully (memory fallback)" });
  }

  await kv.delete(`subscriber:${email}`);

  // Update count
  const countStr = await kv.get("subscriber-count");
  const count = Math.max(0, (parseInt(countStr || "0", 10)) - 1);
  await kv.put("subscriber-count", count.toString());

  return c.json({ message: "Unsubscribed successfully" });
});

/**
 * GET /count — Get subscriber count.
 */
router.get("/count", async (c) => {
  const kv = (c.env as any).NEWSLETTER_KV;

  if (!kv) {
    return c.json({ count: 0 });
  }

  const countStr = await kv.get("subscriber-count");
  const count = parseInt(countStr || "0", 10);

  return c.json({ count });
});

export { router as newsletterRoutes };
