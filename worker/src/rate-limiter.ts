import type { Context } from "hono";

interface RateLimitConfig {
  limit: number;      // Maximum allowed requests in window
  windowSec: number;  // Window duration in seconds
  keyPrefix?: string; // Prefix for scoping different endpoints
}

interface RateLimitRecord {
  count: number;
  resetTime: number; // epoch ms
}

/**
 * In-memory sliding-window rate limiter for Cloudflare Workers.
 * Tracks request counts per client IP per route prefix.
 */
class MemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();
  private lastCleanup = Date.now();

  /**
   * Check if a request exceeds rate limits.
   * Returns { allowed: boolean, remaining: number, resetSec: number, limit: number }
   */
  check(clientIp: string, config: RateLimitConfig) {
    const now = Date.now();
    const windowMs = config.windowSec * 1000;
    const key = `${config.keyPrefix || "global"}:${clientIp}`;

    // Periodically clean up stale records every 5 minutes
    if (now - this.lastCleanup > 300_000) {
      this.cleanup(now);
    }

    let record = this.store.get(key);

    if (!record || now >= record.resetTime) {
      // First request or window expired
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      this.store.set(key, record);

      const resetSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      return {
        allowed: true,
        remaining: config.limit - 1,
        resetSec,
        limit: config.limit,
      };
    }

    // Existing active window
    record.count += 1;
    const resetSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    const remaining = Math.max(0, config.limit - record.count);
    const allowed = record.count <= config.limit;

    return {
      allowed,
      remaining,
      resetSec,
      limit: config.limit,
    };
  }

  private cleanup(now: number) {
    this.lastCleanup = now;
    this.store.forEach((record, key) => {
      if (now >= record.resetTime) {
        this.store.delete(key);
      }
    });
  }
}

export const rateLimiter = new MemoryRateLimiter();

/**
 * Helper to extract client IP from Cloudflare or proxy headers
 */
export function getClientIp(c: Context): string {
  return (
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "127.0.0.1"
  );
}

/**
 * Rate limit guard helper.
 * If exceeded, sets 429 response on context and returns false.
 */
export function enforceRateLimit(c: Context, config: RateLimitConfig): boolean {
  const ip = getClientIp(c);
  const result = rateLimiter.check(ip, config);

  c.header("X-RateLimit-Limit", result.limit.toString());
  c.header("X-RateLimit-Remaining", result.remaining.toString());
  c.header("X-RateLimit-Reset", result.resetSec.toString());

  if (!result.allowed) {
    c.status(429);
    c.header("Retry-After", result.resetSec.toString());
    return false;
  }

  return true;
}
