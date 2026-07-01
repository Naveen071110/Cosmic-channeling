import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { JwtUserPayload } from "./env";

const COOKIE_NAME = "cosmic_token";
const JWT_ALGORITHM = "HS256";
const JWT_EXPIRATION = "7d"; // 7 days

/**
 * Create a JWT token and return it as a string.
 * The secret is a string from env — we convert it to a Uint8Array key.
 */
export async function signToken(
  payload: JwtUserPayload,
  secret: string,
): Promise<string> {
  const key = new TextEncoder().encode(secret);

  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(key);
}

/**
 * Verify a JWT token and return the decoded payload.
 * Returns null if the token is invalid or expired.
 */
export async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtUserPayload | null> {
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key, {
      algorithms: [JWT_ALGORITHM],
    });

    // Validate the payload shape
    if (
      typeof payload.id !== "number" ||
      typeof payload.username !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      isSubscribed: payload.isSubscribed === true,
    };
  } catch {
    return null;
  }
}

/**
 * Extract JWT from the Cookie header.
 */
export function extractTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  // Parse cookies — handle the `name=value` pairs
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === COOKIE_NAME) {
      return rest.join("="); // value may contain '=' if base64-encoded
    }
  }
  return null;
}

/**
 * Build the Set-Cookie header value for the JWT cookie.
 */
export function buildCookieHeader(
  token: string,
  isProduction: boolean,
): string {
  const base = `${COOKIE_NAME}=${token}`;
  const parts = [
    base,
    "HttpOnly",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
  ];

  if (isProduction) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

/**
 * Build the Set-Cookie header to clear the JWT cookie (logout).
 */
export function buildClearCookieHeader(isProduction: boolean): string {
  const parts = [
    `${COOKIE_NAME}=`,
    "HttpOnly",
    "SameSite=Strict",
    "Path=/",
    "Max-Age=0",
  ];

  if (isProduction) {
    parts.push("Secure");
  }

  return parts.join("; ");
}
