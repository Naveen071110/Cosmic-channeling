/**
 * Enterprise Cookie Architecture — TypeScript Taxonomy & Types
 * Compliant with OWASP Top 10, GDPR, ePrivacy Directive, and CCPA
 */

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export type CookieKey =
  // Strictly Necessary
  | 'app_session_token'
  | 'csrf_token'
  | 'guest_session_id'
  // Functional & Preferences
  | 'app_theme'
  | 'app_workspace_prefs'
  | 'app_consent_preferences'
  // Performance & Analytics
  | 'analytics_session_id'
  // Marketing & Referrals
  | 'ref_source';

export interface CookieOptions {
  /** Lifetime in days */
  days?: number;
  /** Lifetime in seconds (overrides days if provided) */
  maxAge?: number;
  /** Expiration Date */
  expires?: Date;
  /** Path scope (defaults to '/') */
  path?: string;
  /** Domain scope */
  domain?: string;
  /** HTTPS only transmission */
  secure?: boolean;
  /** CSRF SameSite policy */
  sameSite?: 'Lax' | 'Strict' | 'None';
  /** JavaScript access prevention (Server-only flag) */
  httpOnly?: boolean;
}

export interface ConsentPreferences {
  necessary: true; // Always active
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export interface CookieDefinition {
  name: CookieKey;
  category: CookieCategory;
  description: string;
  defaultLifetimeDays: number;
  secure: boolean;
  sameSite: 'Lax' | 'Strict' | 'None';
  httpOnly: boolean;
  sensitive: boolean;
}
