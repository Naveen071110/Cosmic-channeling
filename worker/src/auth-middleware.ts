import type { Context, Next } from "hono";
import type { Env, JwtUserPayload } from "./env";
import { extractTokenFromCookie, verifyToken } from "./jwt";
import type { IStorage } from "./storage";
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
  projectId = "cosmic-channeling",
  storage?: IStorage
): Promise<JwtUserPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });

    const uid = (payload.sub as string) || "";
    const email = (payload.email as string) || null;
    const name = (payload.name as string) || (email ? email.split("@")[0] : `user_${uid.substring(0, 6)}`);

    let userId: number;
    let finalUsername = name;
    let isSubscribed = false;

    // If storage is available and user has an email, ensure a user row exists in DB
    // to preserve foreign-key integrity in relational storage and prevent IDOR collisions
    if (storage && email) {
      let user = await storage.getUserByEmail(email);
      if (!user) {
        const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 20) || "seeker";
        let uniqueUsername = baseUsername;
        let existingUser = await storage.getUserByUsername(uniqueUsername);
        let suffix = 1;
        while (existingUser) {
          uniqueUsername = `${baseUsername.substring(0, 16)}_${suffix}`;
          existingUser = await storage.getUserByUsername(uniqueUsername);
          suffix++;
        }
        try {
          user = await storage.createUser({
            username: uniqueUsername,
            email,
            password: `!firebase-oauth-${crypto.randomUUID()}`,
            isSubscribed: false,
          });
        } catch {
          user = await storage.getUserByEmail(email);
        }
      }

      if (user) {
        userId = user.id;
        finalUsername = user.username;
        isSubscribed = user.isSubscribed;
      } else {
        // High-offset fallback avoiding small serial sequence collisions
        let hash = 5381;
        for (let i = 0; i < uid.length; i++) {
          hash = ((hash << 5) + hash) + uid.charCodeAt(i);
          hash |= 0;
        }
        userId = 10_000_000 + Math.abs(hash % 90_000_000);
      }
    } else {
      // High-offset fallback avoiding small serial sequence collisions
      let hash = 5381;
      for (let i = 0; i < uid.length; i++) {
        hash = ((hash << 5) + hash) + uid.charCodeAt(i);
        hash |= 0;
      }
      userId = 10_000_000 + Math.abs(hash % 90_000_000);
    }

    return {
      id: userId,
      username: finalUsername,
      email,
      isSubscribed,
    };
  } catch (err) {
    // Cryptographic signature or claim validation failed — reject token
    console.warn("[Auth] Firebase ID token cryptographic verification failed:", err);
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
      const storage: IStorage | undefined = c.get("storage");
      const user = await verifyFirebaseIdToken(token, projectId, storage);
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
