import { ArchetypeDefinition, ArchetypeId } from './types';

export const COSMIC_ARCHETYPES: Record<ArchetypeId, ArchetypeDefinition> = {
  'stellar-seeker': {
    id: 'stellar-seeker',
    title: 'Stellar Seeker',
    subtitle: 'The Astrophile & Cosmic Philosopher',
    element: 'Air',
    rulingFrequency: 741,
    frequencyName: '741 Hz Intuitive Awakening',
    patronCelestialBody: 'Andromeda Galaxy (M31)',
    patronImageType: 'andromeda',
    tagline: 'Gazing through telescopes to illuminate the mysteries of the cosmos.',
    description:
      'You are drawn to the boundless majesty of the universe through insatiable curiosity and sharp intellectual wonder. You find spiritual peace not by escaping reality, but by understanding the deep astrophysical laws, galactic symmetries, and astronomical wonders that connect human consciousness with the stars.',
    traits: ['Curious', 'Philosophical', 'Analytical', 'Observant', 'Visionary'],
    spiritualGifts: ['Pattern Recognition', 'Spacetime Mindfulness', 'Clarity of Thought', 'Intellectual Wonder'],
    cosmicQuote: {
      text: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood were made in the interiors of collapsing stars. We are made of starstuff.',
      author: 'Carl Sagan',
    },
    colorTheme: {
      primary: '#0EA5E9', // Sky Blue
      secondary: '#38BDF8',
      glow: 'rgba(14, 165, 233, 0.4)',
      gradient: 'from-sky-500 via-indigo-500 to-purple-600',
      badgeBg: 'bg-sky-950/80 text-sky-200 border-sky-500/40',
      border: 'border-sky-500/30',
    },
  },

  'nebula-mystic': {
    id: 'nebula-mystic',
    title: 'Nebula Mystic',
    subtitle: 'The Intuitive Dreamer & Void Voyager',
    element: 'Water',
    rulingFrequency: 432,
    frequencyName: '432 Hz Universal Peace',
    patronCelestialBody: 'Carina Nebula (Cosmic Cliffs)',
    patronImageType: 'carina',
    tagline: 'Dissolving boundaries within the glowing stellar nurseries of creation.',
    description:
      'You resonate with the quiet stillness and colorful gas clouds where baby stars are born. Highly sensitive to subtle energy currents, dream symbolism, and meditative silence, you experience the cosmos through emotional intuition and the heart-centered knowledge that we are all held in divine grace.',
    traits: ['Intuitive', 'Deeply Empathetic', 'Dreamer', 'Gentle', 'Soulful'],
    spiritualGifts: ['Lucid Visioning', 'Subconscious Healing', 'Emotional Coherence', 'Universal Compassion'],
    cosmicQuote: {
      text: 'Silence is the language of God, all else is poor translation. Sit in the quiet void of the nebula and listen.',
      author: 'Rumi',
    },
    colorTheme: {
      primary: '#A855F7', // Purple / Violet
      secondary: '#C084FC',
      glow: 'rgba(168, 85, 247, 0.4)',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
      badgeBg: 'bg-purple-950/80 text-purple-200 border-purple-500/40',
      border: 'border-purple-500/30',
    },
  },

  'solar-alchemist': {
    id: 'solar-alchemist',
    title: 'Solar Alchemist',
    subtitle: 'The Radiant Catalyst & Creator',
    element: 'Fire',
    rulingFrequency: 528,
    frequencyName: '528 Hz Miracle & Transformation',
    patronCelestialBody: 'The Sun (Helios)',
    patronImageType: 'sun',
    tagline: 'Channeling raw stellar fire to ignite purpose, vitality, and creative manifestation.',
    description:
      'You are energized by our host star, the golden dawn, and the fiery fusion that powers all earthly life. You do not just contemplate the universe—you actively channel its vital prana to build, inspire, transform obstacles into fuel, and illuminate the path for others.',
    traits: ['Passionate', 'Dynamic', 'Purpose-Driven', 'Creative', 'Inspiring'],
    spiritualGifts: ['Creative Manifestation', 'Solar Vitality', 'Courage & Leadership', 'Energetic Alchemy'],
    cosmicQuote: {
      text: 'Keep your face always toward the sunshine—and shadows will fall behind you.',
      author: 'Walt Whitman',
    },
    colorTheme: {
      primary: '#F59E0B', // Amber / Gold
      secondary: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.4)',
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-500/40',
      border: 'border-amber-500/30',
    },
  },

  'lunar-harmonizer': {
    id: 'lunar-harmonizer',
    title: 'Lunar Harmonizer',
    subtitle: 'The Rhythmic Balancer & Tide Keeper',
    element: 'Water',
    rulingFrequency: 639,
    frequencyName: '639 Hz Interpersonal Connection & 6Hz Theta',
    patronCelestialBody: 'The Moon (Luna)',
    patronImageType: 'moon',
    tagline: 'Aligning with circadian tides, lunar cycles, and the sacred balance of all living things.',
    description:
      'You are deeply synchronized with the waxing and waning rhythms of the Moon. With natural emotional wisdom, you navigate cycles of release and renewal with grace. You bring peaceful equilibrium to chaotic environments and help those around you trust the timing of their own growth.',
    traits: ['Harmonious', 'Rhythmic', 'Reflective', 'Receptive', 'Balancing'],
    spiritualGifts: ['Cyclic Intuition', 'Emotional Resetting', 'Harmonic Peace', 'Tidal Sensitivity'],
    cosmicQuote: {
      text: 'The moon does not fight. It attacks no one. It does not worry. It does not try to crush others. It keeps to its course, but by its very nature, it gently sways the tides.',
      author: 'Ming-Dao Deng',
    },
    colorTheme: {
      primary: '#38BDF8', // Cyan / Ice Blue
      secondary: '#7DD3FC',
      glow: 'rgba(56, 189, 248, 0.4)',
      gradient: 'from-sky-400 via-teal-400 to-indigo-500',
      badgeBg: 'bg-teal-950/80 text-teal-200 border-teal-500/40',
      border: 'border-teal-500/30',
    },
  },

  'galactic-architect': {
    id: 'galactic-architect',
    title: 'Galactic Architect',
    subtitle: 'The Spacetime Strategist & Macrocosm Weaver',
    element: 'Ether',
    rulingFrequency: 963,
    frequencyName: '963 Hz Crown Cosmos & Divine Unity',
    patronCelestialBody: 'Sagittarius A* (Supermassive Black Hole)',
    patronImageType: 'blackhole',
    tagline: 'Perceiving reality through quantum interconnectedness, multidimensional design, and the infinite web.',
    description:
      'You look past surface reality into the underlying geometric architecture of spacetime. Fascinated by black hole event horizons, multidimensional physics, and macrocosmic systems, you intuitively sense how micro thoughts ripple into macrocosmic realities.',
    traits: ['Visionary', 'Strategic', 'Holistic', 'Innovative', 'Transcendent'],
    spiritualGifts: ['Macrocosmic Vision', 'Quantum Intuition', 'Structural Synthesis', 'Spiritual Clarity'],
    cosmicQuote: {
      text: 'As above, so below, as within, so without, as the universe, so the soul.',
      author: 'Hermes Trismegistus',
    },
    colorTheme: {
      primary: '#EC4899', // Pink / Magenta
      secondary: '#F472B6',
      glow: 'rgba(236, 72, 153, 0.4)',
      gradient: 'from-pink-500 via-purple-600 to-indigo-600',
      badgeBg: 'bg-pink-950/80 text-pink-200 border-pink-500/40',
      border: 'border-pink-500/30',
    },
  },

  'astral-anchor': {
    id: 'astral-anchor',
    title: 'Astral Anchor',
    subtitle: 'The Stardust Guardian & Earth-Cosmos Bridge',
    element: 'Earth',
    rulingFrequency: 396,
    frequencyName: '396 Hz Root Grounding & Fear Dissolution',
    patronCelestialBody: 'Trappist-1e (Habitable World)',
    patronImageType: 'trappist',
    tagline: 'Rooted deeply in the living Earth while conscious of the stardust from which our bones are forged.',
    description:
      'You possess the rare ability to hold vast cosmic awareness while remaining grounded, practical, and present. You know that spiritual growth is not about escaping to other worlds, but about embodying cosmic stardust right here in physical life with kindness, stability, and quiet strength.',
    traits: ['Grounded', 'Resilient', 'Dependable', 'Centered', 'Present'],
    spiritualGifts: ['Grounding Sanctuary', 'Physical-Spiritual Balance', 'Stress Dissolution', 'Timeless Presence'],
    cosmicQuote: {
      text: 'To be grounded is to be in harmony with the cosmos; the roots reach down so the branches may touch the stars.',
      author: 'Ancient Wisdom',
    },
    colorTheme: {
      primary: '#10B981', // Emerald Green
      secondary: '#34D399',
      glow: 'rgba(16, 185, 129, 0.4)',
      gradient: 'from-emerald-500 via-teal-600 to-sky-700',
      badgeBg: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40',
      border: 'border-emerald-500/30',
    },
  },
};
