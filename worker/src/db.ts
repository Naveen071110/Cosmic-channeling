import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "../../shared/schema";

// Use the global WebSocket constructor (available on Workers) instead of the Node `ws` package
neonConfig.webSocketConstructor = WebSocket;

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get (or create) the Neon database connection using the provided connection string.
 * The connection is lazily initialized on first call.
 */
export function getDb(connectionString: string) {
  if (!dbInstance) {
    pool = new Pool({ connectionString });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

/**
 * Close the database pool (useful for cleanup, though less relevant on Workers).
 */
export function closeDb() {
  if (pool) {
    pool.end().catch(() => {});
    pool = null;
    dbInstance = null;
  }
}
