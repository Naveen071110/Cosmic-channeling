export interface Quote {
  id: string;
  text: string;
  author: string;
}

export interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'galaxy' | 'nebula' | 'exoplanet';
  image: string;
  description: string;
}

export interface CosmicPattern {
  id: string;
  image: string;
  question: string;
  affirmation: string;
}

export interface CosmicSound {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

export interface JournalEntry {
  id: string;
  text: string;
  date: string;
  tags: string[];
}

export interface DreamInterpretation {
  interpretation: string;
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface QuizResult {
  title: string;
  description: string;
  archetype: string;
}
