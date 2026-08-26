import { describe, it, expect } from 'vitest';
import { COOKIE_REGISTRY, CATEGORY_INFO, DEFAULT_CONSENT_PREFERENCES, CURRENT_CONSENT_VERSION } from '../config';
import { CookieKey } from '../types';

describe('Enterprise Cookie Architecture', () => {
  it('registers all 8 required enterprise cookies', () => {
    const requiredKeys: CookieKey[] = [
      'app_session_token',
      'csrf_token',
      'guest_session_id',
      'app_theme',
      'app_workspace_prefs',
      'app_consent_preferences',
      'analytics_session_id',
      'ref_source',
    ];

    requiredKeys.forEach((key) => {
      expect(COOKIE_REGISTRY[key]).toBeDefined();
      expect(COOKIE_REGISTRY[key].name).toBe(key);
    });
  });

  it('enforces HttpOnly on sensitive session authentication cookies', () => {
    expect(COOKIE_REGISTRY.app_session_token.httpOnly).toBe(true);
    expect(COOKIE_REGISTRY.app_session_token.secure).toBe(true);
    expect(COOKIE_REGISTRY.app_session_token.category).toBe('necessary');
  });

  it('configures strictly necessary category as permanently required', () => {
    expect(CATEGORY_INFO.necessary.required).toBe(true);
    expect(CATEGORY_INFO.functional.required).toBe(false);
    expect(CATEGORY_INFO.analytics.required).toBe(false);
    expect(CATEGORY_INFO.marketing.required).toBe(false);
  });

  it('provides standard default consent preferences', () => {
    expect(DEFAULT_CONSENT_PREFERENCES.necessary).toBe(true);
    expect(DEFAULT_CONSENT_PREFERENCES.functional).toBe(false);
    expect(DEFAULT_CONSENT_PREFERENCES.analytics).toBe(false);
    expect(DEFAULT_CONSENT_PREFERENCES.marketing).toBe(false);
    expect(DEFAULT_CONSENT_PREFERENCES.version).toBe(CURRENT_CONSENT_VERSION);
  });
});
