# Cosmic Channeling — Website

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Express.js REST API
- **Storage:** In-memory (local) / PostgreSQL (production via Neon)
- **Auth:** Passport.js (local username/password + Google OAuth)

## Quick Start
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# http://127.0.0.1:3000
```

## Directory Structure
```
Website/
├── client/
│   ├── index.html           # HTML entry point
│   └── src/
│       ├── App.tsx           # React root with routing
│       ├── main.tsx          # Entry point + global styles
│       ├── index.css         # Tailwind CSS + cosmic theme
│       ├── types/index.ts    # TypeScript type definitions
│       ├── lib/
│       │   ├── data.ts       # Static content data
│       │   ├── queryClient.ts # TanStack Query setup
│       │   ├── firebase.ts   # Firebase config
│       │   └── utils.ts      # Utility functions
│       ├── pages/            # Route pages
│       ├── components/       # React components
│       │   ├── layout/       # Header, Footer
│       │   ├── home/         # Home page components
│       │   ├── features/     # Feature components
│       │   ├── ui/           # shadcn/ui components
│       │   └── ...
│       └── hooks/            # React hooks
├── server/
│   ├── index.ts              # Express server entry
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Storage interface (MemStorage / DatabaseStorage)
│   ├── auth.ts               # Passport auth setup
│   ├── db.ts                 # Database connection (optional fallback)
│   ├── cache.ts              # Simple in-memory cache
│   ├── paypal.ts             # PayPal integration
│   ├── routes/
│   │   ├── auth.ts           # Google auth routes
│   │   └── newsletter.ts     # Newsletter subscription
│   └── vite.ts               # Vite dev middleware
├── shared/
│   └── schema.ts             # Drizzle ORM schema + types
├── config/
│   └── environment.js        # Environment configuration
├── data/
│   └── subscribers.json      # Newsletter subscribers
├── attached_assets/          # Reference materials
│   └── ...                   # Screenshots, PRD, guides
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```
