import { Router } from 'express';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Create a schema for email validation
const subscribeSchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBSCRIBERS_FILE = path.join(__dirname, '../../data/subscribers.json');

// Ensure the data directory exists
const ensureDataDirExists = () => {
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify({ subscribers: [] }));
  }
};

// Get all subscribers
const getSubscribers = (): { subscribers: string[] } => {
  ensureDataDirExists();
  
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { subscribers: [] };
  }
};

// Save subscribers to file
const saveSubscribers = (data: { subscribers: string[] }) => {
  ensureDataDirExists();
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2));
};

// Subscribe endpoint
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);
    
    const data = getSubscribers();
    
    // Check if email already exists
    if (data.subscribers.includes(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already subscribed.' 
      });
    }
    
    // Add new subscriber
    data.subscribers.push(email);
    saveSubscribers(data);
    
    // In a real application, you would send a welcome email here using something like SendGrid
    // if (process.env.SENDGRID_API_KEY) {
    //   // Send welcome email
    // }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to the newsletter!' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: error.errors[0].message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while subscribing. Please try again.' 
    });
  }
});

// Unsubscribe endpoint (for future use)
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = subscribeSchema.parse(req.body);
    
    const data = getSubscribers();
    
    // Remove email from subscribers
    data.subscribers = data.subscribers.filter(e => e !== email);
    saveSubscribers(data);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully unsubscribed from the newsletter.' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: error.errors[0].message 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while unsubscribing. Please try again.' 
    });
  }
});

// Get subscribers count (for admin use)
router.get('/count', async (req, res) => {
  try {
    const data = getSubscribers();
    return res.status(200).json({ 
      success: true, 
      count: data.subscribers.length 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching subscriber count.' 
    });
  }
});

export default router;