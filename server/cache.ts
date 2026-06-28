export const TTL = {
  RSS_FEED:   30 * 60 * 1000,   // 30 minutes — external RSS (NASA, Space.com, Medium)
  STATIC_DATA: 24 * 60 * 60 * 1000, // 24 hours  — in-process static arrays (quotes, celestial, patterns)
  DB_LIST:     60 * 60 * 1000,  // 1 hour    — DB-backed list queries (traditions)
  DB_ITEM:     60 * 60 * 1000,  // 1 hour    — DB-backed single-item queries
};

class SimpleCache {
  private data = new Map<string, unknown>();
  private expiry = new Map<string, number>();

  set(key: string, value: unknown, ttlMs: number = TTL.RSS_FEED) {
    this.data.set(key, value);
    this.expiry.set(key, Date.now() + ttlMs);
  }

  get<T = unknown>(key: string): T | null {
    const exp = this.expiry.get(key);
    if (exp === undefined || exp < Date.now()) {
      this.data.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.data.get(key) as T;
  }

  has(key: string): boolean {
    const exp = this.expiry.get(key);
    if (exp === undefined || exp < Date.now()) {
      this.data.delete(key);
      this.expiry.delete(key);
      return false;
    }
    return true;
  }

  clear() {
    this.data.clear();
    this.expiry.clear();
  }

  size() {
    return this.data.size;
  }
}

export const cache = new SimpleCache();
