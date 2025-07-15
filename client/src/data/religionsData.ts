export interface ReligiousQuote {
  id: string;
  text: string;
  author: string;
  tradition: string;
  source?: string;
}

export interface SpiritualTradition {
  id: string;
  name: string;
  slug: string;
  origin: string;
  foundedPeriod: string;
  description: string;
  coreBeliefs: string[];
  keyFigures: string[];
  sacredTexts: string[];
  modernRelevance: string;
  colorTheme: string;
  featured: boolean;
  quotes: ReligiousQuote[];
}

export const spiritualTraditions: SpiritualTradition[] = [
  {
    id: "buddhism",
    name: "Buddhism",
    slug: "buddhism",
    origin: "India",
    foundedPeriod: "6th-4th century BCE",
    description: "A spiritual tradition focused on personal spiritual development and the attainment of deep insight into the true nature of life and existence.",
    coreBeliefs: [
      "The Four Noble Truths",
      "The Eightfold Path",
      "Karma and Rebirth", 
      "The Three Jewels (Buddha, Dharma, Sangha)",
      "Impermanence and Non-self"
    ],
    keyFigures: ["Siddhartha Gautama (Buddha)", "Nagarjuna", "Dalai Lama", "Thich Nhat Hanh"],
    sacredTexts: ["Tripitaka", "Lotus Sutra", "Heart Sutra", "Diamond Sutra"],
    modernRelevance: "Mindfulness meditation, compassion practices, and Buddhist philosophy offer practical tools for managing stress, finding inner peace, and cultivating wisdom in our fast-paced modern world.",
    colorTheme: "#FF9500",
    featured: true,
    quotes: [
      {
        id: "buddha1",
        text: "The mind is everything. What you think you become.",
        author: "Buddha",
        tradition: "Buddhism"
      },
      {
        id: "buddha2", 
        text: "Peace comes from within. Do not seek it without.",
        author: "Buddha",
        tradition: "Buddhism"
      },
      {
        id: "buddha3",
        text: "In the end, just three things matter: How well we have lived, how well we have loved, how well we have learned to let go.",
        author: "Buddha",
        tradition: "Buddhism"
      }
    ]
  },
  {
    id: "hinduism",
    name: "Hinduism",
    slug: "hinduism", 
    origin: "India",
    foundedPeriod: "1500-500 BCE",
    description: "One of the world's oldest religious traditions, encompassing a variety of beliefs and practices centered around dharma, karma, and moksha.",
    coreBeliefs: [
      "Dharma (righteous living)",
      "Karma (law of cause and effect)", 
      "Samsara (cycle of rebirth)",
      "Moksha (liberation)",
      "Multiple paths to the divine"
    ],
    keyFigures: ["Krishna", "Rama", "Mahatma Gandhi", "Swami Vivekananda"],
    sacredTexts: ["Vedas", "Upanishads", "Bhagavad Gita", "Ramayana", "Mahabharata"],
    modernRelevance: "Yoga, meditation, and Ayurveda have become global practices for physical and spiritual wellness, while Hindu philosophy offers insights into consciousness and self-realization.",
    colorTheme: "#FF6B35",
    featured: true,
    quotes: [
      {
        id: "hindu1",
        text: "You are what your deep, driving desire is. As your desire is, so is your will. As your will is, so is your deed. As your deed is, so is your destiny.",
        author: "Upanishads",
        tradition: "Hinduism"
      },
      {
        id: "hindu2",
        text: "The mind acts like an enemy for those who do not control it.",
        author: "Bhagavad Gita",
        tradition: "Hinduism"
      }
    ]
  },
  {
    id: "taoism",
    name: "Taoism",
    slug: "taoism",
    origin: "China", 
    foundedPeriod: "6th century BCE",
    description: "A philosophical and religious tradition emphasizing living in harmony with the Tao, the source and pattern of the universe.",
    coreBeliefs: [
      "The Tao (the Way)",
      "Wu Wei (effortless action)",
      "Yin and Yang (complementary forces)",
      "Natural harmony and simplicity",
      "Immortality through spiritual cultivation"
    ],
    keyFigures: ["Laozi", "Zhuangzi", "Zhang Daoling"],
    sacredTexts: ["Tao Te Ching", "Zhuangzi", "I Ching"],
    modernRelevance: "Taoist principles of balance, mindfulness, and flowing with natural rhythms offer valuable guidance for stress management and finding equilibrium in modern life.",
    colorTheme: "#2ECC71",
    featured: false,
    quotes: [
      {
        id: "tao1",
        text: "The journey of a thousand miles begins with one step.",
        author: "Laozi",
        tradition: "Taoism"
      },
      {
        id: "tao2",
        text: "When I let go of what I am, I become what I might be.",
        author: "Laozi", 
        tradition: "Taoism"
      },
      {
        id: "tao3",
        text: "Nature does not hurry, yet everything is accomplished.",
        author: "Laozi",
        tradition: "Taoism"
      }
    ]
  },
  {
    id: "sufism",
    name: "Sufism",
    slug: "sufism",
    origin: "Middle East",
    foundedPeriod: "8th century CE",
    description: "The mystical dimension of Islam focused on inner purification, divine love, and direct experience of the divine through spiritual practices.",
    coreBeliefs: [
      "Divine love and unity",
      "Inner purification (tazkiyah)",
      "Spiritual remembrance (dhikr)",
      "The Perfect Human (al-Insan al-Kamil)",
      "Multiple stages of spiritual development"
    ],
    keyFigures: ["Rumi", "Ibn Arabi", "Al-Ghazali", "Hafez"],
    sacredTexts: ["Quran", "Poetry of Rumi", "Fusus al-Hikam", "Revival of Religious Sciences"],
    modernRelevance: "Sufi poetry, music, and meditation practices provide pathways to spiritual experience and emotional healing, while emphasizing universal love and tolerance.",
    colorTheme: "#9B59B6",
    featured: true,
    quotes: [
      {
        id: "sufi1",
        text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
        author: "Rumi",
        tradition: "Sufism"
      },
      {
        id: "sufi2",
        text: "The wound is the place where the Light enters you.",
        author: "Rumi",
        tradition: "Sufism"
      },
      {
        id: "sufi3",
        text: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.",
        author: "Rumi", 
        tradition: "Sufism"
      }
    ]
  },
  {
    id: "christianity",
    name: "Christianity",
    slug: "christianity",
    origin: "Palestine",
    foundedPeriod: "1st century CE",
    description: "A monotheistic religion based on the life and teachings of Jesus Christ, emphasizing love, forgiveness, and salvation through faith.",
    coreBeliefs: [
      "Trinity (Father, Son, Holy Spirit)",
      "Salvation through Jesus Christ",
      "Love of God and neighbor",
      "Forgiveness and redemption",
      "Eternal life"
    ],
    keyFigures: ["Jesus Christ", "Paul the Apostle", "Augustine", "Thomas Aquinas"],
    sacredTexts: ["Bible (Old and New Testament)", "Gospels", "Epistles"],
    modernRelevance: "Christian values of compassion, service to others, and social justice continue to inspire humanitarian work and personal transformation worldwide.",
    colorTheme: "#3498DB",
    featured: false,
    quotes: [
      {
        id: "christian1",
        text: "Be still and know that I am God.",
        author: "Psalm 46:10",
        tradition: "Christianity"
      },
      {
        id: "christian2",
        text: "Love your neighbor as yourself.",
        author: "Jesus Christ",
        tradition: "Christianity"
      }
    ]
  },
  {
    id: "indigenous",
    name: "Indigenous Spirituality",
    slug: "indigenous-spirituality",
    origin: "Worldwide",
    foundedPeriod: "Ancient traditions",
    description: "Diverse spiritual traditions of indigenous peoples worldwide, emphasizing connection to nature, ancestors, and community harmony.",
    coreBeliefs: [
      "Sacred relationship with nature",
      "Ancestor reverence",
      "Community harmony",
      "Shamanic healing practices",
      "Oral tradition and storytelling"
    ],
    keyFigures: ["Various tribal elders and shamans", "Medicine people", "Storytellers"],
    sacredTexts: ["Oral traditions", "Creation stories", "Ceremonial songs"],
    modernRelevance: "Indigenous wisdom about environmental stewardship, community healing, and holistic living offers crucial insights for addressing modern ecological and social challenges.",
    colorTheme: "#E67E22",
    featured: false,
    quotes: [
      {
        id: "indigenous1",
        text: "We do not inherit the earth from our ancestors; we borrow it from our children.",
        author: "Native American Proverb",
        tradition: "Indigenous Spirituality"
      },
      {
        id: "indigenous2",
        text: "The land knows you, even when you are lost.",
        author: "Robin Wall Kimmerer",
        tradition: "Indigenous Spirituality"
      }
    ]
  }
];

export const getAllTraditions = () => spiritualTraditions;

export const getFeaturedTraditions = () => spiritualTraditions.filter(t => t.featured);

export const getTraditionBySlug = (slug: string) => spiritualTraditions.find(t => t.slug === slug);

export const getAllQuotes = (): ReligiousQuote[] => {
  return spiritualTraditions.flatMap(tradition => tradition.quotes);
};

export const getRandomQuote = (): ReligiousQuote => {
  const allQuotes = getAllQuotes();
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
};

export const getQuotesByTradition = (tradition: string): ReligiousQuote[] => {
  return getAllQuotes().filter(quote => quote.tradition === tradition);
};