// Vercel Edge Middleware for Agentic Web Protocols
// Handles true HTTP 404s, Accept: text/markdown content negotiation, and Vary headers

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - _vercel
     */
    '/((?!_next|_vercel).*)',
  ],
};

const VALID_PAGE_ROUTES = new Set([
  '',
  '/',
  '/meditate',
  '/explore',
  '/journal',
  '/tools',
  '/blog',
  '/religions',
  '/subscribe',
  '/auth',
  '/terms',
  '/privacy',
  '/about',
  '/contact',
  '/developers',
  '/docs',
]);

const STATIC_FILES = new Set([
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/openapi.json',
  '/favicon.ico',
  '/og-image.jpg',
  '/og-image.png',
  '/og-image.svg',
  '/google47e1a93ad265b624.html',
]);

const STATIC_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.json',
  '.xml',
  '.txt',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.mp3',
  '.map',
  '.webmanifest',
  '.html',
];

const NOT_FOUND_MARKDOWN = `# 404 Not Found
The requested resource does not exist on Cosmic Channeling.
- Sitemap: [https://cosmic-channeling.vercel.app/sitemap.xml](https://cosmic-channeling.vercel.app/sitemap.xml)
- Agent Docs: [https://cosmic-channeling.vercel.app/llms.txt](https://cosmic-channeling.vercel.app/llms.txt)
- OpenAPI Spec: [https://cosmic-channeling.vercel.app/openapi.json](https://cosmic-channeling.vercel.app/openapi.json)
- Developer Portal: [https://cosmic-channeling.vercel.app/developers](https://cosmic-channeling.vercel.app/developers)
`;

const HOME_MARKDOWN = `# Cosmic Channeling — Deep Space & Meditation Sanctuary

> Connect with the living cosmos through real-time Solfeggio soundscapes (432Hz / 528Hz), a 30+ HD Celestial Atlas, guided meditation journeys, and live NASA deep-space observation feeds.

## Core Capabilities & Features
- **Procedural Web Audio Synthesizer**: Pure harmonic frequencies generated directly in browser (432Hz Peace, 528Hz Vitality, 6Hz Theta binaural beat carriers, Tibetan singing bowl physical modeling).
- **Interactive 4-4-4-4 Box Breathing Guide**: Synchronized visual breath pacer with customizable session timers (1m–30m).
- **30+ HD Celestial Atlas**: Curated deep-space catalog with astronomical telemetry (Solar System, Andromeda, Whirlpool, JWST Carina Cliffs, Pillars of Creation, Habitable Exoplanets, Black Holes).
- **Live NASA APOD & Spaceflight News**: Real-time integration with NASA Astronomy Picture of the Day and Spaceflight News API (SNAPI v4).
- **Astro-Journal**: Private cloud-synchronized reflection vault for cosmic thoughts and dream insights.
- **Developer Hub & OpenAPI 3.1**: Machine-readable function-calling specifications for autonomous AI agents.

## Machine-Readable Resources
- [OpenAPI 3.1 Specification](https://cosmic-channeling.vercel.app/openapi.json)
- [llms.txt Discovery Guide](https://cosmic-channeling.vercel.app/llms.txt)
- [Full LLM Documentation](https://cosmic-channeling.vercel.app/llms-full.txt)
- [XML Sitemap](https://cosmic-channeling.vercel.app/sitemap.xml)
- [Developer Hub](https://cosmic-channeling.vercel.app/developers)

## Navigation Index
- [Meditation Sanctuary](https://cosmic-channeling.vercel.app/meditate)
- [Celestial Atlas](https://cosmic-channeling.vercel.app/explore)
- [Astro-Journal](https://cosmic-channeling.vercel.app/journal)
- [Cosmic Tools](https://cosmic-channeling.vercel.app/tools)
- [Spiritual Traditions](https://cosmic-channeling.vercel.app/religions)
- [Blog](https://cosmic-channeling.vercel.app/blog)
- [About Us](https://cosmic-channeling.vercel.app/about)
- [Contact Support](https://cosmic-channeling.vercel.app/contact)
- [Privacy Policy](https://cosmic-channeling.vercel.app/privacy)
- [Terms of Service](https://cosmic-channeling.vercel.app/terms)
`;

export default function middleware(request: Request): Response | void {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  const acceptHeader = request.headers.get('accept') || '';

  // 1. Check for Accept: text/markdown content negotiation
  if (acceptHeader.includes('text/markdown')) {
    // If it's a known page route, return structured markdown
    if (VALID_PAGE_ROUTES.has(pathname)) {
      return new Response(HOME_MARKDOWN, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    // If it's not a known route or static file, return 404 markdown
    if (!pathname.startsWith('/api') && !STATIC_FILES.has(pathname) && !STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
      return new Response(NOT_FOUND_MARKDOWN, {
        status: 404,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept, Accept-Encoding',
        },
      });
    }
  }

  // 2. Allow API requests to pass through to backend proxy
  if (pathname.startsWith('/api')) {
    return;
  }

  // 3. Allow static files to pass through
  if (STATIC_FILES.has(pathname) || STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return;
  }

  // 4. If it is a known page route, let Vercel serve the SPA shell with Vary headers
  if (VALID_PAGE_ROUTES.has(pathname)) {
    return;
  }

  // 5. Non-existent path -> Return true HTTP 404 status code (Fixes Soft-404)
  return new Response(NOT_FOUND_MARKDOWN, {
    status: 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
    },
  });
}
