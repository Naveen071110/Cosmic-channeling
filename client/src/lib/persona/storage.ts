import { useState, useEffect } from 'react';
import { CosmicPersona } from './types';
import { COSMIC_ARCHETYPES } from './archetypes';

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
  } catch (e) {
    console.error('Failed to clear persona:', e);
  }
}

export function useCosmicPersona(userId?: string | number | null) {
  const [persona, setPersona] = useState<CosmicPersona | null>(() => getStoredPersona(userId));
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setPersona(getStoredPersona(userId));
    setIsLoaded(true);

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
