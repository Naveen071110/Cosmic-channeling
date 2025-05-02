import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const PgSessionStore = connectPgSimple(session);
  const sessionStore = new PgSessionStore({
    pool,
    tableName: 'session', // Default is 'session'
    createTableIfMissing: true // Create the session table if it doesn't exist
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "cosmic_channeling_secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_REDIRECT_URI || '/api/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists by email
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email provided by Google'));
            }

            let user = await storage.getUserByEmail(email);

            // If user doesn't exist, create a new one
            if (!user) {
              // Generate a random username if none is provided by Google
              const username = profile.displayName?.replace(/\s+/g, '') || 
                               `user${Math.floor(Math.random() * 10000)}`;
              
              // Generate a random secure password since they'll use Google to login
              const password = await hashPassword(randomBytes(16).toString('hex'));
              
              user = await storage.createUser({
                username,
                email,
                password,
                isSubscribed: false
              });
            }

            return done(null, user);
          } catch (error) {
            return done(error as Error);
          }
        }
      )
    );
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration request body:", req.body);
      
      // Validate required fields
      if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }
      
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) {
          console.error("Login after registration error:", err);
          return next(err);
        }
        console.log("User registered and logged in successfully:", user.id);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Error during registration", error: String(error) });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: SelectUser | false, info: { message: string }) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid username or password" });
      
      req.login(user, (err: Error | null) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err: Error | null) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  
  // Subscription status update
  app.post("/api/user/subscription", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    // TODO: In a real application, we would verify this with the Stripe webhook
    // For now, we'll just simulate updating the subscription status
    const isSubscribed = req.body.isSubscribed === true;
    
    storage.updateUserSubscription(req.user.id, isSubscribed)
      .then((updatedUser: SelectUser | undefined) => {
        res.json(updatedUser);
      })
      .catch((error: Error) => {
        console.error("Subscription update error:", error);
        res.status(500).json({ message: "Error updating subscription" });
      });
  });

  // Google OAuth routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Route to start Google OAuth flow
    app.get('/api/auth/google', 
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    // Google OAuth callback route
    app.get('/api/auth/google/callback', 
      passport.authenticate('google', { 
        failureRedirect: '/auth',
        session: true
      }),
      (req, res) => {
        // Successful authentication, redirect to home
        res.redirect('/');
      }
    );
  }
}