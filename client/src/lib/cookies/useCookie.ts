import { useState, useEffect, useCallback } from 'react';
import { CookieKey, CookieOptions } from './types';
import { getCookie, setCookie, removeCookie } from './client';

/**
 * Reactive React hook for reading, writing, and synchronizing cookies.
 */
export function useCookie<T = string>(
  key: CookieKey,
  defaultValue?: T
): [T | null, (value: T, options?: Partial<CookieOptions>) => boolean, () => void] {
  const [cookieValue, setCookieValue] = useState<T | null>(() => {
    const raw = getCookie(key);
    if (raw === null) return defaultValue ?? null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return (raw as unknown) as T;
    }
  });

  useEffect(() => {
    const handleCookieChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; value: string | null }>;
      if (customEvent.detail.name === key) {
        if (customEvent.detail.value === null) {
          setCookieValue(defaultValue ?? null);
        } else {
          try {
            setCookieValue(JSON.parse(customEvent.detail.value) as T);
          } catch {
            setCookieValue((customEvent.detail.value as unknown) as T);
          }
        }
      }
    };

    window.addEventListener('cookie-changed', handleCookieChange);
    return () => {
      window.removeEventListener('cookie-changed', handleCookieChange);
    };
  }, [key, defaultValue]);

  const update = useCallback(
    (newValue: T, options?: Partial<CookieOptions>): boolean => {
      const serialized = typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
      const success = setCookie(key, serialized, options);
      if (success) {
        setCookieValue(newValue);
      }
      return success;
    },
    [key]
  );

  const remove = useCallback(() => {
    removeCookie(key);
    setCookieValue(defaultValue ?? null);
  }, [key, defaultValue]);

  return [cookieValue, update, remove];
}
