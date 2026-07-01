/// <reference types="@cloudflare/workers-types" />

export interface Env {
  // Workers Static Assets binding
  ASSETS: Fetcher;

  // Neon PostgreSQL connection string
  DATABASE_URL?: string;

  // JWT signing secret
  JWT_SECRET?: string;

  // Google OAuth
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CALLBACK_URL?: string;

  // Medium
  MEDIUM_USERNAME?: string;
}

export interface JwtUserPayload {
  id: number;
  username: string;
  email: string;
  isSubscribed: boolean;
}
