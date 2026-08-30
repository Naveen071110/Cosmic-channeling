import { Hono } from "hono";
import type { Env } from "../env";
import { requireAuth, getUser } from "../auth-middleware";

const router = new Hono<{ Bindings: Env }>();

/**
 * GET /api/persona — Get the authenticated user's cloud-persisted Cosmic Persona.
 */
router.get("/persona", requireAuth, async (c) => {
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
router.post("/persona", requireAuth, async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const kv = c.env.NEWSLETTER_KV;
  if (!kv) {
    return c.json({ message: "Cloud storage unavailable" }, 500);
  }

  try {
    const body: any = await c.req.json();
    const personaData = body?.persona !== undefined ? body.persona : body;

    const key = `persona:user_${user.id}`;

    if (!personaData) {
      await kv.delete(key);
      return c.json({ success: true, persona: null });
    }

    await kv.put(key, JSON.stringify(personaData));
    return c.json({ success: true, persona: personaData });
  } catch (err) {
    console.error("Error saving persona to KV:", err);
    return c.json({ message: "Failed to persist persona" }, 500);
  }
});

export { router as personaRoutes };
