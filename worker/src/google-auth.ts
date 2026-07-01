/**
 * Google OAuth for Cloudflare Workers using raw fetch().
 * No heavy Node.js libraries needed — just direct REST API calls.
 */

import type { Env } from "./env";
import { signToken, buildCookieHeader } from "./jwt";
import type { IStorage } from "./storage";

const STATE_COOKIE = "google_oauth_state";

/**
 * Generate the Google OAuth URL and state cookie for CSRF protection.
 */
export async function getGoogleAuthUrl(env: Env): Promise<{
  url: string;
  stateCookie: string;
}> {
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID not configured");
  }

  const redirectUri = env.GOOGLE_CALLBACK_URL || "http://localhost:8787/api/auth/google/callback";

  // Generate a random state for CSRF protection
  const stateBytes = crypto.getRandomValues(new Uint8Array(32));
  const state = Array.from(stateBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    state,
    include_granted_scopes: "true",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const isProduction = !!env.JWT_SECRET;
  const stateCookieParts = [
    `${STATE_COOKIE}=${state}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=300", // 5 minutes
  ];
  if (isProduction) stateCookieParts.push("Secure");

  return { url, stateCookie: stateCookieParts.join("; ") };
}

interface GoogleUserResult {
  id: string;
  email: string;
  displayName: string;
}

/**
 * Exchange authorization code for tokens and verify ID token using Google's REST API.
 */
export async function handleGoogleCallback(
  env: Env,
  code: string,
): Promise<GoogleUserResult> {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const redirectUri = env.GOOGLE_CALLBACK_URL || "http://localhost:8787/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth not configured");
  }

  // Exchange authorization code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Token exchange failed: ${tokenRes.status} ${text}`);
  }

  const tokens: any = await tokenRes.json();

  if (!tokens.id_token) {
    throw new Error("No ID token returned from Google");
  }

  // Decode the ID token (JWT) to get user info
  // The ID token is a JWT with payload in the second segment
  const parts = tokens.id_token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid ID token format");
  }

  // Decode base64url payload
  const payload = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0),
      ),
    ),
  );

  if (!payload || !payload.email) {
    throw new Error("Invalid Google token payload");
  }

  return {
    id: payload.sub,
    email: payload.email,
    displayName: payload.name || payload.email.split("@")[0],
  };
}

/**
 * After successful Google auth, find or create the user and return a JWT cookie.
 */
export async function authenticateWithGoogle(
  googleUser: GoogleUserResult,
  storage: IStorage,
  jwtSecret: string,
): Promise<{ userJson: any; setCookie: string }> {
  // Look up existing user by email
  let user = await storage.getUserByEmail(googleUser.email);

  if (!user) {
    // Create a new user with Google data
    const username = googleUser.displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .substring(0, 20);

    // Ensure unique username
    let finalUsername = username;
    let existing = await storage.getUserByUsername(finalUsername);
    let suffix = 1;
    while (existing) {
      finalUsername = `${username}_${suffix}`;
      existing = await storage.getUserByUsername(finalUsername);
      suffix++;
    }

    user = await storage.createUser({
      username: finalUsername,
      email: googleUser.email,
      password: "",
      isSubscribed: false,
    });
  }

  // Sign JWT
  const token = await signToken(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      isSubscribed: user.isSubscribed,
    },
    jwtSecret,
  );

  const userJson = {
    id: user.id,
    username: user.username,
    email: user.email,
    isSubscribed: user.isSubscribed,
    createdAt: user.createdAt,
  };

  const setCookie = buildCookieHeader(token, true);

  return { userJson, setCookie };
}
