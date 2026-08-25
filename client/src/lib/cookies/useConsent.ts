import { useState, useEffect, useCallback } from 'react';
import { ConsentPreferences, CookieCategory } from './types';
import { getConsentPreferences, saveConsentPreferences, hasConsentFor } from './client';
import { CURRENT_CONSENT_VERSION } from './config';

export function useConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(() => getConsentPreferences());
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setConsent(getConsentPreferences());
    setIsReady(true);

    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentPreferences>;
      setConsent(customEvent.detail || getConsentPreferences());
    };

    window.addEventListener('cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  const acceptAll = useCallback(() => {
    const fullConsent: ConsentPreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: CURRENT_CONSENT_VERSION,
    };
    saveConsentPreferences(fullConsent);
    setConsent(fullConsent);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const minimalConsent: ConsentPreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: CURRENT_CONSENT_VERSION,
    };
    saveConsentPreferences(minimalConsent);
    setConsent(minimalConsent);
  }, []);

  const updatePreferences = useCallback((custom: Partial<ConsentPreferences>) => {
    const updated: ConsentPreferences = {
      necessary: true,
      functional: Boolean(custom.functional),
      analytics: Boolean(custom.analytics),
      marketing: Boolean(custom.marketing),
      timestamp: new Date().toISOString(),
      version: CURRENT_CONSENT_VERSION,
    };
    saveConsentPreferences(updated);
    setConsent(updated);
  }, []);

  const isCategoryAllowed = useCallback((category: CookieCategory): boolean => {
    return hasConsentFor(category);
  }, []);

  return {
    consent,
    isReady,
    hasResponded: Boolean(consent && consent.version === CURRENT_CONSENT_VERSION),
    isCategoryAllowed,
    acceptAll,
    rejectNonEssential,
    updatePreferences,
  };
}
