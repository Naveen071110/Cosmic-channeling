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
  },
  {
    id: "stoicism",
    name: "Stoicism",
    slug: "stoicism",
    origin: "Ancient Greece",
    foundedPeriod: "3rd century BCE",
    description: "A philosophical school emphasizing virtue, wisdom, and acceptance of fate. Stoics believed in living according to nature and developing emotional resilience through rational thinking.",
    coreBeliefs: [
      "Virtue is the only true good",
      "Accept what you cannot control",
      "Live according to nature and reason",
      "Practice emotional resilience",
      "Focus on personal character development"
    ],
    keyFigures: ["Zeno of Citium", "Marcus Aurelius", "Epictetus", "Seneca"],
    sacredTexts: ["Meditations", "Enchiridion", "Letters from a Stoic", "Discourses"],
    modernRelevance: "Stoic principles provide practical frameworks for managing stress, making decisions, and maintaining emotional balance in our complex modern world. Many therapeutic approaches draw from Stoic wisdom.",
    colorTheme: "#8B5CF6",
    featured: true,
    quotes: [
      {
        id: "stoic1",
        text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
        author: "Marcus Aurelius",
        tradition: "Stoicism"
      },
      {
        id: "stoic2",
        text: "It's not what happens to you, but how you react to it that matters.",
        author: "Epictetus",
        tradition: "Stoicism"
      },
      {
        id: "stoic3",
        text: "Every new beginning comes from some other beginning's end.",
        author: "Seneca",
        tradition: "Stoicism"
      }
    ]
  },
  {
    id: "norse",
    name: "Norse Mythology",
    slug: "norse",
    origin: "Scandinavia",
    foundedPeriod: "8th-11th century CE",
    description: "The ancient spiritual and mythological beliefs of the Norse peoples, emphasizing honor, courage, and the cyclical nature of existence through concepts like Ragnarok and rebirth.",
    coreBeliefs: [
      "Honor and courage in all endeavors",
      "The Nine Realms cosmology",
      "Fate (Wyrd) and personal responsibility",
      "Ancestor veneration",
      "Cyclical time and renewal"
    ],
    keyFigures: ["Odin", "Thor", "Freyja", "Loki", "Snorri Sturluson"],
    sacredTexts: ["Poetic Edda", "Prose Edda", "Hávamál", "Völuspá"],
    modernRelevance: "Norse wisdom offers insights into resilience, personal honor, and finding meaning in struggle. Its emphasis on facing challenges with courage resonates with modern self-development.",
    colorTheme: "#0EA5E9",
    featured: false,
    quotes: [
      {
        id: "norse1",
        text: "Cattle die, kinsmen die, you yourself will also die, but the reputation never dies of one who has earned a good name.",
        author: "Hávamál",
        tradition: "Norse Mythology"
      },
      {
        id: "norse2",
        text: "Fear not death, for the hour of your doom is set and none may escape it.",
        author: "Völsunga Saga",
        tradition: "Norse Mythology"
      }
    ]
  },
  {
    id: "celtic",
    name: "Celtic Spirituality",
    slug: "celtic",
    origin: "Celtic Europe",
    foundedPeriod: "6th century BCE - 4th century CE",
    description: "Ancient Celtic spiritual traditions emphasizing the interconnectedness of all life, reverence for nature, and the thin veil between the physical and spiritual worlds.",
    coreBeliefs: [
      "Sacred connection to nature",
      "Otherworld and spiritual realms",
      "Seasonal cycles and festivals",
      "Ancestor wisdom and guidance",
      "Sacred groves and natural sites"
    ],
    keyFigures: ["Druids", "Brigid", "Lugh", "Cernunnos", "The Morrigan"],
    sacredTexts: ["Mabinogion", "Book of Invasions", "Irish Mythology", "Welsh Mythology"],
    modernRelevance: "Celtic spirituality offers deep ecological wisdom and practices for connecting with natural cycles. Its emphasis on the sacred in everyday life appeals to modern seekers of earth-based spirituality.",
    colorTheme: "#10B981",
    featured: false,
    quotes: [
      {
        id: "celtic1",
        text: "The whole world is but a point of light between the darkness and the darkness.",
        author: "Celtic Proverb",
        tradition: "Celtic Spirituality"
      },
      {
        id: "celtic2",
        text: "Three things that are never silent: the wave of the sea, the fire of the hearth, and the voice of the poet.",
        author: "Celtic Triad",
        tradition: "Celtic Spirituality"
      }
    ]
  },
  {
    id: "roman",
    name: "Roman Religion",
    slug: "roman",
    origin: "Ancient Rome",
    foundedPeriod: "8th century BCE - 4th century CE",
    description: "The traditional religious practices of ancient Rome, emphasizing civic duty, proper ritual observance, and maintaining good relations with the gods for the prosperity of the state.",
    coreBeliefs: [
      "Pietas (duty to gods, family, and state)",
      "Proper ritual observance",
      "Divine favor for the state",
      "Ancestor veneration",
      "Practical reciprocity with deities"
    ],
    keyFigures: ["Jupiter", "Mars", "Vesta", "Cicero", "Virgil"],
    sacredTexts: ["Aeneid", "Fasti", "De Natura Deorum", "Annales"],
    modernRelevance: "Roman religious concepts of civic duty, personal discipline, and community responsibility offer insights for modern citizenship and social engagement.",
    colorTheme: "#DC2626",
    featured: false,
    quotes: [
      {
        id: "roman1",
        text: "The fates guide those who will; those who won't, they drag.",
        author: "Seneca",
        tradition: "Roman Religion"
      },
      {
        id: "roman2",
        text: "Fortune favors the bold.",
        author: "Virgil",
        tradition: "Roman Religion"
      }
    ]
  },
  {
    id: "greek",
    name: "Greek Philosophy & Religion",
    slug: "greek",
    origin: "Ancient Greece",
    foundedPeriod: "8th century BCE - 6th century CE",
    description: "The philosophical and religious traditions of ancient Greece, combining mythological understanding with rational inquiry into the nature of existence, ethics, and the good life.",
    coreBeliefs: [
      "Pursuit of wisdom (sophia)",
      "Harmony and balance in life",
      "Excellence (arete) in character",
      "The examined life",
      "Cosmic order and natural law"
    ],
    keyFigures: ["Socrates", "Plato", "Aristotle", "Pythagoras", "Heraclitus"],
    sacredTexts: ["Republic", "Nicomachean Ethics", "Metaphysics", "Theogony"],
    modernRelevance: "Greek philosophical traditions form the foundation of Western thought, offering timeless wisdom about ethics, political life, and the pursuit of truth that remains relevant today.",
    colorTheme: "#F59E0B",
    featured: false,
    quotes: [
      {
        id: "greek1",
        text: "The unexamined life is not worth living.",
        author: "Socrates",
        tradition: "Greek Philosophy"
      },
      {
        id: "greek2",
        text: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle",
        tradition: "Greek Philosophy"
      },
      {
        id: "greek3",
        text: "No man ever steps in the same river twice.",
        author: "Heraclitus",
        tradition: "Greek Philosophy"
      }
    ]
  },
  {
    id: "mystery",
    name: "Mystery Religions",
    slug: "mystery",
    origin: "Ancient Mediterranean",
    foundedPeriod: "7th century BCE - 4th century CE",
    description: "Ancient spiritual traditions offering secret initiation rites and esoteric knowledge, promising spiritual transformation and divine communion to their adherents.",
    coreBeliefs: [
      "Spiritual initiation and transformation",
      "Sacred mysteries and secret knowledge",
      "Death and rebirth symbolism",
      "Divine communion",
      "Personal salvation and enlightenment"
    ],
    keyFigures: ["Orpheus", "Dionysus", "Demeter", "Persephone", "Mithras"],
    sacredTexts: ["Orphic Hymns", "Dionysian Mysteries", "Eleusinian Mysteries", "Mithraic Liturgy"],
    modernRelevance: "Mystery traditions offer insights into spiritual transformation, the power of symbolic thinking, and the importance of community in spiritual practice, influencing modern esoteric and psychological approaches.",
    colorTheme: "#7C3AED",
    featured: false,
    quotes: [
      {
        id: "mystery1",
        text: "Death is not the opposite of life, but a part of it.",
        author: "Orphic Tradition",
        tradition: "Mystery Religions"
      },
      {
        id: "mystery2",
        text: "The soul that has seen truth will be protected from harm until the next cycle.",
        author: "Eleusinian Mysteries",
        tradition: "Mystery Religions"
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