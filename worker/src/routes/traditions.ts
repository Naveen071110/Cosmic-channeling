import { Hono } from "hono";
import type { Env } from "../env";
import { cache, MemoryCache } from "../cache";
import type { IStorage } from "../storage";

const router = new Hono<{ Bindings: Env }>();

/**
 * GET /api/traditions — All traditions (cached 1h).
 */
router.get("/traditions", async (c) => {
  const CACHE_KEY = "traditions-all";
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(cached);
  }

  try {
    const storage: IStorage = c.get("storage");
    const traditions = await storage.getAllTraditions();
    cache.set(CACHE_KEY, traditions, MemoryCache.TTL.DB_LIST);
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(traditions);
  } catch (error) {
    console.error("Error fetching traditions:", error);
    return c.json({ error: "Failed to fetch traditions" }, 500);
  }
});

/**
 * GET /api/traditions/featured — Featured traditions (cached 1h).
 */
router.get("/traditions/featured", async (c) => {
  const CACHE_KEY = "traditions-featured";
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(cached);
  }

  try {
    const storage: IStorage = c.get("storage");
    const traditions = await storage.getFeaturedTraditions();
    cache.set(CACHE_KEY, traditions, MemoryCache.TTL.DB_LIST);
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(traditions);
  } catch (error) {
    console.error("Error fetching featured traditions:", error);
    return c.json({ error: "Failed to fetch featured traditions" }, 500);
  }
});

/**
 * GET /api/traditions/:id — Single tradition by ID (cached 30min).
 */
router.get("/traditions/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const CACHE_KEY = `tradition-${id}`;
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(cached);
  }

  try {
    const storage: IStorage = c.get("storage");
    const tradition = await storage.getTradition(id);
    if (!tradition) {
      return c.json({ error: "Tradition not found" }, 404);
    }
    cache.set(CACHE_KEY, tradition, MemoryCache.TTL.DB_ITEM);
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(tradition);
  } catch (error) {
    console.error("Error fetching tradition:", error);
    return c.json({ error: "Failed to fetch tradition" }, 500);
  }
});

/**
 * GET /api/traditions/slug/:slug — Single tradition by slug (cached 30min).
 */
router.get("/traditions/slug/:slug", async (c) => {
  const { slug } = c.req.param();
  const CACHE_KEY = `tradition-slug-${slug}`;
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(cached);
  }

  try {
    const storage: IStorage = c.get("storage");
    const tradition = await storage.getTraditionBySlug(slug);
    if (!tradition) {
      return c.json({ error: "Tradition not found" }, 404);
    }
    cache.set(CACHE_KEY, tradition, MemoryCache.TTL.DB_ITEM);
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    return c.json(tradition);
  } catch (error) {
    console.error("Error fetching tradition by slug:", error);
    return c.json({ error: "Failed to fetch tradition" }, 500);
  }
});

export { router as traditionsRoutes };
