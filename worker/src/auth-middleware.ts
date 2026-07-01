import type { Context, Next } from "hono";
import type { Env, JwtUserPayload } from "./env";
import { extractTokenFromCookie, verifyToken } from "./jwt";

// Extend Hono's ContextVariableMap so c.get("user") has the right type
declare module "hono" {
  interface ContextVariableMap {
    user: JwtUserPayload | null;
  }
}

/**
 * Auth middleware — reads JWT from cookie, verifies it, and sets c.var.user.
 * Does NOT block unauthenticated requests (public endpoints work without auth).
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const secret = c.env.JWT_SECRET;

  if (secret) {
    const cookieHeader = c.req.header("Cookie");
    const token = extractTokenFromCookie(cookieHeader);

    if (token) {
      const payload = await verifyToken(token, secret);
      if (payload) {
        c.set("user", payload);
      } else {
        c.set("user", null);
      }
    } else {
      c.set("user", null);
    }
  } else {
    c.set("user", null);
  }

  await next();
}

/**
 * Require auth middleware — returns 401 if no valid user is set.
 * Use this after authMiddleware on routes that need authentication.
 */
export async function requireAuth(c: Context<{ Bindings: Env }>, next: Next) {
  const user = c.get("user");
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  await next();
}

/**
 * Helper to get the authenticated user from context.
 */
export function getUser(c: Context<{ Bindings: Env }>): JwtUserPayload | null {
  return c.get("user") ?? null;
}
