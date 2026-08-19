/**
 * Simple in-memory cache with TTL and stale-while-revalidate capabilities.
 * Note: This cache is ephemeral per Worker isolate.
 * For persistent caching across requests, responses also emit HTTP Cache-Control headers.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();
  private lastCleanup = Date.now();

  static readonly TTL = {
    NASA_APOD: 24 * 60 * 60 * 1000,      // 24 hours (APOD updates once daily)
    SOLAR_CYCLES: 12 * 60 * 60 * 1000,   // 12 hours (sunrise/sunset/twilight per region)
    STARGAZING: 30 * 60 * 1000,          // 30 minutes (weather clarity changes hourly)
    SPACE_NEWS: 60 * 60 * 1000,          // 1 hour (news feeds update periodically)
    ZEN_QUOTES: 24 * 60 * 60 * 1000,     // 24 hours (daily wisdom)
    RSS_FEED: 30 * 60 * 1000,            // 30 minutes
    DB_LIST: 60 * 60 * 1000,             // 1 hour
    DB_ITEM: 30 * 60 * 1000,             // 30 minutes
  } as const;

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    // Run cleanup if cache has grown
    const now = Date.now();
    if (now - this.lastCleanup > 600_000 || this.store.size > 200) {
      this.cleanup(now);
    }

    this.store.set(key, {
      value,
      expiresAt: now + ttlMs,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  private cleanup(now: number) {
    this.lastCleanup = now;
    this.store.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    });
  }
}

export const cache = new MemoryCache();
