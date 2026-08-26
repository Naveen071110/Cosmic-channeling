import { describe, it, expect } from 'vitest';
import { calculatePersona, calculateDailyAlignment, calculateStardate } from '../engine';
import { COSMIC_ARCHETYPES } from '../archetypes';
import { QuestionnaireAnswers } from '../types';

describe('Cosmic Persona Engine', () => {
  it('calculates a valid Stardate format', () => {
    const stardate = calculateStardate();
    expect(stardate).toMatch(/^SD \d{4}\.\d+$/);
  });

  it('determines the Stellar Seeker archetype for curious/space choices', () => {
    const answers: QuestionnaireAnswers = {
      horizon: 1, // Curiosity
      sound: 1,   // Radio sonifications
      hour: 1,    // Astronomical twilight
      reflection: 1, // Space reflections
      element: 'Air',
    };

    const persona = calculatePersona(answers);
    expect(persona.archetypeId).toBe('stellar-seeker');
    expect(persona.archetype.title).toBe('Stellar Seeker');
    expect(persona.rulingFrequency).toBe(741);
    expect(persona.element).toBe('Air');
    expect(persona.dimensions.curiosity).toBeGreaterThanOrEqual(50);
  });

  it('determines the Nebula Mystic archetype for intuitive/water choices', () => {
    const answers: QuestionnaireAnswers = {
      horizon: 0, // Restful stillness
      sound: 0,   // 432 Hz
      hour: 3,    // 3 AM Lucid
      reflection: 0, // Vivid dreams
      element: 'Water',
    };

    const persona = calculatePersona(answers);
    expect(persona.archetypeId).toBe('nebula-mystic');
    expect(persona.archetype.title).toBe('Nebula Mystic');
    expect(persona.rulingFrequency).toBe(432);
    expect(persona.element).toBe('Water');
    expect(persona.dimensions.intuition).toBeGreaterThanOrEqual(50);
  });

  it('determines the Solar Alchemist archetype for fire/vitality choices', () => {
    const answers: QuestionnaireAnswers = {
      horizon: 2, // Creative fire
      sound: 2,   // 528 Hz
      hour: 0,    // Dawn light
      reflection: 2, // Goals & gratitude
      element: 'Fire',
    };

    const persona = calculatePersona(answers);
    expect(persona.archetypeId).toBe('solar-alchemist');
    expect(persona.archetype.title).toBe('Solar Alchemist');
    expect(persona.rulingFrequency).toBe(528);
    expect(persona.element).toBe('Fire');
    expect(persona.dimensions.vitality).toBeGreaterThanOrEqual(50);
  });

  it('generates a valid daily alignment insight within 80-100% resonance range', () => {
    const answers: QuestionnaireAnswers = {
      horizon: 0,
      sound: 0,
      hour: 0,
      reflection: 0,
      element: 'Air',
    };

    const persona = calculatePersona(answers);
    const alignment = calculateDailyAlignment(persona);

    expect(alignment.alignmentScore).toBeGreaterThanOrEqual(80);
    expect(alignment.alignmentScore).toBeLessThanOrEqual(100);
    expect(alignment.directive).toBeTruthy();
    expect(alignment.affirmation).toBeTruthy();
    expect(alignment.journalPrompt).toBeTruthy();
    expect(alignment.recommendedFrequency).toBe(persona.rulingFrequency);
  });
});
