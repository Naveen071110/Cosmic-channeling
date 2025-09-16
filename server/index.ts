import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { z } from "zod";
import compression from "compression";
import path from "path";
import { registerRoutes } from "./routes.js";
import { log, serveStatic } from "./vite.js";
// @ts-ignore - JS config file
import { applyEnvironmentConfig } from "../config/environment.js";
// @ts-ignore - JS monitoring script  
import ResourceMonitor from "../scripts/resource-monitor.js";

// Apply environment configuration at startup
applyEnvironmentConfig();

// Initialize resource monitor for production
const resourceMonitor = new ResourceMonitor();
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_RESOURCE_MONITORING === 'true') {
  resourceMonitor.start();
}

// Lazy load heavy dependencies
const loadDB = () => import("./db.js").then(m => m.db);
const loadAuth = () => import("./auth.js").then(m => m.setupAuth);
const loadVite = () => import("./vite.js").then(m => m.setupVite);

// Apply deployment optimizations for production
if (process.env.NODE_ENV === 'production') {
  // Set resource limits and monitoring
  process.env.MAX_CONCURRENT_REQUESTS = process.env.MAX_CONCURRENT_REQUESTS || '15';
  process.env.IDLE_TIMEOUT_SECONDS = process.env.IDLE_TIMEOUT_SECONDS || '120';
  process.env.ENABLE_COMPRESSION = process.env.ENABLE_COMPRESSION || 'true';
  
  console.log('🔧 Production optimizations enabled');
}

const app = express();

// Enable compression middleware in production
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_COMPRESSION === 'true') {
  app.use(compression({ level: parseInt(process.env.COMPRESSION_LEVEL || '6') }));
  console.log('📦 Compression enabled');
}

// HTTP keep-alive configuration for production
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_KEEP_ALIVE === 'true') {
  app.use((req, res, next) => {
    res.set('Connection', 'keep-alive');
    res.set('Keep-Alive', 'timeout=5, max=1000');
    next();
  });
  console.log('🔗 HTTP Keep-Alive enabled');
}

// Resource optimization middleware for production
if (process.env.NODE_ENV === 'production') {
  // Limit concurrent requests per instance
  const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '15');
  let activeConnections = 0;
  
  app.use((req, res, next) => {
    if (activeConnections >= maxConcurrent) {
      return res.status(503).json({ error: 'Server busy, please try again' });
    }
    
    activeConnections++;
    
    // Handle both 'finish' and 'close' events to properly decrement counter
    let connectionDecremented = false;
    const decrementConnection = () => {
      if (connectionDecremented) return;
      connectionDecremented = true;
      activeConnections = Math.max(0, activeConnections - 1);
    };
    res.once('finish', decrementConnection);
    res.once('close', decrementConnection);
    
    next();
  });
  
  // Set timeout for idle connections
  const idleTimeout = parseInt(process.env.IDLE_TIMEOUT_SECONDS || '120') * 1000;
  app.use((req, res, next) => {
    req.setTimeout(idleTimeout);
    res.setTimeout(idleTimeout);
    next();
  });
  
  console.log(`🚀 Resource limits: ${maxConcurrent} concurrent, ${idleTimeout}ms timeout`);
}

app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

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
    setupAuth(app);
    servicesInitialized = true;
  }
  next();
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

// Static content optimization middleware - must be before Vite setup
if (app.get("env") === "production") {
  // Enhanced static asset serving with aggressive caching
  app.use('/assets', express.static(path.resolve(import.meta.dirname, 'dist/public/assets'), {
    maxAge: '1y', // 1 year cache
    etag: true,
    lastModified: true,
    immutable: true,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      
      // Security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // Aggressive caching for hashed assets
      if (['.js', '.css'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, must-revalidate');
      } else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('Accept-Ranges', 'bytes');
      }
      
      // Compression hints
      if (['.js', '.css', '.html', '.json', '.xml', '.svg'].includes(ext)) {
        res.setHeader('Vary', 'Accept-Encoding');
      }
    }
  }));

  // Audio files with range request support
  app.use('/audio', express.static(path.resolve(import.meta.dirname, 'dist/public/audio'), {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));

  // Images with long cache
  app.use('/images', express.static(path.resolve(import.meta.dirname, 'dist/public/images'), {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, filePath) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, must-revalidate');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));
}

// Static page routes for pre-rendered HTML (production only)
if (app.get("env") === "production") {
  const staticPagesDir = path.resolve(import.meta.dirname, 'dist/public');
  
  // Static page route handlers with proper caching
  const serveStaticPage = (filename: string) => (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(staticPagesDir, filename);
    
    // Set static page headers
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Static-Page', 'true');
    
    // Serve the static HTML file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`Failed to serve static page ${filename}:`, err);
        next(); // Fall through to Vite handler
      }
    });
  };
  
  // Define static routes for pre-rendered pages
  app.get('/', serveStaticPage('index.html'));
  app.get('/pricing', serveStaticPage('pricing.html'));
  app.get('/privacy-policy', serveStaticPage('privacy-policy.html'));
  app.get('/terms-of-service', serveStaticPage('terms-of-service.html'));
  app.get('/404', serveStaticPage('404.html'));
  
  console.log('🗂️  Static page routes configured for production');
}


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
    // Production static serving with enhanced 404 handling
    serveStatic(app);
    
    // Enhanced 404 middleware for production (before SPA fallback)
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      
      // Skip API routes
      if (url.startsWith('/api')) {
        return next();
      }
      
      // Try to serve 404.html for unknown routes
      const staticPagesDir = path.resolve(import.meta.dirname, 'dist/public');
      const notFoundPath = path.join(staticPagesDir, '404.html');
      
      try {
        if (fs.existsSync(notFoundPath)) {
          res.status(404);
          res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
          res.setHeader('X-Static-Page', 'true');
          res.setHeader('X-Route-Type', '404-static');
          return res.sendFile(notFoundPath);
        }
      } catch (error) {
        console.warn('Failed to serve static 404 page:', error.message);
      }
      
      // Fallback to SPA handling (already handled by serveStatic)
      next();
    });
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