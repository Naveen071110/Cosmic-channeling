import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { quotes, celestialObjects, cosmicPatterns } from "../client/src/lib/data";
import Parser from 'rss-parser';
import fetch from 'node-fetch';
import newsletterRoutes from './routes/newsletter';
import authRoutes from './routes/auth';
import { setupAuth } from './auth';
import { setupGoogleAuth } from './google-auth';
import { createOrder, captureOrder, getOrderDetails, createSubscription } from './paypal';

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  setupGoogleAuth(app);

  // prefix all routes with /api

  // Register newsletter and auth routes
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/auth', authRoutes);

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

  // User subscription update endpoint
  app.post('/api/users/:id/subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = parseInt(req.params.id);

    // Check if the user is trying to update their own subscription
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { isSubscribed } = req.body;

    if (typeof isSubscribed !== 'boolean') {
      return res.status(400).json({ message: 'Invalid subscription status' });
    }

    try {
      const updatedUser = await storage.updateUserSubscription(userId, isSubscribed);

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(updatedUser);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ message: 'Error updating subscription' });
    }
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

  // PayPal API endpoints
  app.post('/api/paypal/create-order', async (req, res) => {
    try {
      const { amount, description } = req.body;

      if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ message: 'Valid amount is required' });
      }

      const order = await createOrder(parseFloat(amount), description || 'Cosmic Channeling Purchase');
      res.json(order);
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      res.status(500).json({ message: 'Error creating PayPal order' });
    }
  });

  app.post('/api/paypal/capture-order', async (req, res) => {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({ message: 'Order ID is required' });
      }

      const captureData = await captureOrder(orderId);
      res.json(captureData);
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      res.status(500).json({ message: 'Error capturing PayPal order' });
    }
  });

  app.get('/api/paypal/order/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const orderDetails = await getOrderDetails(orderId);
      res.json(orderDetails);
    } catch (error) {
      console.error('Error getting PayPal order details:', error);
      res.status(500).json({ message: 'Error getting PayPal order details' });
    }
  });

  app.post('/api/paypal/create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const subscription = await createSubscription();
      res.json(subscription);
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      res.status(500).json({ message: 'Error creating PayPal subscription' });
    }
  });

  // Webhook for PayPal subscription events
  app.post('/api/paypal/webhook', async (req, res) => {
    // In a production app, this would validate the webhook signature
    // and process subscription events

    const { event_type, resource } = req.body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      // Handle successful payment
      try {
        if (req.isAuthenticated() && req.user) {
          // Update the user's subscription status
          await storage.updateUserSubscription(req.user.id, true);
        }
      } catch (error) {
        console.error('Error processing PayPal webhook:', error);
      }
    }

    // Acknowledge receipt of the event
    res.status(200).end();
  });

  // Space News API endpoint
  app.get('/api/space-news', async (req, res) => {
    try {
      const parser = new Parser();

      // NASA Breaking News RSS feed
      const nasaFeed = await parser.parseURL('https://www.nasa.gov/feed/');

      // Space.com RSS feed
      const spaceComFeed = await parser.parseURL('https://www.space.com/feeds/all');

      // Additional space facts
      const additionalSpaceFacts = [
        {
          title: "Jupiter's Great Red Spot",
          content: "Jupiter's Great Red Spot is a giant, spinning storm that has been observed for more than 350 years. The storm is so large that about three Earths could fit inside it.",
          url: "https://science.nasa.gov/jupiter/",
          type: "fact",
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA24237_800.jpg"
        },
        {
          title: "Saturn's Rings",
          content: "Saturn's magnificent rings are made up of billions of particles of ice and rock, ranging in size from tiny dust grains to objects as large as mountains.",
          url: "https://science.nasa.gov/saturn/",
          type: "fact",
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA03545-scaled.jpg"
        },
        {
          title: "Black Hole at the Center of the Milky Way",
          content: "At the center of our Milky Way galaxy lies a supermassive black hole named Sagittarius A*, which has a mass of about 4 million times that of our Sun.",
          url: "https://www.nasa.gov/image-article/our-black-hole/",
          type: "fact",
          image: "https://www.nasa.gov/wp-content/uploads/2023/03/blackhole-milkyway.jpg"
        },
        {
          title: "Voyager Missions",
          content: "NASA's Voyager 1 and 2 spacecraft are the only human-made objects to have entered interstellar space. Launched in 1977, they continue to send back data from beyond our solar system.",
          url: "https://voyager.jpl.nasa.gov/",
          type: "fact",
          image: "https://voyager.jpl.nasa.gov/assets/images/gallery/voyager-spacecraft.jpg"
        },
        {
          title: "Venus: Earth's Evil Twin",
          content: "Venus is often called Earth's 'evil twin' because while similar in size and composition to Earth, its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system with surface temperatures hot enough to melt lead.",
          url: "https://science.nasa.gov/venus/",
          type: "fact",
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA00271-Venus-Computer-Simulated-Global-View-of-the-Northern-Hemisphere-scaled.jpg"
        }
      ];

      // Process NASA feed items
      const nasaItems = nasaFeed.items.slice(0, 5).map(item => ({
        title: item.title,
        content: item.contentSnippet || item.content,
        pubDate: item.pubDate,
        url: item.link,
        type: "news",
        source: "NASA",
        image: item.enclosure?.url || "https://www.nasa.gov/wp-content/uploads/2023/03/nasa-logo-web-rgb.png"
      }));

      // Process Space.com feed items
      const spaceComItems = spaceComFeed.items.slice(0, 5).map(item => ({
        title: item.title,
        content: item.contentSnippet || item.content,
        pubDate: item.pubDate,
        url: item.link,
        type: "news",
        source: "Space.com",
        image: item.enclosure?.url || "https://cdn.mos.cms.futurecdn.net/6Ud2GEwbAa3UV4UWLKYR8K-970-80.jpg"
      }));

      // Combine all items and shuffle
      const allItems = [...nasaItems, ...spaceComItems, ...additionalSpaceFacts];
      const shuffled = allItems.sort(() => 0.5 - Math.random());

      res.json(shuffled);
    } catch (error) {
      console.error('Error fetching space news:', error);
      res.status(500).json({ 
        message: 'Error fetching space news', 
        fallbackData: true,
        data: [
          {
            title: "Jupiter's Great Red Spot",
            content: "Jupiter's Great Red Spot is a giant, spinning storm that has been observed for more than 350 years. The storm is so large that about three Earths could fit inside it.",
            type: "fact",
            url: "https://science.nasa.gov/jupiter/",
            image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA24237_800.jpg"
          },
          {
            title: "Saturn's Rings",
            content: "Saturn's magnificent rings are made up of billions of particles of ice and rock, ranging in size from tiny dust grains to objects as large as mountains.",
            type: "fact",
            url: "https://science.nasa.gov/saturn/",
            image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA03545-scaled.jpg"
          },
          {
            title: "Black Hole at the Center of the Milky Way",
            content: "At the center of our Milky Way galaxy lies a supermassive black hole named Sagittarius A*, which has a mass of about 4 million times that of our Sun.",
            type: "fact",
            url: "https://www.nasa.gov/image-article/our-black-hole/",
            image: "https://www.nasa.gov/wp-content/uploads/2023/03/blackhole-milkyway.jpg"
          },
          {
            title: "Voyager Missions",
            content: "NASA's Voyager 1 and 2 spacecraft are the only human-made objects to have entered interstellar space. Launched in 1977, they continue to send back data from beyond our solar system.",
            type: "fact",
            url: "https://voyager.jpl.nasa.gov/",
            image: "https://voyager.jpl.nasa.gov/assets/images/gallery/voyager-spacecraft.jpg"
          },
          {
            title: "Venus: Earth's Evil Twin",
            content: "Venus is often called Earth's 'evil twin' because while similar in size and composition to Earth, its thick atmosphere traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system with surface temperatures hot enough to melt lead.",
            type: "fact",
            url: "https://science.nasa.gov/venus/",
            image: "https://science.nasa.gov/wp-content/uploads/2023/09/PIA00271-Venus-Computer-Simulated-Global-View-of-the-Northern-Hemisphere-scaled.jpg"
          }
        ]
      });
    }
  });

  // Medium RSS feed endpoint to fetch blog posts
  app.get("/api/medium-posts", async (req, res) => {
    try {
      // Medium username - configured for Cosmic Channeling
      const mediumUsername = process.env.MEDIUM_USERNAME || 'cosmicchanneling';

      // Fetch posts from Medium RSS feed
      const parser = new Parser({
        customFields: {
          item: ['creator', 'pubDate', 'guid', 'description']
        }
      });

      const feed = await parser.parseURL(`https://medium.com/feed/@${mediumUsername}`);

      const posts = feed.items.map((item, index) => {
        // Try multiple sources for content
        const content = item.contentSnippet || item.content || item.description || item.summary || '';

        // Clean HTML and get plain text
        const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

        // Create a meaningful excerpt
        let excerpt = '';
        if (plainText.length > 0) {
          // Take first sentence or first 200 characters
          const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 20);
          if (sentences.length > 0) {
            excerpt = sentences[0].trim() + '...';
          } else {
            excerpt = plainText.substring(0, 200) + '...';
          }
        } else {
          // Fallback excerpt based on title
          excerpt = `Explore insights about ${item.title?.toLowerCase()} and discover cosmic wisdom in this thought-provoking article.`;
        }

        return {
          id: item.guid || `post-${index}`,
          title: item.title || 'Untitled',
          content: plainText,
          excerpt: excerpt,
          url: item.link || '',
          publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
          author: {
            id: mediumUsername,
            username: mediumUsername,
            name: item.creator || mediumUsername,
            url: `https://medium.com/@${mediumUsername}`
          },
          tags: item.categories || []
        };
      });

      res.json({
        posts,
        total: posts.length,
        source: 'Medium RSS'
      });

    } catch (error) {
      console.error('Medium RSS error:', error);
      res.status(500).json({ 
        error: "Failed to fetch Medium posts",
        message: "Unable to fetch posts from Medium RSS feed. Please check if the username is correct.",
        posts: []
      });
    }
  });

  // Traditions API endpoints for the Religions Discussion section
  app.get('/api/traditions', async (req, res) => {
    try {
      const traditions = await storage.getAllTraditions();
      res.json(traditions);
    } catch (error) {
      console.error('Error fetching traditions:', error);
      res.status(500).json({ error: 'Failed to fetch traditions' });
    }
  });

  app.get('/api/traditions/featured', async (req, res) => {
    try {
      const traditions = await storage.getFeaturedTraditions();
      res.json(traditions);
    } catch (error) {
      console.error('Error fetching featured traditions:', error);
      res.status(500).json({ error: 'Failed to fetch featured traditions' });
    }
  });

  app.get('/api/traditions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tradition = await storage.getTradition(id);

      if (!tradition) {
        return res.status(404).json({ error: 'Tradition not found' });
      }

      res.json(tradition);
    } catch (error) {
      console.error('Error fetching tradition:', error);
      res.status(500).json({ error: 'Failed to fetch tradition' });
    }
  });

  app.get('/api/traditions/slug/:slug', async (req, res) => {
    try {
      const tradition = await storage.getTraditionBySlug(req.params.slug);

      if (!tradition) {
        return res.status(404).json({ error: 'Tradition not found' });
      }

      res.json(tradition);
    } catch (error) {
      console.error('Error fetching tradition by slug:', error);
      res.status(500).json({ error: 'Failed to fetch tradition' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}