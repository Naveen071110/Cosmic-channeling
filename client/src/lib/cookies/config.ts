import { CookieKey, CookieDefinition, CookieCategory, ConsentPreferences } from './types';

export const CURRENT_CONSENT_VERSION = '2026.1';

export const DEFAULT_CONSENT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: new Date().toISOString(),
  version: CURRENT_CONSENT_VERSION,
};

export const COOKIE_REGISTRY: Record<CookieKey, CookieDefinition> = {
  // Strictly Necessary
  app_session_token: {
    name: 'app_session_token',
    category: 'necessary',
    description: 'Cryptographically signed JWT session token for authenticated cosmic traveler accounts.',
    defaultLifetimeDays: 14,
    secure: true,
    sameSite: 'Lax',
    httpOnly: true,
    sensitive: true,
  },
  csrf_token: {
    name: 'csrf_token',
    category: 'necessary',
    description: 'Cross-Site Request Forgery mitigation token safeguarding state-modifying requests.',
    defaultLifetimeDays: 1,
    secure: true,
    sameSite: 'Strict',
    httpOnly: false,
    sensitive: true,
  },
  guest_session_id: {
    name: 'guest_session_id',
    category: 'necessary',
    description: 'Ephemeral anonymous identifier preserving guest meditation state and quiz progress before signup.',
    defaultLifetimeDays: 2,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    sensitive: false,
  },

  // Functional & Preferences
  app_theme: {
    name: 'app_theme',
    category: 'functional',
    description: 'Stores UI theme preferences (deep space dark, starry contrast, or system default).',
    defaultLifetimeDays: 365,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    sensitive: false,
  },
  app_workspace_prefs: {
    name: 'app_workspace_prefs',
    category: 'functional',
    description: 'Persists synthesizer audio volume, breathing intervals, and celestial atlas filter settings.',
    defaultLifetimeDays: 90,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    sensitive: false,
  },
  app_consent_preferences: {
    name: 'app_consent_preferences',
    category: 'necessary', // Essential to record legal consent state under GDPR
    description: 'Records your explicit GDPR/ePrivacy cookie preferences and timestamp.',
    defaultLifetimeDays: 365,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    sensitive: false,
  },

  // Performance & Analytics
  analytics_session_id: {
    name: 'analytics_session_id',
    category: 'analytics',
    description: 'First-party anonymized telemetry tracking page performance and API latency.',
    defaultLifetimeDays: 30,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    sensitive: false,
  },

  // Marketing & Referrals
  ref_source: {
    name: 'ref_source',
    category: 'marketing',
    description: 'Records campaign or referral source (e.g. utm_source) to attribute cosmic sanctuary discoveries.',
    defaultLifetimeDays: 30,
    secure: true,
    sameSite: 'Lax',
    httpOnly: false,
    sensitive: false,
  },
};

export const CATEGORY_INFO: Record<
  CookieCategory,
  {
    title: string;
    description: string;
    badge: string;
    required: boolean;
    cookies: CookieKey[];
  }
> = {
  necessary: {
    title: 'Strictly Necessary',
    description: 'Essential for core security, session authentication, and CSRF protection. Cannot be disabled.',
    badge: 'Always Active',
    required: true,
    cookies: ['app_session_token', 'csrf_token', 'guest_session_id', 'app_consent_preferences'],
  },
  functional: {
    title: 'Functional & Preferences',
    description: 'Remembers your audio synthesizer volume, box breathing pace, and workspace layout preferences.',
    badge: 'Customizable',
    required: false,
    cookies: ['app_theme', 'app_workspace_prefs'],
  },
  analytics: {
    title: 'Performance & Telemetry',
    description: 'Anonymously measures sanctuary performance, NASA feed load times, and error rates to improve stability.',
    badge: 'Opt-in',
    required: false,
    cookies: ['analytics_session_id'],
  },
  marketing: {
    title: 'Marketing & Referrals',
    description: 'Captures referral channels to understand how cosmic travelers discover our portal.',
    badge: 'Opt-in',
    required: false,
    cookies: ['ref_source'],
  },
};
