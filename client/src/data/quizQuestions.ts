export interface QuizQuestion {
  question: string;
  choices: string[];
}

export interface QuizResult {
  title: string;
  description: string;
  traits: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "When gazing at the night sky, what draws your attention most?",
    choices: [
      "The patterns of constellations and their stories",
      "The vastness and infinite possibilities",
      "The scientific wonders and celestial mechanics",
      "The potential for other intelligent life"
    ]
  },
  {
    question: "Which cosmic concept fascinates you the most?",
    choices: [
      "Sacred geometry and cosmic patterns",
      "Quantum entanglement and non-locality",
      "The balance of cosmic forces",
      "The future evolution of consciousness"
    ]
  },
  {
    question: "How do you typically approach a mystery?",
    choices: [
      "Seek ancient wisdom and symbolic meanings",
      "Explore multiple possibilities simultaneously",
      "Find the underlying harmony and connections",
      "Envision future implications and potentials"
    ]
  },
  {
    question: "What quality do you value most in yourself?",
    choices: [
      "Intuition and inner knowing",
      "Adaptability and openness to change",
      "Empathy and understanding",
      "Vision and innovative thinking"
    ]
  },
  {
    question: "If you could gain one cosmic ability, what would you choose?",
    choices: [
      "To read the Akashic records of universal knowledge",
      "To perceive multiple dimensions simultaneously",
      "To feel the emotions and experiences of all beings",
      "To see probable futures and timelines"
    ]
  }
];
