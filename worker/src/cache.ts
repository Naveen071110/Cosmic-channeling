/**
 * Simple in-memory cache with TTL.
 * Note: This cache is ephemeral — it resets on every Worker cold start.
 * For persistent caching across requests, use Cloudflare Cache API or KV.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();

  static readonly TTL = {
    RSS_FEED: 30 * 60 * 1000,   // 30 minutes
    DB_LIST: 60 * 60 * 1000,    // 1 hour
    DB_ITEM: 30 * 60 * 1000,    // 30 minutes
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
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = new MemoryCache();
