import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { Env } from "./env";
import { authMiddleware } from "./auth-middleware";
import { authRoutes } from "./routes/auth";
import { contentRoutes } from "./routes/content";
import { toolsRoutes } from "./routes/tools";
import { newsletterRoutes } from "./routes/newsletter";
import { traditionsRoutes } from "./routes/traditions";
import { MemStorage, DatabaseStorage, type IStorage } from "./storage";
import { getDb } from "./db";

// Extend Hono's ContextVariableMap for our custom variables
declare module "hono" {
  interface ContextVariableMap {
    storage: IStorage;
  }
}

const app = new Hono<{ Bindings: Env }>();

// --- Global Middleware ---

// CORS — allow frontend to call API with credentials
app.use("*", cors({ origin: "*", credentials: true }));

// Request logger
app.use("*", logger());

// Storage middleware — attaches the storage implementation to context
// Uses DatabaseStorage when DATABASE_URL is set, otherwise MemStorage
app.use("*", async (c, next) => {
  if (c.env.DATABASE_URL) {
    const db = getDb(c.env.DATABASE_URL);
    c.set("storage", new DatabaseStorage(db));
  } else {
    c.set("storage", new MemStorage());
    console.warn("DATABASE_URL not set — using in-memory storage (data lost on restart)");
  }
  await next();
});

// Auth middleware — extracts JWT from cookie and sets c.var.user
app.use("*", authMiddleware);

// --- API Routes ---

app.route("/api", authRoutes);
app.route("/api", contentRoutes);
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

// --- 404 for unknown API routes ---

app.notFound((c) => {
  if (c.req.path.startsWith("/api")) {
    return c.json({ message: "Not found" }, 404);
  }
  // Non-API routes: let the static assets handler serve the SPA
  return c.body(null, 404);
});

// --- Error Handler ---

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ message: "Internal server error" }, 500);
});

// --- SPA Fallback Middleware ---
// For any non-API request that doesn't match a static asset,
// serve index.html so the React router can handle client-side routing.

app.all("*", async (c) => {
  if (c.req.path.startsWith("/api")) {
    return c.json({ message: "Not found" }, 404);
  }

  try {
    // Try to serve the static asset first via the ASSETS binding
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    if (asset.status !== 404) {
      return asset;
    }
  } catch {
    // ASSETS.fetch threw — fall through to SPA handler
  }

  // SPA fallback: serve index.html for all non-file, non-API routes
  const indexHtml = await c.env.ASSETS.fetch(
    new Request(new URL("/index.html", c.req.url), c.req.raw),
  );
  return indexHtml;
});

export default app;
