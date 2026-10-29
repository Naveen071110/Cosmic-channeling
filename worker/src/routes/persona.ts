import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../env";
import { requireAuth, getUser } from "../auth-middleware";
import { enforceRateLimit } from "../rate-limiter";

const router = new Hono<{ Bindings: Env }>();

const personaPayloadSchema = z.object({
  persona: z.record(z.unknown()).nullable().optional(),
});

/**
 * GET /api/persona — Get the authenticated user's cloud-persisted Cosmic Persona.
 */
router.get("/persona", requireAuth, async (c) => {
  if (!enforceRateLimit(c, { limit: 60, windowSec: 60, keyPrefix: "persona-get" })) {
    return c.json({ message: "Rate limit exceeded." }, 429);
  }

  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const kv = c.env.NEWSLETTER_KV;
  if (!kv) {
    return c.json({ persona: null });
  }

  try {
    const key = `persona:user_${user.id}`;
    const raw = await kv.get(key, "text");
    if (!raw) {
      return c.json({ persona: null });
    }
    const persona = JSON.parse(raw);
    return c.json({ persona });
  } catch (err) {
    console.error("Error fetching persona from KV:", err);
    return c.json({ persona: null });
  }
});

/**
 * POST /api/persona — Save or update the authenticated user's Cosmic Persona in cloud storage.
 */
router.post("/persona", requireAuth, zValidator("json", personaPayloadSchema), async (c) => {
  if (!enforceRateLimit(c, { limit: 20, windowSec: 60, keyPrefix: "persona-sync" })) {
    return c.json({ message: "Persona sync rate limit exceeded. Please wait a moment." }, 429);
  }

  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const kv = c.env.NEWSLETTER_KV;
  if (!kv) {
    return c.json({ message: "Cloud storage unavailable" }, 500);
  }

  try {
    const body = c.req.valid("json");
    const personaData = body.persona;

    const key = `persona:user_${user.id}`;

    if (!personaData) {
      await kv.delete(key);
      return c.json({ success: true, persona: null });
    }

    const payloadStr = JSON.stringify(personaData);
    if (payloadStr.length > 65536) {
      return c.json({ message: "Persona payload exceeds maximum size limit (64KB)." }, 413);
    }

    await kv.put(key, payloadStr);
    return c.json({ success: true, persona: personaData });
  } catch (err) {
    console.error("Error saving persona to KV:", err);
    return c.json({ message: "Failed to persist persona" }, 500);
  }
});

export { router as personaRoutes };
