import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { z } from "zod";

// Lazy load heavy dependencies
const loadDB = () => import("./db.js").then(m => m.db);
const loadAuth = () => import("./auth.js").then(m => m.setupAuth);
const loadAuthRoutes = () => import("./routes/auth.js").then(m => m.authRoutes);
const loadNewsletterRoutes = () => import("./routes/newsletter.js").then(m => m.newsletterRoutes);
const loadVite = () => import("./vite.js").then(m => m.setupVite);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cosmic-channeling-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize services lazily on first request
let servicesInitialized = false;
app.use(async (req, res, next) => {
  if (!servicesInitialized) {
    const setupAuth = await loadAuth();
    setupAuth();
    servicesInitialized = true;
  }
  next();
});

// Lazy load routes
app.use("/api/auth", async (req, res, next) => {
  const { authRoutes } = await loadAuthRoutes();
  authRoutes(req, res, next);
});

app.use("/api", async (req, res, next) => {
  const { newsletterRoutes } = await loadNewsletterRoutes();
  newsletterRoutes(req, res, next);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const setupVite = await loadVite();
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const PORT = 5000;

  // Global error handlers to prevent crashes
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit, just log the error
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit, just log the error
  });

  // Express error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Express error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${PORT}`);
  });
})();