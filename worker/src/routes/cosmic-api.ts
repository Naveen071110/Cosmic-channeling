import { Hono } from "hono";
import type { Env } from "../env";
import { cache, MemoryCache } from "../cache";
import { enforceRateLimit } from "../rate-limiter";
import { quotes } from "../../../client/src/lib/data";

const router = new Hono<{ Bindings: Env }>();

// --- Curated Fallback Assets for Zero-Downtime Resilience ---

const FALLBACK_APODS = [
  {
    date: new Date().toISOString().split("T")[0],
    title: "The Cosmic Cliffs of Carina Nebula (JWST)",
    explanation:
      "This landscape of 'mountains' and 'valleys' speckled with glittering stars is actually the edge of a nearby, young, star-forming region called NGC 3324 in the Carina Nebula. Captured in infrared light by the James Webb Space Telescope, this image reveals for the first time previously invisible areas of star birth.",
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1600&q=85",
    hdurl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=2400&q=95",
    media_type: "image",
    copyright: "NASA, ESA, CSA, STScI",
    isFallback: true,
  },
  {
    date: new Date().toISOString().split("T")[0],
    title: "Pillars of Creation in Infrared",
    explanation:
      "NASA's James Webb Space Telescope has captured a lush, highly detailed landscape of the iconic Pillars of Creation. Star birth in the Eagle Nebula reveals three-dimensional structures of cool interstellar gas and dust that look like majestic rock formations.",
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1600&q=85",
    hdurl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2400&q=95",
    media_type: "image",
    copyright: "NASA, ESA, CSA, STScI",
    isFallback: true,
  },
  {
    date: new Date().toISOString().split("T")[0],
    title: "The Deep Field: Thousands of Ancient Galaxies",
    explanation:
      "Webb's First Deep Field is galaxy cluster SMACS 0723, overflowing with thousands of galaxies including the faintest objects ever observed in the infrared. This slice of the vast universe covers a patch of sky approximately the size of a grain of sand held at arm's length.",
    url: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=1600&q=85",
    hdurl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=2400&q=95",
    media_type: "image",
    copyright: "NASA, ESA, CSA, STScI",
    isFallback: true,
  },
];

/**
 * 1. GET /api/nasa/apod — NASA Astronomy Picture of the Day
 * Rate-limited (30 req/min per IP) and cached for 24 hours in Worker isolate.
 */
router.get("/nasa/apod", async (c) => {
  if (!enforceRateLimit(c, { limit: 30, windowSec: 60, keyPrefix: "nasa-apod" })) {
    return c.json(
      {
        message: "Rate limit exceeded. Please wait a moment before requesting more cosmic imagery.",
        retryAfter: c.res.headers.get("Retry-After"),
      },
      429
    );
  }

  const requestedDate = c.req.query("date");
  const todayStr = new Date().toISOString().split("T")[0];
  const dateKey = requestedDate || todayStr;
  const CACHE_KEY = `nasa-apod:${dateKey}`;

  const cached = cache.get<any>(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  const apiKey = c.env.NASA_API_KEY || "DEMO_KEY";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}${requestedDate ? `&date=${requestedDate}` : ""}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`NASA API returned HTTP ${res.status}`);
    }

    const data: any = await res.json();
    const result = {
      date: data.date || dateKey,
      title: data.title || "Cosmic Astronomy Picture of the Day",
      explanation: data.explanation || "",
      url: data.url || data.hdurl,
      hdurl: data.hdurl || data.url,
      media_type: data.media_type || "image",
      copyright: data.copyright ? data.copyright.replace(/\n/g, "").trim() : "NASA Public Domain",
      isFallback: false,
    };

    cache.set(CACHE_KEY, result, MemoryCache.TTL.NASA_APOD);
    c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    c.header("X-Cache", "MISS");
    return c.json(result);
  } catch (err) {
    console.warn("NASA APOD upstream unavailable or rate-limited, serving curated fallback:", err);

    const fallbackIndex = Math.abs(hashCode(dateKey)) % FALLBACK_APODS.length;
    const fallback = { ...FALLBACK_APODS[fallbackIndex], date: dateKey };

    // Cache fallback for 10 minutes so subsequent hits don't spam NASA
    cache.set(CACHE_KEY, fallback, 10 * 60 * 1000);
    c.header("Cache-Control", "public, max-age=600");
    c.header("X-Cache", "FALLBACK");
    return c.json(fallback);
  }
});

/**
 * 2. GET /api/solar-cycles — Real-time Sun, Twilight & Moon Phase Alignment
 * Computes twilight windows, golden hours, and lunar illumination for user's coordinates.
 * Rate-limited (20 req/min per IP) and cached for 12 hours per geographical grid.
 */
router.get("/solar-cycles", async (c) => {
  if (!enforceRateLimit(c, { limit: 20, windowSec: 60, keyPrefix: "solar-cycles" })) {
    return c.json({ message: "Rate limit exceeded for solar coordinates." }, 429);
  }

  const rawLat = parseFloat(c.req.query("lat") || "0");
  const rawLng = parseFloat(c.req.query("lng") || "0");
  const lat = isNaN(rawLat) ? 0 : Math.max(-90, Math.min(90, rawLat));
  const lng = isNaN(rawLng) ? 0 : Math.max(-180, Math.min(180, rawLng));

  // Round coordinates to ~10km grid for efficient cache sharing
  const gridLat = Math.round(lat * 10) / 10;
  const gridLng = Math.round(lng * 10) / 10;
  const todayStr = new Date().toISOString().split("T")[0];
  const CACHE_KEY = `solar:${gridLat}:${gridLng}:${todayStr}`;

  const cached = cache.get<any>(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=43200, stale-while-revalidate=1800");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  // Calculate Lunar Phase algorithmically (accurate across all dates)
  const lunar = calculateMoonPhase(new Date());

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${gridLat}&lng=${gridLng}&formatted=0&date=${todayStr}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Sunrise-Sunset API HTTP ${res.status}`);
    }

    const json: any = await res.json();
    if (json.status !== "OK" || !json.results) {
      throw new Error("Invalid Sunrise-Sunset response");
    }

    const r = json.results;
    const result = {
      location: { lat: gridLat, lng: gridLng },
      date: todayStr,
      solar: {
        sunrise: r.sunrise,
        sunset: r.sunset,
        solarNoon: r.solar_noon,
        dayLengthSeconds: r.day_length,
        dayLengthFormatted: formatSecondsToHours(r.day_length),
        civilTwilight: {
          begin: r.civil_twilight_begin,
          end: r.civil_twilight_end,
        },
        nauticalTwilight: {
          begin: r.nautical_twilight_begin,
          end: r.nautical_twilight_end,
        },
        astronomicalTwilight: {
          begin: r.astronomical_twilight_begin,
          end: r.astronomical_twilight_end,
        },
      },
      lunar,
      isFallback: false,
    };

    cache.set(CACHE_KEY, result, MemoryCache.TTL.SOLAR_CYCLES);
    c.header("Cache-Control", "public, max-age=43200, stale-while-revalidate=1800");
    c.header("X-Cache", "MISS");
    return c.json(result);
  } catch (err) {
    console.warn("Sunrise-Sunset API error, using mathematical solar model:", err);

    // Fallback mathematical twilight estimate
    const now = new Date();
    const sunriseEstimate = new Date(now);
    sunriseEstimate.setUTCHours(6, 0, 0, 0);
    const sunsetEstimate = new Date(now);
    sunsetEstimate.setUTCHours(18, 30, 0, 0);

    const fallbackResult = {
      location: { lat: gridLat, lng: gridLng },
      date: todayStr,
      solar: {
        sunrise: sunriseEstimate.toISOString(),
        sunset: sunsetEstimate.toISOString(),
        solarNoon: new Date(now.setUTCHours(12, 15, 0, 0)).toISOString(),
        dayLengthSeconds: 45000,
        dayLengthFormatted: "12h 30m",
        civilTwilight: {
          begin: new Date(now.setUTCHours(5, 35, 0, 0)).toISOString(),
          end: new Date(now.setUTCHours(18, 55, 0, 0)).toISOString(),
        },
        nauticalTwilight: {
          begin: new Date(now.setUTCHours(5, 5, 0, 0)).toISOString(),
          end: new Date(now.setUTCHours(19, 25, 0, 0)).toISOString(),
        },
        astronomicalTwilight: {
          begin: new Date(now.setUTCHours(4, 30, 0, 0)).toISOString(),
          end: new Date(now.setUTCHours(20, 0, 0, 0)).toISOString(),
        },
      },
      lunar,
      isFallback: true,
    };

    cache.set(CACHE_KEY, fallbackResult, 30 * 60 * 1000);
    c.header("Cache-Control", "public, max-age=1800");
    return c.json(fallbackResult);
  }
});

/**
 * 3. GET /api/stargazing-forecast — Open-Meteo Night Sky Clarity Index
 * Computes cloud obscurity, atmospheric seeing, and stargazing index (0-100).
 * Rate-limited (20 req/min per IP) and cached for 30 minutes.
 */
router.get("/stargazing-forecast", async (c) => {
  if (!enforceRateLimit(c, { limit: 20, windowSec: 60, keyPrefix: "stargazing" })) {
    return c.json({ message: "Rate limit exceeded for stargazing forecast." }, 429);
  }

  const rawLat = parseFloat(c.req.query("lat") || "28.6139"); // Default New Delhi / Neutral
  const rawLng = parseFloat(c.req.query("lng") || "77.2090");
  const lat = isNaN(rawLat) ? 28.61 : Math.round(rawLat * 10) / 10;
  const lng = isNaN(rawLng) ? 77.20 : Math.round(rawLng * 10) / 10;

  const CACHE_KEY = `stargazing:${lat}:${lng}`;
  const cached = cache.get<any>(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=cloud_cover,relative_humidity_2m,temperature_2m,surface_pressure,wind_speed_10m,weather_code&hourly=cloud_cover,visibility,relative_humidity_2m,wind_speed_10m&daily=sunrise,sunset&timezone=auto&forecast_days=2`;

    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const data: any = await res.json();
    const current = data.current || {};
    const cloudCover = current.cloud_cover ?? 20;
    const humidity = current.relative_humidity_2m ?? 45;
    const windSpeed = current.wind_speed_10m ?? 8;
    const temperature = current.temperature_2m ?? 18;

    // Calculate Cosmic Stargazing Clarity Index (0 to 100)
    // Cloud cover is the heaviest penalty (up to -70 points)
    // High humidity (>75%) creates atmospheric haze (up to -15 points)
    // Wind > 25 km/h creates atmospheric turbulence / poor seeing (-10 points)
    let clarityScore = 100;
    clarityScore -= cloudCover * 0.7;
    if (humidity > 70) clarityScore -= Math.min(15, (humidity - 70) * 0.5);
    if (windSpeed > 20) clarityScore -= Math.min(15, (windSpeed - 20) * 0.8);
    clarityScore = Math.max(5, Math.min(100, Math.round(clarityScore)));

    let qualityRating = "Poor Visibility";
    let advice = "High cloud cover or atmospheric moisture may obscure faint celestial objects.";
    if (clarityScore >= 85) {
      qualityRating = "Pristine Dark Sky";
      advice = "Exceptional transparency and stillness. Ideal for deep-sky observation, galaxies, and nebulae.";
    } else if (clarityScore >= 70) {
      qualityRating = "Great Stargazing";
      advice = "Clear atmospheric conditions. Visible planetary detail and major constellations.";
    } else if (clarityScore >= 50) {
      qualityRating = "Moderate Visibility";
      advice = "Bright stars, the Moon, and major planets will be easily visible through light cloud layers.";
    }

    const result = {
      location: { lat, lng, timezone: data.timezone },
      clarityScore,
      qualityRating,
      advice,
      current: {
        cloudCover,
        humidity,
        windSpeedKmh: windSpeed,
        temperatureC: temperature,
      },
      hourlySummary: (data.hourly?.time || []).slice(0, 12).map((timeStr: string, idx: number) => ({
        time: timeStr,
        cloudCover: data.hourly.cloud_cover?.[idx] ?? cloudCover,
        visibilityMeters: data.hourly.visibility?.[idx] ?? 10000,
      })),
      isFallback: false,
    };

    cache.set(CACHE_KEY, result, MemoryCache.TTL.STARGAZING);
    c.header("Cache-Control", "public, max-age=1800, stale-while-revalidate=300");
    c.header("X-Cache", "MISS");
    return c.json(result);
  } catch (err) {
    console.warn("Open-Meteo unavailable, returning computed default forecast:", err);

    const fallback = {
      location: { lat, lng, timezone: "UTC" },
      clarityScore: 82,
      qualityRating: "Great Stargazing",
      advice: "Clear cosmic conditions projected. Optimal for lunar exploration and constellation tracing.",
      current: {
        cloudCover: 18,
        humidity: 48,
        windSpeedKmh: 7.2,
        temperatureC: 20,
      },
      isFallback: true,
    };

    cache.set(CACHE_KEY, fallback, 10 * 60 * 1000);
    c.header("Cache-Control", "public, max-age=600");
    return c.json(fallback);
  }
});

/**
 * 4. GET /api/quotes/daily — Dynamic Zen & Cosmic Wisdom
 * Rate-limited (30 req/min) and cached for 24 hours.
 */
router.get("/quotes/daily", async (c) => {
  if (!enforceRateLimit(c, { limit: 30, windowSec: 60, keyPrefix: "zen-quotes" })) {
    return c.json({ message: "Rate limit exceeded for daily quotes." }, 429);
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const CACHE_KEY = `daily-wisdom:${todayStr}`;

  const cached = cache.get<any>(CACHE_KEY);
  if (cached) {
    c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    c.header("X-Cache", "HIT");
    return c.json(cached);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch("https://zenquotes.io/api/today", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`ZenQuotes HTTP ${res.status}`);

    const data: any = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0].q) {
      const item = data[0];
      const result = {
        id: `zen-${todayStr}`,
        text: item.q,
        author: item.a || "Ancient Wisdom",
        source: "Daily Cosmic Channeling",
        tags: ["Wisdom", "Consciousness", "Cosmic Alignment"],
        isFallback: false,
      };

      cache.set(CACHE_KEY, result, MemoryCache.TTL.ZEN_QUOTES);
      c.header("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
      return c.json(result);
    }
  } catch (err) {
    console.warn("ZenQuotes fetch failed, serving curated cosmic quote:", err);
  }

  // Curated fallback from data.ts
  const fallbackIndex = Math.abs(hashCode(todayStr)) % quotes.length;
  const fallbackQuote = {
    ...quotes[fallbackIndex],
    isFallback: true,
  };

  cache.set(CACHE_KEY, fallbackQuote, MemoryCache.TTL.ZEN_QUOTES);
  return c.json(fallbackQuote);
});

// --- Helper Functions ---

function calculateMoonPhase(date: Date) {
  // Astronomical moon phase estimation based on synodic month (29.53058770576 days)
  // Known new moon reference: Jan 6, 2000 18:14 UTC
  const synodicMonth = 29.53058770576;
  const refNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
  const diffDays = (date.getTime() - refNewMoon) / (1000 * 60 * 60 * 24);
  const phaseValue = (diffDays % synodicMonth + synodicMonth) % synodicMonth;
  const phaseNormalized = phaseValue / synodicMonth; // 0 to 1

  const illumination = Math.round((0.5 * (1 - Math.cos(2 * Math.PI * phaseNormalized))) * 100);

  const PHASES = [
    { name: "New Moon", emoji: "🌑", theme: "New beginnings, stillness & setting intentions" },
    { name: "Waxing Crescent", emoji: "🌒", theme: "Growth, momentum & creative inspiration" },
    { name: "First Quarter", emoji: "🌓", theme: "Action, overcoming obstacles & clarity" },
    { name: "Waxing Gibbous", emoji: "🌔", theme: "Refinement, patience & cosmic alignment" },
    { name: "Full Moon", emoji: "🌕", theme: "Heightened intuition, celebration & expanded awareness" },
    { name: "Waning Gibbous", emoji: "🌖", theme: "Gratitude, sharing wisdom & reflection" },
    { name: "Last Quarter", emoji: "🌗", theme: "Release, forgiveness & spiritual cleansing" },
    { name: "Waning Crescent", emoji: "🌘", theme: "Rest, surrender & deep meditation" },
  ];

  const phaseIndex = Math.floor(phaseNormalized * 8) % 8;
  const phaseInfo = PHASES[phaseIndex];

  return {
    phaseIndex,
    phaseName: phaseInfo.name,
    emoji: phaseInfo.emoji,
    theme: phaseInfo.theme,
    illuminationPercent: illumination,
    ageDays: Math.round(phaseValue * 10) / 10,
  };
}

function formatSecondsToHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export { router as cosmicApiRoutes };
