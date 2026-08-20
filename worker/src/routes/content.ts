import { Hono } from "hono";
import type { Env } from "../env";
import { cache, MemoryCache } from "../cache";
import { enforceRateLimit } from "../rate-limiter";
import { requireAuth, getUser } from "../auth-middleware";
import type { IStorage } from "../storage";
import {
  quotes,
  celestialObjects,
  cosmicPatterns,
} from "../../../client/src/lib/data";

const router = new Hono<{ Bindings: Env }>();

// Pre-compute ETags for static data
const quotesETag = `"quotes-${quotes.length}"`;
const celestialETag = `"celestial-${celestialObjects.length}"`;
const patternsETag = `"patterns-${cosmicPatterns.length}"`;

/**
 * GET /api/quotes — All quotes (public, cached 24h).
 */
router.get("/quotes", (c) => {
  const ifNoneMatch = c.req.header("If-None-Match");
  if (ifNoneMatch === quotesETag) {
    return c.body(null, 304);
  }
  c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
  c.header("ETag", quotesETag);
  return c.json(quotes);
});

/**
 * GET /api/quotes/random — Random quote (no cache).
 */
router.get("/quotes/random", (c) => {
  c.header("Cache-Control", "no-store");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return c.json(quotes[randomIndex]);
});

/**
 * GET /api/celestial — All celestial objects (public, cached 24h).
 */
router.get("/celestial", (c) => {
  const ifNoneMatch = c.req.header("If-None-Match");
  if (ifNoneMatch === celestialETag) {
    return c.body(null, 304);
  }
  c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
  c.header("ETag", celestialETag);
  return c.json(celestialObjects);
});

/**
 * GET /api/celestial/:id — Single celestial object by ID.
 */
router.get("/celestial/:id", (c) => {
  const id = c.req.param("id");
  const object = celestialObjects.find((obj) => obj.id === id);
  if (!object) {
    return c.json({ message: "Celestial object not found" }, 404);
  }
  c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
  return c.json(object);
});

/**
 * GET /api/cosmic-patterns — All cosmic patterns (public, cached 24h).
 */
router.get("/cosmic-patterns", (c) => {
  const ifNoneMatch = c.req.header("If-None-Match");
  if (ifNoneMatch === patternsETag) {
    return c.body(null, 304);
  }
  c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
  c.header("ETag", patternsETag);
  return c.json(cosmicPatterns);
});

/**
 * GET /api/cosmic-patterns/random — Random cosmic pattern.
 */
router.get("/cosmic-patterns/random", (c) => {
  c.header("Cache-Control", "no-store");
  const randomIndex = Math.floor(Math.random() * cosmicPatterns.length);
  return c.json(cosmicPatterns[randomIndex]);
});

/**
 * GET /api/space-news — Space news from Spaceflight News API (SNAPI v4) + RSS feeds (cached 1 hour).
 */
router.get("/space-news", async (c) => {
  if (!enforceRateLimit(c, { limit: 30, windowSec: 60, keyPrefix: "space-news" })) {
    return c.json({ message: "Rate limit exceeded for space news." }, 429);
  }

  const CACHE_KEY = "space-news-snapi";
  const cached = cache.get<any[]>(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  const items: any[] = [];

  // 1. Primary Source: Spaceflight News API (v4 REST API)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const snapiRes = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=10", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (snapiRes.ok) {
      const snapiData: any = await snapiRes.json();
      if (snapiData && Array.isArray(snapiData.results)) {
        snapiData.results.forEach((art: any) => {
          items.push({
            title: art.title,
            content: art.summary,
            pubDate: art.published_at,
            url: art.url,
            type: "news",
            source: art.news_site || "Spaceflight News",
            image: art.image_url || "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
          });
        });
      }
    }
  } catch (err) {
    console.warn("SNAPI fetch failed, falling back to RSS feeds:", err);
  }

  // 2. Secondary Source: Fallback to RSS Feeds if SNAPI didn't return enough items
  if (items.length < 5) {
    try {
      const [nasaRes, spaceRes] = await Promise.allSettled([
        fetch("https://www.nasa.gov/feed/"),
        fetch("https://www.space.com/feeds/all"),
      ]);

      if (nasaRes.status === "fulfilled" && nasaRes.value.ok) {
        const text = await nasaRes.value.text();
        const nasaItems = parseRssItems(text, "NASA");
        items.push(...nasaItems.slice(0, 4));
      }

      if (spaceRes.status === "fulfilled" && spaceRes.value.ok) {
        const text = await spaceRes.value.text();
        const spaceItems = parseRssItems(text, "Space.com");
        items.push(...spaceItems.slice(0, 4));
      }
    } catch (e) {
      console.warn("RSS feed parsing error:", e);
    }
  }

  // 3. Static Educational Cosmic Facts
  const additionalFacts = [
    {
      title: "James Webb Discovers Most Distant Known Galaxies",
      content: "JWST observations have detected galaxies shining when the universe was only 300 million years old, challenging existing cosmological models of early cosmic structure.",
      url: "https://webbtelescope.org/news",
      type: "fact",
      source: "JWST Science",
      image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Jupiter's Great Red Spot & Storm Dynamics",
      content: "Jupiter's Great Red Spot is a giant, spinning storm that has been observed for over 350 years. The storm is so vast that Earth could fit entirely inside it.",
      url: "https://science.nasa.gov/jupiter/",
      type: "fact",
      source: "NASA Planetary",
      image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1000&q=80",
    },
    {
      title: "Black Hole at the Center of the Milky Way",
      content: "At the center of our Milky Way lies Sagittarius A*, a supermassive black hole with a mass 4.3 million times that of our Sun, warping space-time itself.",
      url: "https://www.nasa.gov/image-article/our-black-hole/",
      type: "fact",
      source: "Astrophysics",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const allItems = [...items, ...additionalFacts];

  cache.set(CACHE_KEY, allItems, MemoryCache.TTL.SPACE_NEWS);
  c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=300");
  c.header("X-Cache", "MISS");
  return c.json(allItems);
});

/**
 * GET /api/medium-posts — Medium blog feed (cached 30 min).
 */
router.get("/medium-posts", async (c) => {
  const CACHE_KEY = "medium-posts";
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  const mediumUsername = c.env.MEDIUM_USERNAME || "cosmicchanneling";

  try {
    const res = await fetch(`https://medium.com/feed/@${mediumUsername}`);
    if (!res.ok) {
      throw new Error(`Medium RSS returned ${res.status}`);
    }

    const text = await res.text();
    const feed = parseMediumRss(text, mediumUsername);

    const result = { posts: feed, total: feed.length, source: "Medium RSS" };
    cache.set(CACHE_KEY, result, MemoryCache.TTL.RSS_FEED);
    c.header("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
    c.header("X-Cache", "MISS");
    return c.json(result);
  } catch (error) {
    console.error("Medium RSS error:", error);
    return c.json(
      {
        error: "Failed to fetch Medium posts",
        message: "Unable to fetch posts from Medium RSS feed.",
        posts: [],
      },
      500,
    );
  }
});

// --- Helper: simple RSS XML parser (no external deps) ---

function parseRssItems(xml: string, source: string): any[] {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const content = extractTag(itemXml, "description") || extractTag(itemXml, "content:encoded") || "";
    const pubDate = extractTag(itemXml, "pubDate");
    const link = extractTag(itemXml, "link");
    const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]+)"/);
    const image = enclosureMatch ? enclosureMatch[1] : undefined;

    if (title) {
      items.push({
        title: decodeHtml(title),
        content: stripHtml(content).substring(0, 300),
        pubDate,
        url: link,
        type: "news",
        source,
        image: image || "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80",
      });
    }
  }

  return items;
}

function parseMediumRss(xml: string, username: string): any[] {
  const posts: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const content = extractTag(itemXml, "content:encoded") || extractTag(itemXml, "description") || "";
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");
    const guid = extractTag(itemXml, "guid");
    const creator = extractTag(itemXml, "dc:creator") || username;

    const categories: string[] = [];
    const catRegex = /<category[^>]*>([^<]+)<\/category>/gi;
    let catMatch: RegExpExecArray | null;
    while ((catMatch = catRegex.exec(itemXml)) !== null) {
      categories.push(catMatch[1]);
    }

    const plainText = stripHtml(content).replace(/\s+/g, " ").trim();
    let excerpt = plainText.substring(0, 200);
    if (plainText.length > 200) excerpt += "...";

    if (title) {
      posts.push({
        id: guid || `post-${index}`,
        title: decodeHtml(title),
        content: plainText,
        excerpt,
        url: link || "",
        publishedAt: pubDate || new Date().toISOString(),
        author: {
          id: username,
          username,
          name: creator || username,
          url: `https://medium.com/@${username}`,
        },
        tags: categories,
      });
      index++;
    }
  }

  return posts;
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = regex.exec(xml);
  if (!match) return null;
  return (match[1] || match[2] || "").trim() || null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/**
 * GET /api/journal-entries — Get all journal entries for the authenticated user.
 */
router.get("/journal-entries", requireAuth, async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const storage: IStorage = c.get("storage");
  const entries = await storage.getJournalEntriesByUserId(user.id);
  return c.json(entries);
});

/**
 * POST /api/journal-entries — Create a journal entry for the authenticated user.
 */
router.post("/journal-entries", requireAuth, async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const body = await c.req.json();
  if (!body.text || typeof body.text !== "string") {
    return c.json({ message: "Journal text is required" }, 400);
  }

  const storage: IStorage = c.get("storage");
  const entry = await storage.createJournalEntry({
    userId: user.id,
    text: body.text,
    tags: Array.isArray(body.tags) ? body.tags : null,
  });

  return c.json(entry, 201);
});

/**
 * PUT /api/journal-entries/:id — Update a journal entry.
 */
router.put("/journal-entries/:id", requireAuth, async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const paramId = c.req.param("id");
  const id = parseInt(paramId || "0", 10);
  const storage: IStorage = c.get("storage");
  const existing = await storage.getJournalEntry(id);

  if (!existing || existing.userId !== user.id) {
    return c.json({ message: "Entry not found or forbidden" }, 404);
  }

  const body = await c.req.json();
  const updated = await storage.updateJournalEntry(id, {
    text: body.text ?? existing.text,
    tags: Array.isArray(body.tags) ? body.tags : existing.tags,
  });

  return c.json(updated);
});

/**
 * DELETE /api/journal-entries/:id — Delete a journal entry.
 */
router.delete("/journal-entries/:id", requireAuth, async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const paramId = c.req.param("id");
  const id = parseInt(paramId || "0", 10);
  const storage: IStorage = c.get("storage");
  const existing = await storage.getJournalEntry(id);

  if (!existing || existing.userId !== user.id) {
    return c.json({ message: "Entry not found or forbidden" }, 404);
  }

  const deleted = await storage.deleteJournalEntry(id);
  return c.json({ success: deleted });
});

export { router as contentRoutes };
