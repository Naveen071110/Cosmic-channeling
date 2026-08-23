# 🌌 Cosmic Channeling

[![Live App](https://img.shields.io/badge/Live%20Demo-cosmic--channeling.vercel.app-7E22CE?style=for-the-badge&logo=vercel)](https://cosmic-channeling.vercel.app)
[![Cloudflare Workers](https://img.shields.io/badge/Backend-Cloudflare%20Edge%20API-F38020?style=for-the-badge&logo=cloudflare)](https://cosmic-channeling.singhnaveen360.workers.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

> **Find your inner peace among the stars.**  
> Cosmic Channeling is a full-stack, edge-deployed web application that bridges **modern astrophysics with spiritual mindfulness**, harmonic Solfeggio soundscapes, guided meditation journeys, and deep space exploration.

---

## ✨ Core Features

### 🧘 1. Cosmic Meditation Sanctuary (`/meditate`)
* **Zero-CORS Web Audio Synthesizer**: Generates pure harmonic frequencies directly in the browser with 0 external dependencies:
  * **432 Hz Peace**: Sacred geometric tuning that induces parasympathetic calmness.
  * **528 Hz Vitality**: Solfeggio transformation tone for cellular harmony and clarity.
  * **6 Hz Theta Wave Binaural Beat**: Dual-ear carrier frequencies for astral travel and deep trance.
  * **Cosmic Noise**: Procedural pink and brown noise simulating interstellar wind.
  * **Tibetan Singing Bowl Chimes**: Physically modeled multi-harmonic bell chime for session start, interval cues, and completion.
* **High-Precision Meditation Timer**: Circular SVG progress ring with animated orbital gradients, 1m to 30m presets, custom selector, and an interactive **4-4-4-4 Box Breathing Pacer** (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s).
* **Guided Journeys with Dual Playback**: Curated collection of top guided cosmic meditations (*Astral Projection, Chakra 528Hz, Solar Prana, Deep Sleep*) playable inside a responsive in-app video modal or via direct YouTube links.
* **Cosmic Visions Gallery & Visualizer**: 20+ high-resolution NASA Hubble & JWST visuals with an automated **"Immersive Meditation Visualizer"** slideshow mode.

---

### 🌌 2. Celestial Atlas & Deep Space Explorer (`/explore`)
* **30+ High-Definition Celestial Objects** organized across 5 discovery realms:
  * 🪐 **Solar System & Ocean Worlds**: The Sun (Sol), Jupiter, Saturn, Mars, Earth/Moon, Europa, Titan, Neptune, Pluto.
  * 🌌 **Galaxies & Deep Field**: Andromeda (M31), Whirlpool (M51), Sombrero (M104), Cartwheel (JWST), Stephan's Quintet, Webb's First Deep Field (SMACS 0723).
  * 🦅 **Nebulae & Star Nurseries**: Carina Cosmic Cliffs (JWST), Pillars of Creation, Orion (M42), Helix (Eye of God), Tarantula (30 Doradus), Southern Ring, Crab Supernova Remnant.
  * 🪐 **Alien Exoplanets**: TRAPPIST-1e (Habitable Zone), Kepler-22b (Water World), 55 Cancri e (Lava Planet), Proxima Centauri b, Kepler-186f.
  * 🕳️ **Black Holes & Cosmic Extremes**: Sagittarius A* (Milky Way Core), M87* Supermassive Black Hole, Crab Pulsar.
* **Real Astronomical Telemetry**: Distance from Earth, host constellation, observing mission (*JWST, Hubble, Cassini, EHT*), key scientific insights, and direct deep links to official NASA Science Data and Wikipedia.
* **Live NASA APOD & Spaceflight News**: Features the live daily **NASA Astronomy Picture of the Day** and real-time spaceflight dispatches aggregated from the Spaceflight News API (SNAPI v4) and space agency RSS feeds.

---

### 📖 3. Astro-Journal (`/journal`)
* Private cloud-synchronized reflection vault for cosmic thoughts, dream records, and spiritual insights.
* Integrated theme tagging, word count analytics, and markdown export.
* Fully connected to Firebase user accounts with fallback offline local caching.

---

### 🛠️ 4. Cosmic Tools & Signal Analyzer (`/tools`)
* **Cosmic Pattern Generator**: Receive thought-provoking universal questions and personalized affirmations.
* **Dream Interpreter**: Analyze dreams through a cosmic lens for intuitive spiritual meanings.
* **Cosmic Signals Player**: Real electromagnetic waves converted to audio (Voyager Golden Record, Saturn Radio Emissions, Solar Sonification).
* **Cosmic Archetype Quiz**: Interactive 5-question test that determines your cosmic consciousness profile.

---

### 🔐 5. Modern Firebase Authentication (`/auth`)
* **1-Click Google Popup Sign-In**: Client-side popup (`signInWithPopup`) eliminates cross-domain redirect bugs.
* **Email & Password Authentication**: Instant registration and login.
* **Automated Password Reset**: In-app recovery form dispatching official Firebase reset emails.
* **Edge Token Verification**: Cloudflare Worker verifies RS256 JWKS tokens using the `jose` Web Crypto library with `Authorization: Bearer <token>` headers.

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│             Cosmic Channeling Architecture             │
├──────────────────────────┬─────────────────────────────┤
│ Frontend (Vercel)        │ Backend (Cloudflare Workers)│
│                          │                             │
│ • React 18 + TypeScript  │ • Cloudflare Workers + Hono │
│ • Vite Single Page App   │ • Web Crypto JWKS Auth      │
│ • Tailwind CSS + Radix UI│ • NASA APOD Proxy & Caching │
│ • Web Audio API Synthesizer│ • SNAPI v4 Spaceflight News │
│ • TanStack Query v5      │ • Rate Limiter & KV Storage │
└──────────────────────────┴─────────────────────────────┘
```

| Layer | Technologies |
|---|---|
| **Frontend SPA** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide Icons, Wouter Router |
| **State & API Cache** | TanStack Query v5 (React Query) |
| **Sound Synthesis** | Native Web Audio API (`AudioContext`, `OscillatorNode`, `BiquadFilterNode`, `GainNode`) |
| **Authentication** | Firebase Authentication v11 (Google OAuth Popup, Email/Password, Password Resets) |
| **Backend API** | Cloudflare Workers, Hono Framework, `jose` (JWT verification) |
| **Hosting & CI/CD** | Vercel (Frontend), Cloudflare Edge Network (Backend Worker API) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Naveen071110/Cosmic-channeling.git
   cd Cosmic-channeling
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Verify TypeScript & Production Build:**
   ```bash
   npm run check   # Runs tsc (0 compiler errors)
   npm run build   # Compiles production bundle with Vite
   ```

---

## 📂 Project Structure

```
cosmic-channeling/
├── client/                      # Frontend SPA (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── features/        # Timer, Guided Journeys, APOD, Quiz
│   │   │   ├── layout/          # Header, Minimalist Footer
│   │   │   ├── journal/         # Astro-Journal editor & sync
│   │   │   └── ui/              # shadcn/ui base primitives & dialogs
│   │   ├── hooks/               # useAuth, useToast
│   │   ├── lib/                 # WebAudioCosmicSynth, data, queryClient, firebase
│   │   ├── pages/               # Home, Meditate, Explore, Journal, Tools, Blog, Religions, Auth
│   │   ├── types/               # TypeScript interfaces (CelestialObject, Quote, etc.)
│   │   ├── App.tsx              # Root router & Suspense boundaries
│   │   └── main.tsx             # Entry point
│   └── index.html               # SPA HTML template
│
├── worker/                      # Edge Backend API (Cloudflare Workers + Hono)
│   ├── src/
│   │   ├── routes/              # content, cosmic-api, auth, newsletter, traditions
│   │   ├── auth-middleware.ts   # Firebase RS256 JWKS token verification (jose)
│   │   ├── cache.ts             # Memory & KV caching
│   │   ├── env.ts               # Environment bindings
│   │   └── index.ts             # Worker entry point
│   └── wrangler.toml            # Cloudflare deployment config
│
├── package.json                 # Project dependencies & scripts
├── vite.config.ts               # Vite configuration & path aliases
├── tailwind.config.ts           # Tailwind CSS cosmic theme extensions
└── README.md                    # Project documentation
```

---

## 👨‍💻 Author & Attribution

* **Built with ❤️ by [Naveen](https://naveenguru.vercel.app)**
* **YouTube Channel**: [@CosmicChanneling001](https://www.youtube.com/@CosmicChanneling001)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
