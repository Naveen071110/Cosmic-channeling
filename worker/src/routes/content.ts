import { Hono } from "hono";
import type { Env } from "../env";
import { cache, MemoryCache } from "../cache";
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
 * GET /api/space-news — Space news from NASA + Space.com RSS feeds (cached 30 min).
 */
router.get("/space-news", async (c) => {
  const CACHE_KEY = "space-news";
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  try {
    // Fetch RSS feeds
    const [nasaRes, spaceRes] = await Promise.allSettled([
      fetch("https://www.nasa.gov/feed/"),
      fetch("https://www.space.com/feeds/all"),
    ]);

    const items: any[] = [];

    // Parse NASA feed
    if (nasaRes.status === "fulfilled" && nasaRes.value.ok) {
      const text = await nasaRes.value.text();
      const nasaItems = parseRssItems(text, "NASA");
      items.push(...nasaItems.slice(0, 5));
    }

    // Parse Space.com feed
    if (spaceRes.status === "fulfilled" && spaceRes.value.ok) {
      const text = await spaceRes.value.text();
      const spaceItems = parseRssItems(text, "Space.com");
      items.push(...spaceItems.slice(0, 5));
    }

    // Add static space facts
    const additionalFacts = [
      {
        title: "Jupiter's Great Red Spot",
        content: "Jupiter's Great Red Spot is a giant, spinning storm that has been observed for more than 350 years. The storm is so large that about three Earths could fit inside it.",
        url: "https://science.nasa.gov/jupiter/",
        type: "fact",
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA24237_800.jpg",
      },
      {
        title: "Saturn's Rings",
        content: "Saturn's magnificent rings are made up of billions of particles of ice and rock, ranging in size from tiny dust grains to objects as large as mountains.",
        url: "https://science.nasa.gov/saturn/",
        type: "fact",
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA03545-scaled.jpg",
      },
      {
        title: "Black Hole at the Center of the Milky Way",
        content: "At the center of our Milky Way galaxy lies a supermassive black hole named Sagittarius A*, which has a mass of about 4 million times that of our Sun.",
        url: "https://www.nasa.gov/image-article/our-black-hole/",
        type: "fact",
        image: "https://www.nasa.gov/wp-content/uploads/2023/03/blackhole-milkyway.jpg",
      },
      {
        title: "Voyager Missions",
        content: "NASA's Voyager 1 and 2 spacecraft are the only human-made objects to have entered interstellar space. Launched in 1977, they continue to send back data from beyond our solar system.",
        url: "https://voyager.jpl.nasa.gov/",
        type: "fact",
        image: "https://voyager.jpl.nasa.gov/assets/images/gallery/voyager-spacecraft.jpg",
      },
      {
        title: "Venus: Earth's Evil Twin",
        content: "Venus is often called Earth's 'evil twin' because while similar in size and composition to Earth, its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system with surface temperatures hot enough to melt lead.",
        url: "https://science.nasa.gov/venus/",
        type: "fact",
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA00271-Venus-Computer-Simulated-Global-View-of-the-Northern-Hemisphere-scaled.jpg",
      },
    ];

    const allItems = [...items, ...additionalFacts].sort(() => 0.5 - Math.random());

    cache.set(CACHE_KEY, allItems, MemoryCache.TTL.RSS_FEED);
    c.header("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
    c.header("X-Cache", "MISS");
    return c.json(allItems);
  } catch (error) {
    console.error("Error fetching space news:", error);
    return c.json(
      {
        message: "Error fetching space news",
        fallbackData: true,
        data: [
          {
            title: "Jupiter's Great Red Spot",
            content: "Jupiter's Great Red Spot is a giant, spinning storm that has been observed for more than 350 years.",
            type: "fact",
            url: "https://science.nasa.gov/jupiter/",
          },
        ],
      },
      500,
    );
  }
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
        image,
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

    // Extract categories
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

export { router as contentRoutes };
