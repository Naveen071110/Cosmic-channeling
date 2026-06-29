# Cosmic Channeling — Setup Guide

> How to run the website locally and deploy to Cloudflare

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Steps
```bash
# Navigate to project directory
cd "C:\Users\singh\OneDrive\Documents\Claude Brain\Brain\Projects\Cosmic Channeling\Website"

# Install dependencies
npm install

# Run dev server (no database needed — uses in-memory storage)
npm run dev

# Open in browser
# http://127.0.0.1:3000
```

### What Works Locally (No DB Required)
- ✅ All static content (quotes, celestial objects, cosmic patterns)
- ✅ Daily Quotes
- ✅ Universe Explorer
- ✅ Dream Interpreter
- ✅ Cosmic Signals
- ✅ Spiritual Quiz
- ✅ Meditation Timer + Sounds
- ✅ Astro-Journal
- ✅ Music page
- ✅ Religions section
- ✅ Newsletter signup (saves to local JSON file)
- ✅ User registration & login (in-memory)
- ❌ PayPal payments (requires sandbox credentials)
- ❌ Google OAuth (requires credentials)
- ❌ Medium blog feed (requires internet, falls back gracefully)
- ❌ NASA/Space.com RSS feeds (requires internet, falls back gracefully)

## Deployment to Cloudflare

### Prerequisites
1. Cloudflare account
2. `wrangler` CLI installed (`npm install -g wrangler`)

### Build
```bash
# Build the client
npm run build
# Output: dist/public/ (static assets)
# Output: dist/index.js (server bundle)
```

### Deployment Options

#### Option 1: Static Site (Recommended for now)
The frontend builds to static HTML/CSS/JS. Deploy to Cloudflare Pages:
```bash
npx wrangler pages deploy dist/public --project-name cosmic-channeling
```

#### Option 2: Full Stack (Pages + Functions)
For API routes, convert Express routes to Cloudflare Pages Functions:
1. Create `functions/` directory at project root
2. Port API endpoints to Workers/Functions format
3. Deploy with `wrangler pages deploy`

#### Option 3: Cloudflare Workers (Full Backend)
Port the Express server to run on Cloudflare Workers using `cloudflare-adapter`:
```bash
npm install @cloudflare/workers-types
```

### Environment Variables (Production)
- `SESSION_SECRET` — Session encryption key
- `PAYPAL_CLIENT_ID` — PayPal client ID (if using payments)
- `PAYPAL_SECRET_KEY` — PayPal secret (if using payments)
- `MEDIUM_USERNAME` — Medium username for blog feed

## Notes
- The app uses **MemStorage** by default for local dev (no PostgreSQL needed)
- To use PostgreSQL in production, set `DATABASE_URL` env var
- See [[Projects/Cosmic Channeling/Website/README|README]] for full directory structure
