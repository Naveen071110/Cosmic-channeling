import { useState, useEffect } from 'react';
import { CosmicPersona } from './types';
import { COSMIC_ARCHETYPES } from './archetypes';
import { apiRequest } from '@/lib/queryClient';

const STORAGE_KEY = 'cosmic_channeling_user_persona';

export function getStoredPersona(userId?: string | number | null): CosmicPersona | null {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CosmicPersona;
    // Re-attach archetype definition if needed for full hydration
    if (parsed && parsed.archetypeId && COSMIC_ARCHETYPES[parsed.archetypeId]) {
      parsed.archetype = COSMIC_ARCHETYPES[parsed.archetypeId];
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredPersona(persona: CosmicPersona, userId?: string | number | null): void {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(persona));
    // Also save to generic key for quick guest preview fallback
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persona));
    // Dispatch custom event for cross-component reactivity
    window.dispatchEvent(new CustomEvent('cosmic-persona-updated', { detail: persona }));

    // Asynchronously synchronize to Cloudflare KV / Cloud Backend if user is logged in
    if (userId) {
      apiRequest('POST', '/api/persona', { persona }).catch((err) => {
        console.warn('[Persona] Cloud sync background warning:', err);
      });
    }
  } catch (e) {
    console.error('Failed to save persona to storage:', e);
  }
}

export function clearStoredPersona(userId?: string | number | null): void {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    localStorage.removeItem(key);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cosmic-persona-updated', { detail: null }));

    if (userId) {
      apiRequest('POST', '/api/persona', { persona: null }).catch((err) => {
        console.warn('[Persona] Cloud clear background warning:', err);
      });
    }
  } catch (e) {
    console.error('Failed to clear persona:', e);
  }
}

export function useCosmicPersona(userId?: string | number | null) {
  const [persona, setPersona] = useState<CosmicPersona | null>(() => getStoredPersona(userId));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // 1. Instant local cache hydration
    const local = getStoredPersona(userId);
    setPersona(local);
    setIsLoaded(true);

    // 2. Cloud Synchronization for cross-device persistence (Desktop <-> Mobile)
    if (userId) {
      apiRequest('GET', '/api/persona')
        .then(async (res) => {
          if (res.ok) {
            const data: any = await res.json();
            if (data?.persona) {
              const serverPersona = data.persona as CosmicPersona;
              if (serverPersona.archetypeId && COSMIC_ARCHETYPES[serverPersona.archetypeId]) {
                serverPersona.archetype = COSMIC_ARCHETYPES[serverPersona.archetypeId];
              }
              const key = `${STORAGE_KEY}_${userId}`;
              localStorage.setItem(key, JSON.stringify(serverPersona));
              setPersona(serverPersona);
            } else if (local) {
              // Server has no persona yet, but local does (e.g. taken offline or before sign-in)
              apiRequest('POST', '/api/persona', { persona: local }).catch(() => {});
            }
          }
        })
        .catch((err) => {
          console.warn('[Persona] Cloud fetch offline/fallback:', err);
        });
    }

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CosmicPersona | null>;
      setPersona(customEvent.detail || getStoredPersona(userId));
    };

    window.addEventListener('cosmic-persona-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('cosmic-persona-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [userId]);

  const updatePersona = (newPersona: CosmicPersona) => {
    saveStoredPersona(newPersona, userId);
    setPersona(newPersona);
  };

  const removePersona = () => {
    clearStoredPersona(userId);
    setPersona(null);
  };

  return {
    persona,
    isLoaded,
    hasPersona: !!persona,
    updatePersona,
    removePersona,
  };
}
