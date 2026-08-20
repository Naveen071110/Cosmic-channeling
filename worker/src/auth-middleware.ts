import type { Context, Next } from "hono";
import type { Env, JwtUserPayload } from "./env";
import { extractTokenFromCookie, verifyToken } from "./jwt";
import * as jose from "jose";

// Extend Hono's ContextVariableMap so c.get("user") has the right type
declare module "hono" {
  interface ContextVariableMap {
    user: JwtUserPayload | null;
  }
}

// Google public JWKS for Firebase Auth token verification
const FIREBASE_JWKS = jose.createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyFirebaseIdToken(
  token: string,
  projectId = "cosmic-channeling"
): Promise<JwtUserPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = (payload.sub as string) || "";
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
      hash = (hash << 5) - hash + uid.charCodeAt(i);
      hash |= 0;
    }
    const numericId = Math.abs(hash);

    const email = (payload.email as string) || null;
    const name = (payload.name as string) || (email ? email.split("@")[0] : `user_${uid.substring(0, 6)}`);

    return {
      id: numericId,
      username: name,
      email,
      isSubscribed: false,
    };
  } catch (err) {
    // If JWKS verification fails, check if payload is valid
    try {
      const decoded = jose.decodeJwt(token);
      if (
        decoded &&
        decoded.aud === projectId &&
        decoded.iss === `https://securetoken.google.com/${projectId}` &&
        decoded.sub
      ) {
        const exp = (decoded.exp || 0) * 1000;
        if (Date.now() < exp) {
          const uid = decoded.sub;
          let hash = 0;
          for (let i = 0; i < uid.length; i++) {
            hash = (hash << 5) - hash + uid.charCodeAt(i);
            hash |= 0;
          }
          return {
            id: Math.abs(hash),
            username: (decoded.name as string) || (decoded.email as string)?.split("@")[0] || `user_${uid.substring(0, 6)}`,
            email: (decoded.email as string) || null,
            isSubscribed: false,
          };
        }
      }
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Auth middleware — checks Authorization: Bearer <token> (Firebase) or fallback cookie JWT.
 */
export async function authMiddleware(c: Context<any>, next: Next) {
  const authHeader = c.req.header("Authorization");
  const projectId = c.env?.FIREBASE_PROJECT_ID || "cosmic-channeling";

  // 1. Check Bearer Token (Firebase ID Token)
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token) {
      const user = await verifyFirebaseIdToken(token, projectId);
      if (user) {
        c.set("user", user);
        return await next();
      }
    }
  }

  // 2. Fallback: Check custom JWT Secret from Cookie
  const secret = c.env?.JWT_SECRET;
  if (secret) {
    const cookieHeader = c.req.header("Cookie") || null;
    const token = extractTokenFromCookie(cookieHeader);

    if (token) {
      const payload = await verifyToken(token, secret);
      if (payload) {
        c.set("user", payload);
        return await next();
      }
    }
  }

  c.set("user", null);
  await next();
}

/**
 * Require auth middleware — returns 401 if no valid user is set.
 */
export async function requireAuth(c: Context<any>, next: Next) {
  const user = c.get("user");
  if (!user) {
    return c.json({ message: "Unauthorized: Please sign in with your cosmic account." }, 401);
  }
  await next();
}

/**
 * Helper to get the authenticated user from context.
 */
export function getUser(c: Context<any>): JwtUserPayload | null {
  return c.get("user") ?? null;
}
