import { CosmicElement } from './types';

export interface QuestionChoice {
  id: number;
  label: string;
  sublabel: string;
  archetypeAffinity: string; // archetype ID it points towards
  dimensionWeights: {
    intuition: number;
    curiosity: number;
    vitality: number;
    harmony: number;
    transcendence: number;
  };
}

export interface Question {
  id: string;
  step: number;
  category: string;
  question: string;
  context: string;
  choices: QuestionChoice[];
}

export const COSMIC_QUESTIONNAIRE: Question[] = [
  {
    id: 'horizon',
    step: 1,
    category: 'Cosmic Orientation',
    question: 'When you gaze into the boundless night sky, what is your first visceral sensation?',
    context: 'Your initial reaction reveals the primary lens through which your consciousness interfaces with the infinite.',
    choices: [
      {
        id: 0,
        label: 'A deep, restful stillness',
        sublabel: 'Feeling held by the quiet void and releasing daily mental noise.',
        archetypeAffinity: 'nebula-mystic',
        dimensionWeights: { intuition: 25, curiosity: 5, vitality: 5, harmony: 25, transcendence: 20 },
      },
      {
        id: 1,
        label: 'An electrifying curiosity to explore',
        sublabel: 'Wondering about exoplanets, JWST deep fields, and deep astrophysical laws.',
        archetypeAffinity: 'stellar-seeker',
        dimensionWeights: { intuition: 5, curiosity: 30, vitality: 10, harmony: 10, transcendence: 20 },
      },
      {
        id: 2,
        label: 'A surge of creative fire and purpose',
        sublabel: 'Feeling inspired to build, create, manifest, and share vitality with the world.',
        archetypeAffinity: 'solar-alchemist',
        dimensionWeights: { intuition: 10, curiosity: 15, vitality: 30, harmony: 10, transcendence: 15 },
      },
      {
        id: 3,
        label: 'An emotional synchronization with the Moon',
        sublabel: 'Sensing the ebb and flow of life cycles, tides, and quiet renewal.',
        archetypeAffinity: 'lunar-harmonizer',
        dimensionWeights: { intuition: 20, curiosity: 10, vitality: 10, harmony: 30, transcendence: 15 },
      },
      {
        id: 4,
        label: 'A profound sense of interconnected quantum design',
        sublabel: 'Realizing the macrocosm and microcosm are reflections of a single living tapestry.',
        archetypeAffinity: 'galactic-architect',
        dimensionWeights: { intuition: 15, curiosity: 20, vitality: 10, harmony: 10, transcendence: 30 },
      },
    ],
  },

  {
    id: 'sound',
    step: 2,
    category: 'Acoustic Resonance',
    question: 'Which sonic atmosphere brings your mind to its most effortless state of flow?',
    context: 'Sound is sacred geometry in motion. Your resonance determines your optimal Solfeggio soundscape.',
    choices: [
      {
        id: 0,
        label: '432 Hz Solfeggio Sine Waves & Cosmic Drone Pads',
        sublabel: 'Warm, velvet frequencies that slow brainwaves and restore organic harmony.',
        archetypeAffinity: 'nebula-mystic',
        dimensionWeights: { intuition: 20, curiosity: 5, vitality: 5, harmony: 25, transcendence: 20 },
      },
      {
        id: 1,
        label: 'Deep-Space Radio Sonifications & Stellar Pulsars',
        sublabel: 'Electromagnetic radio signals translated from distant celestial bodies.',
        archetypeAffinity: 'stellar-seeker',
        dimensionWeights: { intuition: 10, curiosity: 25, vitality: 10, harmony: 10, transcendence: 20 },
      },
      {
        id: 2,
        label: '528 Hz Solar Transformation & Vibrant Melodic Tones',
        sublabel: 'Energizing frequencies associated with DNA repair, vitality, and creative drive.',
        archetypeAffinity: 'solar-alchemist',
        dimensionWeights: { intuition: 10, curiosity: 15, vitality: 25, harmony: 15, transcendence: 15 },
      },
      {
        id: 3,
        label: 'Tibetan Singing Bowls & 6 Hz Theta Binaural Beats',
        sublabel: 'Resonant bell overtones that synchronize left and right brain hemispheres.',
        archetypeAffinity: 'lunar-harmonizer',
        dimensionWeights: { intuition: 25, curiosity: 5, vitality: 5, harmony: 25, transcendence: 15 },
      },
      {
        id: 4,
        label: '396 Hz Earth-Root Grounding & Low Planetary Hums',
        sublabel: 'Deep stabilizing sub-bass frequencies that dissolve tension and anchor the physical body.',
        archetypeAffinity: 'astral-anchor',
        dimensionWeights: { intuition: 10, curiosity: 10, vitality: 15, harmony: 25, transcendence: 10 },
      },
    ],
  },

  {
    id: 'hour',
    step: 3,
    category: 'Circadian Celestial Window',
    question: 'At which cosmic transition hour does your mental clarity reach its peak?',
    context: 'The angle of sunlight and planetary positions create natural windows for meditation, action, and contemplation.',
    choices: [
      {
        id: 0,
        label: 'Golden Hour Dawn (First Solar Light)',
        sublabel: 'When the world is quiet and the Sun breathes fresh prana into living beings.',
        archetypeAffinity: 'solar-alchemist',
        dimensionWeights: { intuition: 10, curiosity: 15, vitality: 30, harmony: 15, transcendence: 10 },
      },
      {
        id: 1,
        label: 'Astronomical Twilight (The Sunset Veil)',
        sublabel: 'The gradient moment when the first stars ignite and day dissolves into cosmos.',
        archetypeAffinity: 'stellar-seeker',
        dimensionWeights: { intuition: 20, curiosity: 20, vitality: 10, harmony: 20, transcendence: 15 },
      },
      {
        id: 2,
        label: 'Lunar Midnight (Stargazing Peak)',
        sublabel: 'When the physical world sleeps and celestial silence allows deep reflection.',
        archetypeAffinity: 'lunar-harmonizer',
        dimensionWeights: { intuition: 25, curiosity: 10, vitality: 5, harmony: 25, transcendence: 20 },
      },
      {
        id: 3,
        label: 'The 3:00 AM Lucid Hour (Astral Dream Window)',
        sublabel: 'The threshold where intuition and subconscious symbolism are most lucid.',
        archetypeAffinity: 'nebula-mystic',
        dimensionWeights: { intuition: 30, curiosity: 10, vitality: 5, harmony: 15, transcendence: 30 },
      },
      {
        id: 4,
        label: 'Solar High Noon (Peak Daylight Radiance)',
        sublabel: 'Maximum solar illumination, active focus, and purposeful manifestation.',
        archetypeAffinity: 'astral-anchor',
        dimensionWeights: { intuition: 5, curiosity: 15, vitality: 25, harmony: 20, transcendence: 10 },
      },
    ],
  },

  {
    id: 'reflection',
    step: 4,
    category: 'Inner Inscription',
    question: 'When you sit down to write in your private Astro-Journal, what calls to be recorded?',
    context: 'Your journaling instinct indicates where your spiritual consciousness does its deepest processing.',
    choices: [
      {
        id: 0,
        label: 'Vivid dreams, symbolic visions, and inner feelings',
        sublabel: 'Deciphering subconscious messages and emotional patterns.',
        archetypeAffinity: 'nebula-mystic',
        dimensionWeights: { intuition: 30, curiosity: 10, vitality: 5, harmony: 20, transcendence: 20 },
      },
      {
        id: 1,
        label: 'Aha moments, scientific reflections, and philosophical ideas',
        sublabel: 'Exploring concepts about spacetime, cosmology, and the mechanics of reality.',
        archetypeAffinity: 'stellar-seeker',
        dimensionWeights: { intuition: 10, curiosity: 30, vitality: 10, harmony: 10, transcendence: 20 },
      },
      {
        id: 2,
        label: 'Intentions, projects, creative breakthroughs, and gratitude',
        sublabel: 'Tracking personal evolution and setting focused energetic goals.',
        archetypeAffinity: 'solar-alchemist',
        dimensionWeights: { intuition: 10, curiosity: 15, vitality: 30, harmony: 15, transcendence: 10 },
      },
      {
        id: 3,
        label: 'Synchronicities, moon cycle reflections, and energetic shifts',
        sublabel: 'Noticing how outer planetary cycles align with inner emotional states.',
        archetypeAffinity: 'lunar-harmonizer',
        dimensionWeights: { intuition: 25, curiosity: 15, vitality: 10, harmony: 25, transcendence: 15 },
      },
      {
        id: 4,
        label: 'Practices of grounding, presence, and holding space for others',
        sublabel: 'Anchoring peace in daily life and celebrating simple human connection.',
        archetypeAffinity: 'astral-anchor',
        dimensionWeights: { intuition: 15, curiosity: 10, vitality: 15, harmony: 30, transcendence: 10 },
      },
    ],
  },

  {
    id: 'element',
    step: 5,
    category: 'Elemental Origin',
    question: 'Which fundamental element or astrological force resonates most with your spirit?',
    context: 'Your chosen element forms the bedrock anchor of your celestial identity.',
    choices: [
      {
        id: 0,
        label: 'Fire (Solar Flame • Aries, Leo, Sagittarius)',
        sublabel: 'Radiant energy, courage, transformation, and dynamic creative passion.',
        archetypeAffinity: 'solar-alchemist',
        dimensionWeights: { intuition: 10, curiosity: 15, vitality: 35, harmony: 10, transcendence: 15 },
      },
      {
        id: 1,
        label: 'Water (Lunar Tides • Cancer, Scorpio, Pisces)',
        sublabel: 'Intuitive depths, emotional flow, healing empathy, and subconscious wisdom.',
        archetypeAffinity: 'lunar-harmonizer',
        dimensionWeights: { intuition: 30, curiosity: 10, vitality: 10, harmony: 30, transcendence: 15 },
      },
      {
        id: 2,
        label: 'Air (Astral Winds • Gemini, Libra, Aquarius)',
        sublabel: 'Intellect, cosmic curiosity, freedom of movement, and high-frequency communication.',
        archetypeAffinity: 'stellar-seeker',
        dimensionWeights: { intuition: 15, curiosity: 35, vitality: 10, harmony: 15, transcendence: 20 },
      },
      {
        id: 3,
        label: 'Earth (Stardust Matter • Taurus, Virgo, Capricorn)',
        sublabel: 'Stability, patient growth, physical grounding, and resilience through time.',
        archetypeAffinity: 'astral-anchor',
        dimensionWeights: { intuition: 10, curiosity: 10, vitality: 20, harmony: 30, transcendence: 10 },
      },
      {
        id: 4,
        label: 'Ether (Quantum Void • The Spacetime Fabric)',
        sublabel: 'The unified field of pure consciousness connecting all dimensions.',
        archetypeAffinity: 'galactic-architect',
        dimensionWeights: { intuition: 20, curiosity: 20, vitality: 10, harmony: 10, transcendence: 35 },
      },
    ],
  },
];
