import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { Env } from "./env";
import { authMiddleware } from "./auth-middleware";
import { authRoutes } from "./routes/auth";
import { contentRoutes } from "./routes/content";
import { cosmicApiRoutes } from "./routes/cosmic-api";
import { toolsRoutes } from "./routes/tools";
import { newsletterRoutes } from "./routes/newsletter";
import { traditionsRoutes } from "./routes/traditions";
import { personaRoutes } from "./routes/persona";
import { MemStorage, DatabaseStorage, KVStorage, type IStorage } from "./storage";
import { getDb } from "./db";

// Extend Hono's ContextVariableMap for our custom variables
declare module "hono" {
  interface ContextVariableMap {
    storage: IStorage;
  }
}

const app = new Hono<{ Bindings: Env }>();

const NOT_FOUND_MARKDOWN = `# 404 Not Found
The requested resource does not exist on Cosmic Channeling.
- Sitemap: [https://cosmic-channeling.vercel.app/sitemap.xml](https://cosmic-channeling.vercel.app/sitemap.xml)
- Agent Docs: [https://cosmic-channeling.vercel.app/llms.txt](https://cosmic-channeling.vercel.app/llms.txt)
- OpenAPI Spec: [https://cosmic-channeling.vercel.app/openapi.json](https://cosmic-channeling.vercel.app/openapi.json)
- Developer Portal: [https://cosmic-channeling.vercel.app/developers](https://cosmic-channeling.vercel.app/developers)
`;

const HOME_MARKDOWN = `# Cosmic Channeling — Deep Space & Meditation Sanctuary

> Connect with the living cosmos through real-time Solfeggio soundscapes (432Hz / 528Hz), a 30+ HD Celestial Atlas, guided meditation journeys, and live NASA deep-space observation feeds.

## Core Capabilities & Features
- **Procedural Web Audio Synthesizer**: Pure harmonic frequencies generated directly in browser (432Hz Peace, 528Hz Vitality, 6Hz Theta binaural beat carriers, Tibetan singing bowl physical modeling).
- **Interactive 4-4-4-4 Box Breathing Guide**: Synchronized visual breath pacer with customizable session timers (1m–30m).
- **30+ HD Celestial Atlas**: Curated deep-space catalog with astronomical telemetry (Solar System, Andromeda, Whirlpool, JWST Carina Cliffs, Pillars of Creation, Habitable Exoplanets, Black Holes).
- **Live NASA APOD & Spaceflight News**: Real-time integration with NASA Astronomy Picture of the Day and Spaceflight News API (SNAPI v4).
- **Astro-Journal**: Private cloud-synchronized reflection vault for cosmic thoughts and dream insights.
- **Developer Hub & OpenAPI 3.1**: Machine-readable function-calling specifications for autonomous AI agents.

## Machine-Readable Resources
- [OpenAPI 3.1 Specification](https://cosmic-channeling.vercel.app/openapi.json)
- [llms.txt Discovery Guide](https://cosmic-channeling.vercel.app/llms.txt)
- [Full LLM Documentation](https://cosmic-channeling.vercel.app/llms-full.txt)
- [XML Sitemap](https://cosmic-channeling.vercel.app/sitemap.xml)
- [Developer Hub](https://cosmic-channeling.vercel.app/developers)

## Navigation Index
- [Meditation Sanctuary](https://cosmic-channeling.vercel.app/meditate)
- [Celestial Atlas](https://cosmic-channeling.vercel.app/explore)
- [Astro-Journal](https://cosmic-channeling.vercel.app/journal)
- [Profile & Celestial Alignment](https://cosmic-channeling.vercel.app/profile)
- [Cosmic Tools](https://cosmic-channeling.vercel.app/tools)
- [Spiritual Traditions](https://cosmic-channeling.vercel.app/religions)
- [Blog](https://cosmic-channeling.vercel.app/blog)
- [About Us](https://cosmic-channeling.vercel.app/about)
- [Contact Support](https://cosmic-channeling.vercel.app/contact)
- [Privacy Policy](https://cosmic-channeling.vercel.app/privacy)
- [Terms of Service](https://cosmic-channeling.vercel.app/terms)
`;

// --- Global Middleware ---

// CORS — securely allow frontend origins to call API with credentials
app.use(
  "*",
  cors({
    origin: (origin) => origin || "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept", "X-CSRF-Token"],
  })
);

// Request logger
app.use("*", logger());

// Add Vary header globally for content negotiation
app.use("*", async (c, next) => {
  await next();
  c.header("Vary", "Accept, Accept-Encoding");
});

// Markdown content negotiation for root and documentation requests
app.use("*", async (c, next) => {
  const accept = c.req.header("Accept") || "";
  const path = c.req.path;
  
  if (accept.includes("text/markdown") && (path === "/" || path === "" || path === "/index.html")) {
    c.header("Content-Type", "text/markdown; charset=utf-8");
    c.header("Vary", "Accept, Accept-Encoding");
    return c.body(HOME_MARKDOWN, 200);
  }
  await next();
});

// Storage middleware — attaches the storage implementation to context
app.use("*", async (c, next) => {
  if (c.env.DATABASE_URL) {
    const db = getDb(c.env.DATABASE_URL);
    c.set("storage", new DatabaseStorage(db));
  } else if (c.env.NEWSLETTER_KV) {
    c.set("storage", new KVStorage(c.env.NEWSLETTER_KV));
  } else {
    c.set("storage", new MemStorage());
  }
  await next();
});

// Auth middleware — extracts JWT from cookie and sets c.var.user
app.use("*", authMiddleware);

// --- API Routes ---

app.route("/api", authRoutes);
app.route("/api", personaRoutes);
app.route("/api", contentRoutes);
app.route("/api", cosmicApiRoutes);
app.route("/api", toolsRoutes);
app.route("/api/newsletter", newsletterRoutes);
app.route("/api", traditionsRoutes);

// --- Health Check ---

app.get("/api/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || "development",
  });
});

// --- 404 for unknown routes ---

app.notFound((c) => {
  c.header("Content-Type", "text/markdown; charset=utf-8");
  c.header("Vary", "Accept, Accept-Encoding");
  return c.body(NOT_FOUND_MARKDOWN, 404);
});

// --- Error Handler ---

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ message: "Internal server error" }, 500);
});

// --- Static Asset / SPA Fallback ---

app.all("*", async (c) => {
  if (c.req.path.startsWith("/api")) {
    c.header("Content-Type", "text/markdown; charset=utf-8");
    c.header("Vary", "Accept, Accept-Encoding");
    return c.body(NOT_FOUND_MARKDOWN, 404);
  }

  try {
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    if (asset.status !== 404) {
      return asset;
    }
  } catch {
    // ASSETS.fetch threw — fall through
  }

  // If path is unknown on worker, return agent 404 markdown
  const validWorkerPages = new Set([
    "/",
    "/meditate",
    "/explore",
    "/journal",
    "/profile",
    "/tools",
    "/blog",
    "/religions",
    "/subscribe",
    "/auth",
    "/terms",
    "/privacy",
    "/about",
    "/contact",
    "/developers",
    "/docs",
  ]);

  if (!validWorkerPages.has(c.req.path.replace(/\/$/, "") || "/")) {
    c.header("Content-Type", "text/markdown; charset=utf-8");
    c.header("Vary", "Accept, Accept-Encoding");
    return c.body(NOT_FOUND_MARKDOWN, 404);
  }

  // SPA fallback for valid routes
  const indexHtml = await c.env.ASSETS.fetch(
    new Request(new URL("/index.html", c.req.url), c.req.raw),
  );
  return indexHtml;
});

export default app;
