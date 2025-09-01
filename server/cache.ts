
class SimpleCache {
  private cache = new Map();
  private expiry = new Map();

  set(key: string, value: any, ttlMs: number = 300000) { // 5 min default
    this.cache.set(key, value);
    this.expiry.set(key, Date.now() + ttlMs);
  }

  get(key: string) {
    if (this.expiry.get(key) < Date.now()) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.expiry.clear();
  }
}

export const cache = new SimpleCache();
