import { OAuth2Client } from 'google-auth-library';
import { Express, Request, Response } from 'express';
import { storage } from './storage';
import 'express-session';

// Extend express-session declarations to include our custom properties
declare module 'express-session' {
  interface SessionData {
    googleOauthState?: string;
  }
}

// Initialize the Google OAuth client
const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

export function setupGoogleAuth(app: Express) {
  // Google OAuth login route
  app.get('/api/auth/google', (req, res) => {
    const state = Math.random().toString(36).substring(2);
    req.session.googleOauthState = state;
    
    const authUrl = client.generateAuthUrl({
      access_type: 'online',
      scope: ['profile', 'email'],
      state: state,
      prompt: 'select_account'
    });
    
    res.redirect(authUrl);
  });
  
  // Google OAuth callback route
  app.get('/api/auth/google/callback', async (req, res) => {
    const { code, state } = req.query;
    const sessionState = req.session.googleOauthState;
    
    if (state !== sessionState) {
      return res.status(400).send('Invalid state parameter');
    }
    
    try {
      const { tokens } = await client.getToken(code as string);
      client.setCredentials(tokens);
      
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        return res.status(400).send('Invalid user data');
      }
      
      // Check if user exists
      let user = await storage.getUserByEmail(payload.email);
      
      // Create user if it doesn't exist
      if (!user) {
        user = await storage.createUser({
          username: payload.name || payload.email.split('@')[0],
          email: payload.email,
          password: Math.random().toString(36).substring(2) + Date.now().toString(),
          isSubscribed: false,
          stripeCustomerId: null,
          stripeSubscriptionId: null
        });
      }
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).send('Error logging in');
        }
        
        // Redirect to home page after successful login
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error during Google authentication:', error);
      res.status(500).send('Authentication failed');
    }
  });
}