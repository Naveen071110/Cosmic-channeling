export type ArchetypeId =
  | 'stellar-seeker'
  | 'nebula-mystic'
  | 'solar-alchemist'
  | 'lunar-harmonizer'
  | 'galactic-architect'
  | 'astral-anchor';

export type CosmicElement = 'Fire' | 'Earth' | 'Air' | 'Water' | 'Ether';

export interface ArchetypeDefinition {
  id: ArchetypeId;
  title: string;
  subtitle: string;
  element: CosmicElement;
  rulingFrequency: number; // in Hz (e.g. 432, 528, 741)
  frequencyName: string;   // e.g. "432Hz Universal Peace"
  patronCelestialBody: string; // e.g. "Carina Nebula"
  patronImageType: string;     // slug or keyword for celestial image
  tagline: string;
  description: string;
  traits: string[];
  spiritualGifts: string[];
  cosmicQuote: {
    text: string;
    author: string;
  };
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
    gradient: string;
    badgeBg: string;
    border: string;
  };
}

export interface DimensionScores {
  intuition: number;      // 0 - 100
  curiosity: number;      // 0 - 100
  vitality: number;       // 0 - 100
  harmony: number;        // 0 - 100
  transcendence: number;  // 0 - 100
}

export interface QuestionnaireAnswers {
  horizon: number;     // 0-4
  sound: number;       // 0-4
  hour: number;        // 0-4
  reflection: number;  // 0-4
  element: CosmicElement; // 'Fire' | 'Earth' | 'Air' | 'Water' | 'Ether'
}

export interface CosmicPersona {
  archetypeId: ArchetypeId;
  archetype: ArchetypeDefinition;
  element: CosmicElement;
  rulingFrequency: number;
  dimensions: DimensionScores;
  answers: QuestionnaireAnswers;
  completedAt: string;
  stardate: string;
}

export interface DailyAlignmentInsight {
  alignmentScore: number; // 0 - 100
  directive: string;
  lunarResonance: string;
  recommendedFrequency: number;
  frequencyLabel: string;
  optimalMeditationTime: string;
  patronBodyInSky: string;
  affirmation: string;
  journalPrompt: string;
}
