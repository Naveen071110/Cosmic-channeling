import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quotes, celestialObjects, cosmicPatterns } from "../client/src/lib/data";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Quote API endpoints
  app.get('/api/quotes', (req, res) => {
    res.json(quotes);
  });

  app.get('/api/quotes/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json(quotes[randomIndex]);
  });

  // Celestial objects API endpoints
  app.get('/api/celestial', (req, res) => {
    res.json(celestialObjects);
  });

  app.get('/api/celestial/:id', (req, res) => {
    const { id } = req.params;
    const object = celestialObjects.find(obj => obj.id === id);
    
    if (!object) {
      return res.status(404).json({ message: 'Celestial object not found' });
    }
    
    res.json(object);
  });

  // Cosmic patterns API endpoints
  app.get('/api/cosmic-patterns', (req, res) => {
    res.json(cosmicPatterns);
  });

  app.get('/api/cosmic-patterns/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * cosmicPatterns.length);
    res.json(cosmicPatterns[randomIndex]);
  });

  // Dream interpretation endpoint
  app.post('/api/interpret-dream', (req, res) => {
    const { dreamText } = req.body;
    
    if (!dreamText || dreamText.trim() === '') {
      return res.status(400).json({ message: 'Dream text is required' });
    }
    
    // Simple keyword-based interpretation
    const dreamLower = dreamText.toLowerCase();
    const cosmicKeywords = [
      { word: 'star', tag: 'Cosmic Connection' },
      { word: 'space', tag: 'Cosmic Connection' },
      { word: 'galaxy', tag: 'Cosmic Connection' },
      { word: 'universe', tag: 'Cosmic Connection' },
      { word: 'planet', tag: 'Cosmic Connection' },
      { word: 'float', tag: 'Spiritual Growth' },
      { word: 'fly', tag: 'Spiritual Growth' },
      { word: 'light', tag: 'Awakening' },
      { word: 'dark', tag: 'Shadow Work' },
      { word: 'cosmic', tag: 'Cosmic Connection' },
      { word: 'energy', tag: 'Energy Work' },
      { word: 'consciousness', tag: 'Expansion' },
      { word: 'expand', tag: 'Expansion' },
      { word: 'vast', tag: 'Expansion' },
      { word: 'connect', tag: 'Connection' }
    ];
    
    let tags: string[] = [];
    let interpretation = '';
    
    // Find matching keywords
    cosmicKeywords.forEach(({ word, tag }) => {
      if (dreamLower.includes(word) && !tags.includes(tag)) {
        tags.push(tag);
      }
    });
    
    // Default tags if none found
    if (tags.length === 0) {
      tags = ['Self-Discovery', 'Inner Journey'];
    }
    
    // Generate interpretation based on found tags
    if (tags.includes('Cosmic Connection')) {
      interpretation += 'Your dream suggests a deep connection to the cosmos. The celestial symbols represent your expanding consciousness and spiritual growth. ';
    }
    
    if (tags.includes('Spiritual Growth')) {
      interpretation += 'The sensation of floating or flying indicates your spirit\'s natural tendency to transcend physical limitations. You may be going through a period of spiritual evolution. ';
    }
    
    if (tags.includes('Expansion')) {
      interpretation += 'Your consciousness is expanding beyond conventional boundaries. This dream reflects your readiness to embrace a more expansive understanding of reality. ';
    }
    
    if (tags.includes('Shadow Work')) {
      interpretation += 'The darkness in your dream may represent unexplored aspects of your psyche that contain valuable cosmic wisdom when integrated. ';
    }
    
    if (tags.includes('Energy Work')) {
      interpretation += 'You\'re becoming more aware of the subtle energies that connect all beings in the universe. This dream is encouraging you to develop your sensitivity to these cosmic energies. ';
    }
    
    if (tags.includes('Connection')) {
      interpretation += 'Your dream reflects a deep yearning for meaningful connection—not just with other humans, but with the entire cosmic web of existence. ';
    }
    
    if (tags.includes('Awakening')) {
      interpretation += 'The presence of light symbolizes an awakening of higher consciousness and spiritual insight. You\'re beginning to see reality from a more enlightened perspective. ';
    }
    
    // Default interpretation if nothing specific was generated
    if (interpretation === '') {
      interpretation = 'Your dream contains cosmic symbolism that suggests you\'re undergoing a period of spiritual expansion and growth. Pay attention to intuitive insights that arise during this time.';
    }
    
    return res.json({
      interpretation,
      tags: tags.slice(0, 3) // Limit to 3 tags for display purposes
    });
  });

  // Quiz results endpoint
  app.post('/api/quiz-results', (req, res) => {
    const { answers } = req.body;
    
    if (!answers) {
      return res.status(400).json({ message: 'Quiz answers are required' });
    }
    
    // Simple mapping of archetypes based on majority answer patterns
    // In a real implementation, this would be more sophisticated
    const archetypes = [
      {
        title: "Stellar Seeker",
        description: "You are drawn to the mysteries of the cosmos and seek spiritual growth through cosmic connection. Your intuitive nature helps you perceive patterns others miss.",
        archetype: "Seeker"
      },
      {
        title: "Quantum Explorer",
        description: "You blend scientific curiosity with spiritual openness. You\'re fascinated by the quantum nature of reality and how consciousness interacts with the physical world.",
        archetype: "Explorer"
      },
      {
        title: "Cosmic Sage",
        description: "Your wisdom comes from understanding the interconnectedness of all things. You see the universe as a living entity and yourself as an integral part of it.",
        archetype: "Sage"
      },
      {
        title: "Astral Voyager",
        description: "You\'re a natural traveler of the mind and spirit. Your imagination allows you to journey beyond physical limitations and explore the frontiers of consciousness.",
        archetype: "Voyager"
      },
      {
        title: "Star Weaver",
        description: "You see the threads that connect all beings and events. You have a gift for finding meaning in cosmic coincidences and weaving them into your life story.",
        archetype: "Weaver"
      }
    ];
    
    // For simplicity, assign a result based on question 5 (what they seek most)
    let archetypeIndex = 0;
    
    const finalQuestion = Object.keys(answers).find(key => parseInt(key) === 5);
    if (finalQuestion) {
      const answer = answers[finalQuestion];
      
      if (answer.toLowerCase().includes('spiritual')) {
        archetypeIndex = 0; // Seeker
      } else if (answer.toLowerCase().includes('scientific')) {
        archetypeIndex = 1; // Explorer
      } else if (answer.toLowerCase().includes('wonder')) {
        archetypeIndex = 3; // Voyager
      } else if (answer.toLowerCase().includes('connection')) {
        archetypeIndex = 4; // Weaver
      } else {
        archetypeIndex = 2; // Sage (default)
      }
    }
    
    return res.json(archetypes[archetypeIndex]);
  });

  const httpServer = createServer(app);

  return httpServer;
}
