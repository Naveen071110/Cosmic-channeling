/**
 * Type-Safe Client Cookie & Consent Manager
 * Strictly enforces GDPR/ePrivacy category opt-ins and OWASP 4KB payload security guards.
 */

import { CookieKey, CookieOptions, ConsentPreferences, CookieCategory } from './types';
import { COOKIE_REGISTRY, CURRENT_CONSENT_VERSION } from './config';

const MAX_COOKIE_BYTE_SIZE = 4096; // 4KB limit to prevent HTTP 431 Request Header Too Large

/**
 * Read raw cookie string from document.cookie
 */
export function getCookie(name: CookieKey): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  const prefix = `${encodeURIComponent(name)}=`;

  for (const c of cookies) {
    if (c.indexOf(prefix) === 0) {
      try {
        return decodeURIComponent(c.substring(prefix.length));
      } catch {
        return c.substring(prefix.length);
      }
    }
  }

  return null;
}

/**
 * Retrieve user's stored consent preferences
 */
export function getConsentPreferences(): ConsentPreferences | null {
  const raw = getCookie('app_consent_preferences');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ConsentPreferences;
    if (parsed && parsed.version === CURRENT_CONSENT_VERSION && parsed.necessary === true) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a specific category is allowed under current user consent
 */
export function hasConsentFor(category: CookieCategory): boolean {
  if (category === 'necessary') return true;

  const consent = getConsentPreferences();
  if (!consent) return false;

  return Boolean(consent[category]);
}

/**
 * Set a cookie with category consent enforcement and OWASP security attributes
 */
export function setCookie(
  name: CookieKey,
  value: string,
  customOptions?: Partial<CookieOptions>
): boolean {
  if (typeof document === 'undefined') return false;

  const def = COOKIE_REGISTRY[name];
  if (!def) {
    console.warn(`[CookieManager] Attempted to set unregistered cookie: "${name}"`);
    return false;
  }

  // 1. Enforce GDPR Category Consent
  if (def.category !== 'necessary' && !hasConsentFor(def.category)) {
    console.debug(`[CookieManager] Blocked cookie "${name}" — User has not consented to "${def.category}".`);
    return false;
  }

  // 2. Build Cookie String
  const options: CookieOptions = {
    days: def.defaultLifetimeDays,
    path: '/',
    secure: def.secure && (typeof window !== 'undefined' && window.location.protocol === 'https:'),
    sameSite: def.sameSite,
    ...customOptions,
  };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.maxAge !== undefined) {
    cookieString += `; Max-Age=${options.maxAge}`;
  } else if (options.days) {
    const d = new Date();
    d.setTime(d.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookieString += `; Expires=${d.toUTCString()}`;
  } else if (options.expires) {
    cookieString += `; Expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    cookieString += `; Path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; Domain=${options.domain}`;
  }

  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }

  if (options.secure) {
    cookieString += `; Secure`;
  }

  // 3. Enforce 4KB Payload Limit
  if (new Blob([cookieString]).size > MAX_COOKIE_BYTE_SIZE) {
    console.error(`[CookieManager] Payload size for "${name}" exceeds 4096 bytes. Write aborted.`);
    return false;
  }

  document.cookie = cookieString;

  // 4. Dispatch custom event for reactive listeners
  window.dispatchEvent(
    new CustomEvent('cookie-changed', {
      detail: { name, value, category: def.category },
    })
  );

  return true;
}

/**
 * Remove a cookie by expiring it in the past
 */
export function removeCookie(name: CookieKey, options?: Partial<CookieOptions>): void {
  if (typeof document === 'undefined') return;

  const path = options?.path || '/';
  const domain = options?.domain ? `; Domain=${options.domain}` : '';
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `${encodeURIComponent(name)}=; Max-Age=-1; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}${domain}${secure}; SameSite=Lax`;

  window.dispatchEvent(
    new CustomEvent('cookie-changed', {
      detail: { name, value: null },
    })
  );
}

/**
 * Save user consent choices and purge unconsented cookies immediately
 */
export function saveConsentPreferences(preferences: ConsentPreferences): void {
  if (typeof document === 'undefined') return;

  // Set the consent preferences cookie (Strictly Necessary category)
  const consentString = JSON.stringify(preferences);
  const d = new Date();
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secureFlag = isHttps ? '; Secure' : '';

  document.cookie = `app_consent_preferences=${encodeURIComponent(consentString)}; Expires=${d.toUTCString()}; Path=/; SameSite=Lax${secureFlag}`;

  // Purge any cookies whose category has been revoked
  (Object.keys(COOKIE_REGISTRY) as CookieKey[]).forEach((key) => {
    const def = COOKIE_REGISTRY[key];
    if (def.category !== 'necessary' && !preferences[def.category]) {
      removeCookie(key);
    }
  });

  // Dispatch global consent event
  window.dispatchEvent(
    new CustomEvent('cookie-consent-changed', {
      detail: preferences,
    })
  );
}
