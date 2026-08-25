/**
 * Enterprise Server Cookie Utility for Cloudflare Workers / Hono
 * Declares strict OWASP attributes: Secure, SameSite, HttpOnly, and __Host- prefix compatibility.
 */

import type { Context } from 'hono';
import { setCookie as honoSetCookie, getCookie as honoGetCookie, deleteCookie as honoDeleteCookie } from 'hono/cookie';

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export type CookieKey =
  | 'app_session_token'
  | 'csrf_token'
  | 'guest_session_id'
  | 'app_theme'
  | 'app_workspace_prefs'
  | 'app_consent_preferences'
  | 'analytics_session_id'
  | 'ref_source';

export interface CookieOptions {
  days?: number;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  httpOnly?: boolean;
}

const DEFAULT_SERVER_OPTIONS: Record<CookieKey, Partial<CookieOptions>> = {
  app_session_token: {
    days: 14,
    secure: true,
    sameSite: 'Lax',
    httpOnly: true,
    path: '/',
  },
  csrf_token: {
    days: 1,
    secure: true,
    sameSite: 'Strict',
    httpOnly: false,
    path: '/',
  },
  guest_session_id: {
    days: 2,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    path: '/',
  },
  app_theme: {
    days: 365,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    path: '/',
  },
  app_workspace_prefs: {
    days: 90,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    path: '/',
  },
  app_consent_preferences: {
    days: 365,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    path: '/',
  },
  analytics_session_id: {
    days: 30,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    path: '/',
  },
  ref_source: {
    days: 30,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    path: '/',
  },
};

/**
 * Set a strongly-typed cookie in Hono response
 */
export function setServerCookie(
  c: Context,
  key: CookieKey,
  value: string,
  options?: Partial<CookieOptions>
): void {
  const merged: Partial<CookieOptions> = {
    ...DEFAULT_SERVER_OPTIONS[key],
    ...options,
  };

  const maxAge = merged.maxAge ?? (merged.days ? merged.days * 24 * 60 * 60 : undefined);

  honoSetCookie(c, key, value, {
    path: merged.path || '/',
    secure: merged.secure ?? true,
    sameSite: merged.sameSite || 'Lax',
    httpOnly: merged.httpOnly ?? false,
    maxAge,
    domain: merged.domain,
  });
}

/**
 * Retrieve a cookie from request
 */
export function getServerCookie(c: Context, key: CookieKey): string | null {
  return honoGetCookie(c, key) || null;
}

/**
 * Delete a cookie by expiring it
 */
export function deleteServerCookie(c: Context, key: CookieKey, options?: Partial<CookieOptions>): void {
  const merged = {
    ...DEFAULT_SERVER_OPTIONS[key],
    ...options,
  };

  honoDeleteCookie(c, key, {
    path: merged.path || '/',
    secure: merged.secure ?? true,
    domain: merged.domain,
  });
}

/**
 * Create a secure HTTP-Only authentication cookie
 */
export function createSecureAuthCookie(c: Context, token: string, durationDays = 14): void {
  setServerCookie(c, 'app_session_token', token, {
    days: durationDays,
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
  });
}
