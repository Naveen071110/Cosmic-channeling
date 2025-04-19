import { Quote, CelestialObject, CosmicPattern, CosmicSound, QuizQuestion, QuizResult } from '@/types';

// Cosmic Quotes Data
export const quotes: Quote[] = [
  {
    id: "1",
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
    author: "Carl Sagan"
  },
  {
    id: "2",
    text: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist.",
    author: "Stephen Hawking"
  },
  {
    id: "3",
    text: "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.",
    author: "Stephen Hawking"
  },
  {
    id: "4",
    text: "I'm sure the universe is full of intelligent life. It's just been too intelligent to come here.",
    author: "Arthur C. Clarke"
  },
  {
    id: "5",
    text: "The Universe is under no obligation to make sense to you.",
    author: "Neil deGrasse Tyson"
  },
  {
    id: "6",
    text: "For small creatures such as we, the vastness is bearable only through love.",
    author: "Carl Sagan"
  },
  {
    id: "7",
    text: "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.",
    author: "Carl Sagan"
  },
  {
    id: "8",
    text: "We are all connected; To each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
    author: "Neil deGrasse Tyson"
  },
  {
    id: "9",
    text: "To confine our attention to terrestrial matters would be to limit the human spirit.",
    author: "Stephen Hawking"
  },
  {
    id: "10",
    text: "The stars are not afraid to appear like fireflies.",
    author: "Rabindranath Tagore"
  }
];

// Celestial Objects Data
export const celestialObjects: CelestialObject[] = [
  {
    id: "saturn",
    name: "Saturn",
    type: "planet",
    image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth."
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. Mars is often called the 'Red Planet' due to its reddish appearance."
  },
  {
    id: "andromeda",
    name: "Andromeda Galaxy",
    type: "galaxy",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    description: "The Andromeda Galaxy, also known as Messier 31, is a spiral galaxy approximately 2.5 million light-years from Earth and the nearest major galaxy to the Milky Way."
  },
  {
    id: "orion",
    name: "Orion Nebula",
    type: "nebula",
    image: "https://images.unsplash.com/photo-1570032257806-7272438f38da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "The Orion Nebula is a diffuse nebula situated in the Milky Way, being south of Orion's Belt in the constellation of Orion. It is one of the brightest nebulae, and is visible to the naked eye in the night sky."
  },
  {
    id: "trappist1e",
    name: "TRAPPIST-1e",
    type: "exoplanet",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    description: "TRAPPIST-1e is an exoplanet orbiting the ultra-cool dwarf star TRAPPIST-1. It is the fourth planet in order of distance from its star. It is very likely tidally locked, with one face always towards its star."
  }
];

// Cosmic Patterns Data
export const cosmicPatterns: CosmicPattern[] = [
  {
    id: "pattern1",
    image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    question: "If consciousness affects reality at the quantum level, how might your thoughts be shaping the universe?",
    affirmation: "I am a conscious participant in the universal flow of cosmic energy."
  },
  {
    id: "pattern2",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
    question: "What if the stars you see at night are sending you personal messages across time and space?",
    affirmation: "I am connected to the vast wisdom of the universe."
  },
  {
    id: "pattern3",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    question: "How might your life change if you viewed yourself as a cosmic being having a human experience?",
    affirmation: "I am an eternal cosmic being experiencing the physical world."
  },
  {
    id: "pattern4",
    image: "https://images.unsplash.com/photo-1570032257806-7272438f38da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    question: "If you could communicate with any celestial body, which would you choose and what would you ask?",
    affirmation: "My intuition guides me to cosmic wisdom beyond logical understanding."
  }
];

// Cosmic Sounds Data
export const cosmicSounds: CosmicSound[] = [
  {
    id: "voyager",
    title: "Voyager Golden Record",
    description: "Sounds of Earth traveling beyond our solar system",
    audioUrl: "https://cdn.freesound.org/previews/542/542092_7374079-lq.mp3"
  },
  {
    id: "saturn",
    title: "Saturn's Radio Emissions",
    description: "Electromagnetic waves captured by Cassini",
    audioUrl: "https://cdn.freesound.org/previews/529/529515_11232529-lq.mp3"
  },
  {
    id: "pulsar",
    title: "Pulsar PSR B0329+54",
    description: "Radio signals from a rapidly rotating neutron star",
    audioUrl: "https://cdn.freesound.org/previews/323/323099_5865517-lq.mp3"
  },
  {
    id: "sun",
    title: "Solar Sonification",
    description: "The Sun's vibrations converted to audible sound",
    audioUrl: "https://cdn.freesound.org/previews/459/459657_9015615-lq.mp3"
  }
];

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When gazing at the night sky, what draws your attention most?",
    options: [
      "The patterns of constellations and their stories",
      "The vastness and infinite possibilities",
      "The scientific wonders and celestial mechanics",
      "The potential for other intelligent life"
    ]
  },
  {
    id: 2,
    question: "How do you prefer to explore cosmic ideas?",
    options: [
      "Through meditation and inner journeys",
      "By reading scientific articles and studies",
      "Watching documentaries about space",
      "Discussing philosophical questions with others"
    ]
  },
  {
    id: 3,
    question: "If you could have one cosmic ability, what would it be?",
    options: [
      "To travel instantly to any point in the universe",
      "To communicate with cosmic consciousness",
      "To understand all physical laws of the universe",
      "To see the past and future of celestial objects"
    ]
  },
  {
    id: 4,
    question: "What aspect of existence most fascinates you?",
    options: [
      "The possibility of multiple dimensions",
      "The interconnectedness of all things",
      "The physical laws that govern reality",
      "The possibility of life beyond Earth"
    ]
  },
  {
    id: 5,
    question: "What do you seek most from your cosmic journey?",
    options: [
      "Spiritual enlightenment",
      "Scientific understanding",
      "Wonder and inspiration",
      "Connection with something greater"
    ]
  }
];

// Quiz Results
export const quizResults: QuizResult[] = [
  {
    title: "Stellar Seeker",
    description: "You are drawn to the mysteries of the cosmos and seek spiritual growth through cosmic connection. Your intuitive nature helps you perceive patterns others miss.",
    archetype: "Seeker"
  },
  {
    title: "Quantum Explorer",
    description: "You blend scientific curiosity with spiritual openness. You're fascinated by the quantum nature of reality and how consciousness interacts with the physical world.",
    archetype: "Explorer"
  },
  {
    title: "Cosmic Sage",
    description: "Your wisdom comes from understanding the interconnectedness of all things. You see the universe as a living entity and yourself as an integral part of it.",
    archetype: "Sage"
  },
  {
    title: "Astral Voyager",
    description: "You're a natural traveler of the mind and spirit. Your imagination allows you to journey beyond physical limitations and explore the frontiers of consciousness.",
    archetype: "Voyager"
  },
  {
    title: "Star Weaver",
    description: "You see the threads that connect all beings and events. You have a gift for finding meaning in cosmic coincidences and weaving them into your life story.",
    archetype: "Weaver"
  }
];
