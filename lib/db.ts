import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var aayiPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var aayiSchemaReady: Promise<void> | undefined;
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_NOT_CONFIGURED");

  if (!globalThis.aayiPgPool) {
    globalThis.aayiPgPool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
      ssl: process.env.DATABASE_SSL === "true" ? {} : undefined,
    });
  }
  return globalThis.aayiPgPool;
}

export async function ensureSchema() {
  if (!globalThis.aayiSchemaReady) {
    globalThis.aayiSchemaReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS aayi_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
    })().catch((error) => {
      globalThis.aayiSchemaReady = undefined;
      throw error;
    });
  }
  return globalThis.aayiSchemaReady;
}
