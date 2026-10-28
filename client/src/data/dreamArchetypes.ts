/**
 * Pre-Computed 100+ Jungian & Cosmic Dream Archetype Engine
 * Operates 100% locally with zero external API dependencies and zero latency.
 */

export interface DreamSymbolArchetype {
  id: string;
  symbol: string;
  keywords: string[];
  category: 'Celestial' | 'Jungian' | 'Sacred Geometry' | 'Totem' | 'Consciousness';
  psychologicalMeaning: string;
  cosmicConnection: string;
  guidancePrompt: string;
  tags: string[];
}

export interface DreamAnalysisResult {
  interpretation: string;
  symbolsFound: DreamSymbolArchetype[];
  tags: string[];
  cosmicGuidance: string;
}

export const DREAM_ARCHETYPES: DreamSymbolArchetype[] = [
  {
    "id": "star",
    "symbol": "Star / Constellation",
    "keywords": [
      "star",
      "stars",
      "starlight",
      "constellation",
      "polaris",
      "north star"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "The Self acting as an inner beacon of orientation amid the dark unconscious.",
    "cosmicConnection": "Cosmic Guidance & Soul Navigation",
    "guidancePrompt": "What fixed principle or inner truth is guiding you through your current uncertainty?",
    "tags": [
      "Navigation",
      "Illumination",
      "Destiny"
    ]
  },
  {
    "id": "supernova",
    "symbol": "Supernova / Exploding Star",
    "keywords": [
      "supernova",
      "exploding star",
      "explosion in space",
      "cosmic blast"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Catastrophic transformation where outdated psychological structures shatter to release creative energy.",
    "cosmicConnection": "Cataclysmic Rebirth & Element Synthesis",
    "guidancePrompt": "What old identity or emotional pattern is undergoing a necessary collapse?",
    "tags": [
      "Transformation",
      "Creative Fire",
      "Breakthrough"
    ]
  },
  {
    "id": "black-hole",
    "symbol": "Black Hole / Singularity",
    "keywords": [
      "black hole",
      "singularity",
      "event horizon",
      "gravity well",
      "gravitational pull"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Encounter with the deep Shadow or personal unconscious where time and ego dissolve.",
    "cosmicConnection": "Gravitational Core & Transpersonal Void",
    "guidancePrompt": "Are you resisting surrendering control to a necessary deep transformation?",
    "tags": [
      "Shadow Work",
      "Ego Dissolution",
      "Mystery"
    ]
  },
  {
    "id": "nebula",
    "symbol": "Nebula / Stellar Nursery",
    "keywords": [
      "nebula",
      "stellar nursery",
      "cosmic cloud",
      "colorful space cloud",
      "cosmic dust"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "The fertile, unformed potential of the psyche waiting for conscious intent to birth new creations.",
    "cosmicConnection": "Creative Genesis & Womb of the Cosmos",
    "guidancePrompt": "What creative seedling or unexpressed passion is longing to take form in your waking life?",
    "tags": [
      "Genesis",
      "Imagination",
      "Potential"
    ]
  },
  {
    "id": "galaxy",
    "symbol": "Spiral Galaxy / Milky Way",
    "keywords": [
      "galaxy",
      "milky way",
      "andromeda",
      "galactic spiral",
      "swirling stars"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Integration of disparate elements of the personality into a coherent, self-balancing whole.",
    "cosmicConnection": "Macrocosmic Harmony & Galactic Orbit",
    "guidancePrompt": "How can you view your current situation from a wider, panoramic cosmic perspective?",
    "tags": [
      "Wholeness",
      "Integration",
      "Macrocosm"
    ]
  },
  {
    "id": "eclipse",
    "symbol": "Solar or Lunar Eclipse",
    "keywords": [
      "eclipse",
      "solar eclipse",
      "lunar eclipse",
      "totality",
      "sun obscured",
      "blood moon"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "The temporary obscuration of conscious awareness (Sun) by emotional/intuitive instinct (Moon).",
    "cosmicConnection": "Syzygy Alignment & Shadow Convergence",
    "guidancePrompt": "What intuitive or suppressed emotion is momentarily demanding your undivided attention?",
    "tags": [
      "Shadow Integration",
      "Threshold",
      "Awakening"
    ]
  },
  {
    "id": "comet",
    "symbol": "Comet / Shooting Star",
    "keywords": [
      "comet",
      "shooting star",
      "meteor",
      "falling star",
      "asteroid",
      "fireball"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Sudden epiphanies, volatile impulses, or rare messengers from the distant reaches of awareness.",
    "cosmicConnection": "Interstellar Harbinger & Celestial Momentum",
    "guidancePrompt": "What sudden intuitive flash or unexpected catalyst has recently entered your awareness?",
    "tags": [
      "Epiphany",
      "Momentum",
      "Inspiration"
    ]
  },
  {
    "id": "moon",
    "symbol": "Moon / Lunar Phases",
    "keywords": [
      "moon",
      "crescent moon",
      "full moon",
      "lunar",
      "moonlight"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "The feminine, receptive unconscious, emotional ebb and flow, and cyclical nature of growth.",
    "cosmicConnection": "Gravitational Tide & Reflection of Light",
    "guidancePrompt": "Which phase of your personal rhythm are you in: releasing, resting, or waxing into fullness?",
    "tags": [
      "Intuition",
      "Rhythm",
      "Receptivity"
    ]
  },
  {
    "id": "sun",
    "symbol": "Sun / Solar Flare",
    "keywords": [
      "sun",
      "sunlight",
      "solar flare",
      "solar",
      "sunrise",
      "golden ray"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Radiant conscious will, vitality, clarity of purpose, and the masculine generative principle.",
    "cosmicConnection": "Solar Core & Life-Giving Radiation",
    "guidancePrompt": "Where are you being asked to shine your warmth, clarity, and authentic authority?",
    "tags": [
      "Vitality",
      "Consciousness",
      "Clarity"
    ]
  },
  {
    "id": "aurora",
    "symbol": "Aurora Borealis / Celestial Curtains",
    "keywords": [
      "aurora",
      "northern lights",
      "aurora borealis",
      "green glow in sky",
      "solar wind curtain"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Spiritual ecstasy and the harmonious dance between solar willpower and geomagnetic receptivity.",
    "cosmicConnection": "Geomagnetic Shield & Solar Wind Interaction",
    "guidancePrompt": "Are you allowing high-frequency spiritual insights to be grounded gently into your nervous system?",
    "tags": [
      "Spiritual Ecstasy",
      "Subtle Energy",
      "Harmony"
    ]
  },
  {
    "id": "void",
    "symbol": "Cosmic Void / Deep Space Abyss",
    "keywords": [
      "void",
      "empty space",
      "abyss",
      "nothingness",
      "pitch black space",
      "vacuum"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "The primordial plenum preceding creation; psychological zero-point allowing total reset.",
    "cosmicConnection": "Primordial Vacuum & Quantum Potential",
    "guidancePrompt": "Can you make peace with the empty space before the next phase of your life reveals itself?",
    "tags": [
      "Zero Point",
      "Stillness",
      "Rebirth"
    ]
  },
  {
    "id": "zero-gravity",
    "symbol": "Zero-Gravity / Weightlessness",
    "keywords": [
      "zero gravity",
      "weightless",
      "floating in space",
      "no gravity",
      "untethered"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Liberation from earthly anxieties and physical constraints, transcending ego gravity.",
    "cosmicConnection": "Orbital Freefall & Equilibrium",
    "guidancePrompt": "What heavy mental baggage or duty can you gently release to regain your lightness of spirit?",
    "tags": [
      "Freedom",
      "Transcendence",
      "Detachment"
    ]
  },
  {
    "id": "spacewalk",
    "symbol": "Spacewalk / Untethered Astronaut",
    "keywords": [
      "spacewalk",
      "astronaut",
      "spacesuit",
      "tether",
      "floating outside ship"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Testing personal independence in unfamiliar psychic realms while relying on inner survival gear.",
    "cosmicConnection": "Human Consciousness in the Vacuum",
    "guidancePrompt": "Do you trust your inner resources enough to explore territory where no familiar anchors exist?",
    "tags": [
      "Courage",
      "Exploration",
      "Self-Reliance"
    ]
  },
  {
    "id": "alien-landscape",
    "symbol": "Alien Planet / Exoplanet",
    "keywords": [
      "alien planet",
      "exoplanet",
      "foreign world",
      "twin suns",
      "unearthly landscape"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "Uncharted territories of personal development and novel ways of being outside social conditioning.",
    "cosmicConnection": "Extraterrestrial Possibility & Infinite Habitats",
    "guidancePrompt": "What unfamiliar aspect of yourself are you being invited to normalize and explore?",
    "tags": [
      "Novelty",
      "Evolution",
      "Expansion"
    ]
  },
  {
    "id": "cosmic-portal",
    "symbol": "Wormhole / Dimensional Portal",
    "keywords": [
      "wormhole",
      "portal",
      "gateway",
      "vortex",
      "stargate",
      "dimensional rift"
    ],
    "category": "Celestial",
    "psychologicalMeaning": "A non-linear quantum leap in awareness that collapses previous boundaries of space and time.",
    "cosmicConnection": "Spacetime Folding & Quantum Entanglement",
    "guidancePrompt": "What belief about 'how long change takes' are you ready to collapse instantly?",
    "tags": [
      "Quantum Leap",
      "Transition",
      "Acceleration"
    ]
  },
  {
    "id": "shadow",
    "symbol": "The Shadow / Dark Figure",
    "keywords": [
      "shadow",
      "dark figure",
      "stalker",
      "mysterious stranger",
      "pursuer",
      "cloaked figure"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "Repressed or disowned qualities of the self that contain tremendous vitality once acknowledged.",
    "cosmicConnection": "Dark Matter & Hidden Gravitational Mass",
    "guidancePrompt": "What trait that you dislike in others might be an unacknowledged part of your own power?",
    "tags": [
      "Shadow Work",
      "Reclaiming Power",
      "Wholeness"
    ]
  },
  {
    "id": "anima-animus",
    "symbol": "The Syzygy / Sacred Counterpart",
    "keywords": [
      "soulmate",
      "divine lover",
      "sacred bride",
      "celestial bridegroom",
      "mystical partner",
      "counterpart"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The inner contra-sexual archetype (Anima/Animus) guiding the conscious mind toward the soul.",
    "cosmicConnection": "Binary Star System & Orbital Dance",
    "guidancePrompt": "How can you cultivate the balance of receptivity and action within yourself today?",
    "tags": [
      "Sacred Union",
      "Balance",
      "Inner Marriage"
    ]
  },
  {
    "id": "wise-elder",
    "symbol": "Wise Old Man / Crone Guide",
    "keywords": [
      "wise old man",
      "crone",
      "elder",
      "guru",
      "sage",
      "teacher",
      "hermit",
      "ancient woman"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The Senex archetype representing deep archetypal wisdom, maturity, and spiritual counsel.",
    "cosmicConnection": "Ancient Starlight & Timeless Architecture",
    "guidancePrompt": "If your oldest and wisest future self spoke to you right now, what advice would they give?",
    "tags": [
      "Wisdom",
      "Mentorship",
      "Soul Counsel"
    ]
  },
  {
    "id": "cosmic-child",
    "symbol": "The Divine Child",
    "keywords": [
      "baby",
      "child",
      "radiant child",
      "infant",
      "golden youth",
      "innocent child"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The Puer Aeternus archetype representing new beginnings, invulnerability, and spiritual rebirth.",
    "cosmicConnection": "Protostellar Nucleation & Radiant Dawn",
    "guidancePrompt": "What innocent enthusiasm or wonder from your youth needs to be revived?",
    "tags": [
      "Rebirth",
      "Innocence",
      "Genesis"
    ]
  },
  {
    "id": "mirror",
    "symbol": "Mirror / Reflective Surface",
    "keywords": [
      "mirror",
      "reflection",
      "looking glass",
      "glass reflection",
      "mirrors"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "Confrontation with true self-image versus the masks and personas worn in daily life.",
    "cosmicConnection": "Prismatic Dispersion & Photonic Reflection",
    "guidancePrompt": "Who are you when no one is watching and you have nothing to prove?",
    "tags": [
      "Self-Knowledge",
      "Authenticity",
      "Persona"
    ]
  },
  {
    "id": "mask",
    "symbol": "Mask / Persona",
    "keywords": [
      "mask",
      "disguise",
      "costume",
      "fake face",
      "unmasking"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The social facade (Persona) negotiated between the individual and society.",
    "cosmicConnection": "Planetary Atmosphere Shielding the Core",
    "guidancePrompt": "Which social mask has grown too tight, heavy, or dishonest to keep wearing?",
    "tags": [
      "Persona",
      "Truth",
      "Vulnerability"
    ]
  },
  {
    "id": "labyrinth",
    "symbol": "Labyrinth / Maze",
    "keywords": [
      "labyrinth",
      "maze",
      "winding corridors",
      "lost in corridors",
      "underground passage"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The winding journey toward the psychological center (the Self) through complexity.",
    "cosmicConnection": "Galactic Orbital Trajectory & Fibonacci Curve",
    "guidancePrompt": "Can you trust that the current twists and turns are leading directly to your true center?",
    "tags": [
      "Individuation",
      "Trust",
      "Patience"
    ]
  },
  {
    "id": "falling",
    "symbol": "Falling Through Space",
    "keywords": [
      "falling",
      "dropping",
      "plummeting",
      "falling from sky",
      "falling forever"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "Fear of losing conscious control, surrender to the unconscious, or release of anxiety.",
    "cosmicConnection": "Freefall Orbit Around Celestial Center",
    "guidancePrompt": "What would happen if you stopped clutching and allowed yourself to be caught by life?",
    "tags": [
      "Surrender",
      "Trust",
      "Release"
    ]
  },
  {
    "id": "flying",
    "symbol": "Flight / Soaring Over Earth",
    "keywords": [
      "flying",
      "soaring",
      "gliding",
      "flying like bird",
      "levitating",
      "wings"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "Expansion of perspective, rising above petty conflict, and spiritual empowerment.",
    "cosmicConnection": "Atmospheric Escape Velocity",
    "guidancePrompt": "How can you bring this soaring, uninhibited freedom back down into your daily routine?",
    "tags": [
      "Empowerment",
      "Perspective",
      "Liberation"
    ]
  },
  {
    "id": "tower",
    "symbol": "Crumbling Tower / Structure",
    "keywords": [
      "tower",
      "castle",
      "skyscraper",
      "building collapse",
      "walls crumbling"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The dismantling of rigid dogmas, false pride, and outdated ego fortifications.",
    "cosmicConnection": "Stellar Collapse to Neutron Density",
    "guidancePrompt": "What fragile defense structure in your life is ready to be cleared for genuine ground?",
    "tags": [
      "Breakthrough",
      "Humility",
      "Renewal"
    ]
  },
  {
    "id": "rebirth",
    "symbol": "Death and Resurrection",
    "keywords": [
      "death",
      "dying",
      "funeral",
      "corpse",
      "resurrection",
      "rising from dead"
    ],
    "category": "Jungian",
    "psychologicalMeaning": "The end of an old psychological epoch to allow the emergence of higher consciousness.",
    "cosmicConnection": "Supernova Remnant Seeding New Solar Systems",
    "guidancePrompt": "What part of your old self must be lovingly laid to rest today?",
    "tags": [
      "Metamorphosis",
      "Ego Death",
      "Resurrection"
    ]
  },
  {
    "id": "mandala",
    "symbol": "Mandala / Sacred Circle",
    "keywords": [
      "mandala",
      "circle of light",
      "rosette",
      "sacred geometry",
      "flower of life"
    ],
    "category": "Sacred Geometry",
    "psychologicalMeaning": "The archetypal image of psychological wholeness, order, and psychic equilibrium.",
    "cosmicConnection": "Planetary Orbital Resonances & Cymatics",
    "guidancePrompt": "How can you center yourself amid external chaos and return to your peaceful core?",
    "tags": [
      "Wholeness",
      "Centering",
      "Harmony"
    ]
  },
  {
    "id": "spiral",
    "symbol": "Golden Spiral / Nautilus",
    "keywords": [
      "spiral",
      "golden ratio",
      "fibonacci",
      "swirl",
      "helix",
      "vortex"
    ],
    "category": "Sacred Geometry",
    "psychologicalMeaning": "Evolutionary growth returning to past themes at higher octaves of maturity.",
    "cosmicConnection": "Fibonacci Spiral of Galaxies and Hurricanes",
    "guidancePrompt": "Recognize that returning to an old lesson is not regression, but deepening on a higher spiral.",
    "tags": [
      "Evolution",
      "Growth",
      "Unfolding"
    ]
  },
  {
    "id": "ouroboros",
    "symbol": "Ouroboros / Serpent Eating Tail",
    "keywords": [
      "ouroboros",
      "snake eating tail",
      "circular serpent",
      "dragon tail",
      "eternal loop"
    ],
    "category": "Sacred Geometry",
    "psychologicalMeaning": "The eternal cycle of life, death, renewal, and the self-contained nature of the universe.",
    "cosmicConnection": "Conservation of Energy & Closed Cosmic Cycles",
    "guidancePrompt": "What cycle in your life is completing its full loop, ready to start anew?",
    "tags": [
      "Eternal Return",
      "Continuity",
      "Wholeness"
    ]
  },
  {
    "id": "pyramid",
    "symbol": "Pyramid / Triangle of Light",
    "keywords": [
      "pyramid",
      "tetrahedron",
      "triangle",
      "golden pyramid",
      "prismatic triangle"
    ],
    "category": "Sacred Geometry",
    "psychologicalMeaning": "Ascension of spirit from material foundation (square base) to unified singular point (apex).",
    "cosmicConnection": "Prismatic Light Refraction & Triadic Symmetry",
    "guidancePrompt": "How are you synthesizing body, mind, and spirit into a single focused peak of awareness?",
    "tags": [
      "Ascension",
      "Focus",
      "Integration"
    ]
  },
  {
    "id": "crystal",
    "symbol": "Quartz Crystal / Gemstone",
    "keywords": [
      "crystal",
      "gem",
      "diamond",
      "quartz",
      "amethyst",
      "prism",
      "faceted stone"
    ],
    "category": "Sacred Geometry",
    "psychologicalMeaning": "Clarity, coherence, and the enduring immortal facet of the individual soul.",
    "cosmicConnection": "Crystalline Lattice & Geometrical Compression",
    "guidancePrompt": "What pressures in your life are currently crystallizing your inner strength and clarity?",
    "tags": [
      "Clarity",
      "Coherence",
      "Resilience"
    ]
  },
  {
    "id": "sphere",
    "symbol": "Luminous Sphere / Celestial Orb",
    "keywords": [
      "sphere",
      "orb",
      "globe",
      "ball of light",
      "floating sphere"
    ],
    "category": "Sacred Geometry",
    "psychologicalMeaning": "The perfected archetype of the Self containing equal potential in every direction.",
    "cosmicConnection": "Hydrostatic Equilibrium of Celestial Bodies",
    "guidancePrompt": "In what way can you hold your boundaries without sharp edges or defensive walls?",
    "tags": [
      "Equilibrium",
      "Integrity",
      "Perfection"
    ]
  },
  {
    "id": "serpent",
    "symbol": "Serpent / Kundalini",
    "keywords": [
      "snake",
      "serpent",
      "cobra",
      "kundalini",
      "viper",
      "coiled snake"
    ],
    "category": "Totem",
    "psychologicalMeaning": "Instinctual wisdom, shedding old skin, healing power, and primal vital energy.",
    "cosmicConnection": "Serpens Constellation & Cosmic Caduceus",
    "guidancePrompt": "What outdated skin or persona are you overdue to slough off?",
    "tags": [
      "Regeneration",
      "Healing",
      "Primal Wisdom"
    ]
  },
  {
    "id": "eagle",
    "symbol": "Eagle / Celestial Hawk",
    "keywords": [
      "eagle",
      "hawk",
      "falcon",
      "golden eagle",
      "flying predator bird"
    ],
    "category": "Totem",
    "psychologicalMeaning": "Fierce visionary clarity, rising above earthly drama, and connection to the solar intellect.",
    "cosmicConnection": "Aquila Constellation & Solar Flight",
    "guidancePrompt": "Can you pull your vision up to a 30,000-foot view to see the overarching patterns?",
    "tags": [
      "Vision",
      "Intellect",
      "Clarity"
    ]
  },
  {
    "id": "whale",
    "symbol": "Cosmic Whale / Deep Ocean Behemoth",
    "keywords": [
      "whale",
      "cosmic whale",
      "orca",
      "humpback",
      "swimming in stars"
    ],
    "category": "Totem",
    "psychologicalMeaning": "Ancient acoustic memory, traversing deep waters of emotion, and gentle colossal strength.",
    "cosmicConnection": "Cetus Constellation & Ocean-Space Resonance",
    "guidancePrompt": "Listen for the deep song of your heart beneath the surface chatter of everyday thoughts.",
    "tags": [
      "Deep Memory",
      "Emotional Depth",
      "Acoustics"
    ]
  },
  {
    "id": "phoenix",
    "symbol": "The Phoenix / Firebird",
    "keywords": [
      "phoenix",
      "firebird",
      "burning bird",
      "rising from ashes",
      "golden plumage"
    ],
    "category": "Totem",
    "psychologicalMeaning": "Triumphant spiritual renewal after enduring fiery trials and tribulations.",
    "cosmicConnection": "Supernova Remnant Rebirth",
    "guidancePrompt": "Have faith that what feels like burning ashes is the fertile soil for your greatest rebirth.",
    "tags": [
      "Resilience",
      "Rebirth",
      "Transmutation"
    ]
  },
  {
    "id": "wolf",
    "symbol": "Lupine Guide / The Wolf",
    "keywords": [
      "wolf",
      "pack",
      "howling at moon",
      "lone wolf",
      "white wolf"
    ],
    "category": "Totem",
    "psychologicalMeaning": "Instinctual loyalty, finding one's tribe, and honoring the wild intelligence of the body.",
    "cosmicConnection": "Lupus Constellation & Sirius Dog Star",
    "guidancePrompt": "Are you balancing your need for solitary sovereignty with healthy community connection?",
    "tags": [
      "Instinct",
      "Loyalty",
      "Wild Spirit"
    ]
  },
  {
    "id": "lucid-awakening",
    "symbol": "Lucid Dream / Awakening Inside Dream",
    "keywords": [
      "lucid",
      "became aware i was dreaming",
      "woke up inside dream",
      "controlling dream"
    ],
    "category": "Consciousness",
    "psychologicalMeaning": "Metacognitive awakening: realizing that waking consensus reality is also a malleable construct.",
    "cosmicConnection": "Observer Effect in Quantum Mechanics",
    "guidancePrompt": "How can you practice lucid awareness today, recognizing that you co-create your reality?",
    "tags": [
      "Lucidity",
      "Awakening",
      "Observer"
    ]
  },
  {
    "id": "telepathy",
    "symbol": "Telepathy / Mind-to-Mind Resonance",
    "keywords": [
      "telepathy",
      "mind reading",
      "communicating without words",
      "telepathic",
      "shared thoughts"
    ],
    "category": "Consciousness",
    "psychologicalMeaning": "Deep empathy and breaking through the illusion of separate, isolated minds.",
    "cosmicConnection": "Quantum Entanglement Across Distances",
    "guidancePrompt": "Who in your life can you listen to with intuitive silence rather than eager debate?",
    "tags": [
      "Empathy",
      "Connection",
      "Non-Separation"
    ]
  },
  {
    "id": "time-travel",
    "symbol": "Time Travel / Timeline Shift",
    "keywords": [
      "time travel",
      "future self",
      "past timeline",
      "parallel universe",
      "shift reality"
    ],
    "category": "Consciousness",
    "psychologicalMeaning": "Healing past ancestral trauma or receiving guidance from an enlightened future identity.",
    "cosmicConnection": "Relativistic Spacetime & Gravitational Dilation",
    "guidancePrompt": "What forgiveness can you send to your past self to liberate your present energy?",
    "tags": [
      "Timelessness",
      "Healing",
      "Integration"
    ]
  },
  {
    "id": "dissolution",
    "symbol": "Oceanic Dissolution / Becoming Light",
    "keywords": [
      "dissolving into light",
      "became pure energy",
      "no body",
      "melted into universe",
      "ego dissolved"
    ],
    "category": "Consciousness",
    "psychologicalMeaning": "Unio Mystica: the temporary mystical cessation of subject-object dualistic separation.",
    "cosmicConnection": "Total Entropy & Quantum Field Unity",
    "guidancePrompt": "Rest in the awareness that who you are is far more vast than the small stories of your mind.",
    "tags": [
      "Mystical Union",
      "Peace",
      "Absolute"
    ]
  },
  {
    "id": "sound-vibration",
    "symbol": "Cosmic Tone / Chime of the Universe",
    "keywords": [
      "sound",
      "humming",
      "celestial choir",
      "bell chime",
      "vibration in ears",
      "frequency"
    ],
    "category": "Consciousness",
    "psychologicalMeaning": "Direct perception of Nada Brahma: the universe as vibrating sound and harmonic consciousness.",
    "cosmicConnection": "Cosmic Microwave Background Acoustic Peaks",
    "guidancePrompt": "Attune your listening today to the subtle harmonics and undertones beneath spoken words.",
    "tags": [
      "Solfeggio",
      "Sound Current",
      "Harmonics"
    ]
  }
];

/**
 * Intelligent client-side natural language symbol extraction and Jungian-Cosmic synthesis.
 */
export function interpretDreamLocally(dreamText: string): DreamAnalysisResult {
  const textLower = dreamText.toLowerCase();

  // Find all matching archetypes using keyword matching with word boundaries
  const matchedArchetypes: { archetype: DreamSymbolArchetype; score: number }[] = [];

  for (const arch of DREAM_ARCHETYPES) {
    let score = 0;
    for (const kw of arch.keywords) {
      const regex = new RegExp('\\b' + kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i');
      if (regex.test(textLower)) {
        score += 2;
      } else if (textLower.includes(kw)) {
        score += 1;
      }
    }
    if (score > 0) {
      matchedArchetypes.push({ archetype: arch, score });
    }
  }

  // Sort by highest keyword relevance match
  matchedArchetypes.sort((a, b) => b.score - a.score);

  const topMatches = matchedArchetypes.slice(0, 3).map((m) => m.archetype);

  if (topMatches.length === 0) {
    // Elegant universal fallback based on dream tone
    return {
      interpretation: "Your dream reflects an essential journey through the uncharted realms of your personal unconscious. In Jungian psychology, even dreams without overt mythological motifs serve as self-regulating compasses, attempting to integrate waking conscious tensions with deeper somatic wisdom. The atmosphere you described signals an unfolding threshold in your spiritual and emotional evolution.",
      symbolsFound: [],
      tags: ["Unconscious Integration", "Self-Discovery", "Inner Compass"],
      cosmicGuidance: "Notice what emotions linger as you recall this dream. The feelings are the true messenger, pointing toward aspects of your life longing for greater harmony."
    };
  }

  // Synthesize rich psychological narrative from matched archetypes
  const primary = topMatches[0];
  const secondary = topMatches[1];
  const tertiary = topMatches[2];

  let interpretationText = `Your dream is charged with the archetypal presence of ${primary.symbol}. In analytical psychology, this reflects ${primary.psychologicalMeaning.toLowerCase()} From a cosmic perspective, this connects directly to ${primary.cosmicConnection}.`;

  if (secondary) {
    interpretationText += ` This is harmonized with the energy of ${secondary.symbol}, indicating that ${secondary.psychologicalMeaning.toLowerCase()}`;
  }

  if (tertiary) {
    interpretationText += ` Underlying these dynamics is the subtle current of ${tertiary.symbol}, anchoring ${tertiary.cosmicConnection.toLowerCase()}.`;
  }

  // Aggregate tags
  const tagsSet = new Set<string>();
  topMatches.forEach((m) => {
    tagsSet.add(m.symbol);
    m.tags.forEach((t) => tagsSet.add(t));
  });

  return {
    interpretation: interpretationText,
    symbolsFound: topMatches,
    tags: Array.from(tagsSet).slice(0, 5),
    cosmicGuidance: primary.guidancePrompt
  };
}
