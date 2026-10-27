import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Env } from "../env";
import { signToken, buildCookieHeader, buildClearCookieHeader } from "../jwt";
import { hashPassword, verifyPassword } from "../password";
import { authMiddleware, requireAuth, getUser } from "../auth-middleware";
import { getGoogleAuthUrl, handleGoogleCallback, authenticateWithGoogle } from "../google-auth";
import { enforceRateLimit } from "../rate-limiter";
import type { IStorage } from "../storage";

const router = new Hono<{ Bindings: Env }>();

// Apply auth middleware to all auth routes
router.use("*", authMiddleware);

function getJwtSecret(env: Env): string {
  if (env.JWT_SECRET && env.JWT_SECRET.length >= 32) return env.JWT_SECRET;
  if (env.ENVIRONMENT === "production") {
    throw new Error("[CRITICAL] JWT_SECRET must be configured with at least 32 characters in production.");
  }
  return "dev-secret-change-in-production-cosmic-key-minimum-32-chars";
}

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  isSubscribed: z.boolean().optional().default(false),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * POST /api/register — Create a new user account.
 */
router.post("/register", zValidator("json", registerSchema), async (c) => {
  if (!enforceRateLimit(c, { limit: 5, windowSec: 60, keyPrefix: "auth-register" })) {
    return c.json({ message: "Registration rate limit exceeded. Please wait a moment." }, 429);
  }

  const body = c.req.valid("json");
  const storage: IStorage = c.get("storage");

  // Check for existing username
  const existingUser = await storage.getUserByUsername(body.username);
  if (existingUser) {
    return c.json({ message: "Username already taken" }, 409);
  }

  // Check for existing email
  const existingEmail = await storage.getUserByEmail(body.email);
  if (existingEmail) {
    return c.json({ message: "Email already registered" }, 409);
  }

  // Hash password
  const hashedPassword = await hashPassword(body.password);

  // Create user (default isSubscribed to false regardless of client input)
  const user = await storage.createUser({
    username: body.username,
    email: body.email,
    password: hashedPassword,
    isSubscribed: false,
  });

  // Sign JWT
  const secret = getJwtSecret(c.env);
  const token = await signToken(
    { id: user.id, username: user.username, email: user.email, isSubscribed: user.isSubscribed },
    secret,
  );

  const isProd = c.env.ENVIRONMENT === "production" || !c.req.url.includes("localhost");
  c.header("Set-Cookie", buildCookieHeader(token, isProd));
  return c.json({
    id: user.id,
    username: user.username,
    email: user.email,
    isSubscribed: user.isSubscribed,
    createdAt: user.createdAt,
  }, 201);
});

/**
 * POST /api/login — Authenticate and create a session.
 */
router.post("/login", zValidator("json", loginSchema), async (c) => {
  if (!enforceRateLimit(c, { limit: 10, windowSec: 60, keyPrefix: "auth-login" })) {
    return c.json({ message: "Too many login attempts. Please wait a moment." }, 429);
  }

  const body = c.req.valid("json");
  const storage: IStorage = c.get("storage");

  // Find user
  const user = await storage.getUserByUsername(body.username);
  if (!user) {
    return c.json({ message: "Invalid username or password" }, 401);
  }

  // Verify password
  const valid = await verifyPassword(body.password, user.password);
  if (!valid) {
    return c.json({ message: "Invalid username or password" }, 401);
  }

  // Sign JWT
  const secret = getJwtSecret(c.env);
  const token = await signToken(
    { id: user.id, username: user.username, email: user.email, isSubscribed: user.isSubscribed },
    secret,
  );

  const isProd = c.env.ENVIRONMENT === "production" || !c.req.url.includes("localhost");
  c.header("Set-Cookie", buildCookieHeader(token, isProd));
  return c.json({
    id: user.id,
    username: user.username,
    email: user.email,
    isSubscribed: user.isSubscribed,
    createdAt: user.createdAt,
  });
});

/**
 * POST /api/logout — Clear the session cookie.
 */
router.post("/logout", async (c) => {
  const isProd = c.env.ENVIRONMENT === "production" || !c.req.url.includes("localhost");
  c.header("Set-Cookie", buildClearCookieHeader(isProd));
  return c.json({ message: "Logged out" });
});

/**
 * GET /api/user — Return the current user (or null/401).
 */
router.get("/user", async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json(null);
  }

  // Optionally refresh user data from storage
  const storage: IStorage = c.get("storage");
  const freshUser = await storage.getUser(user.id);
  if (!freshUser) {
    return c.json(null);
  }

  return c.json({
    id: freshUser.id,
    username: freshUser.username,
    email: freshUser.email,
    isSubscribed: freshUser.isSubscribed,
    createdAt: freshUser.createdAt,
  });
});

/**
 * POST /api/user/subscription — Update subscription status.
 */
router.post("/user/subscription", requireAuth, async (c) => {
  const user = getUser(c);
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const storage: IStorage = c.get("storage");
  const body = await c.req.json();

  if (typeof body.isSubscribed !== "boolean") {
    return c.json({ message: "Invalid subscription status" }, 400);
  }

  // Self-promotion to subscribed is blocked without verified payment checkout
  if (body.isSubscribed === true) {
    return c.json(
      { message: "Subscription activation requires verified payment checkout." },
      403
    );
  }

  const updatedUser = await storage.updateUserSubscription(user.id, body.isSubscribed);
  if (!updatedUser) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json({
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    isSubscribed: updatedUser.isSubscribed,
    createdAt: updatedUser.createdAt,
  });
});

/**
 * GET /api/auth/google — Initiate Google OAuth flow.
 * Redirects the user to Google's consent screen.
 */
router.get("/auth/google", async (c) => {
  try {
    const { url, stateCookie } = await getGoogleAuthUrl(c.env);
    c.header("Set-Cookie", stateCookie);
    return c.redirect(url);
  } catch (error: any) {
    console.error("Google auth error:", error);
    return c.redirect(`/?error=auth_error&message=${encodeURIComponent(error.message || "Google auth failed")}`);
  }
});

/**
 * GET /api/auth/google/callback — Handle Google OAuth callback.
 */
router.get("/auth/google/callback", async (c) => {
  try {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");

    if (error) {
      console.error("Google OAuth error:", error);
      return c.redirect("/auth?error=auth_failed");
    }

    if (!code || !state) {
      return c.redirect("/auth?error=login_error");
    }

    // Verify state matches the cookie (CSRF protection)
    const cookieHeader = c.req.header("Cookie");
    const cookies = (cookieHeader || "").split(";").map((s) => s.trim());
    const stateCookie = cookies
      .find((c) => c.startsWith("google_oauth_state="))
      ?.split("=")[1];

    if (!stateCookie || stateCookie !== state) {
      console.error("Google OAuth state mismatch");
      return c.redirect("/auth?error=auth_error");
    }

    // Exchange code for tokens and get user info
    const googleUser = await handleGoogleCallback(c.env, code);
    const secret = getJwtSecret(c.env);
    const storage: IStorage = c.get("storage");

    const { setCookie } = await authenticateWithGoogle(googleUser, storage, secret);

    // Set JWT cookie and redirect to frontend
    c.header("Set-Cookie", setCookie);
    return c.redirect("/?auth=success");
  } catch (error: any) {
    console.error("Google auth callback error:", error);
    return c.redirect(`/auth?error=auth_error&message=${encodeURIComponent(error.message || "Authentication failed")}`);
  }
});

export { router as authRoutes };
