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
        CREATE TABLE IF NOT EXISTS aayi_teacher_profiles (
          user_id UUID PRIMARY KEY REFERENCES aayi_users(id) ON DELETE CASCADE,
          subjects TEXT[] NOT NULL,
          bio TEXT NOT NULL DEFAULT '',
          available_online BOOLEAN NOT NULL DEFAULT FALSE,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS aayi_student_questions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES aayi_users(id) ON DELETE CASCADE,
          subject TEXT NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS aayi_question_replies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          question_id UUID NOT NULL REFERENCES aayi_student_questions(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES aayi_users(id) ON DELETE CASCADE,
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS aayi_teacher_reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          teacher_user_id UUID NOT NULL REFERENCES aayi_teacher_profiles(user_id) ON DELETE CASCADE,
          author_user_id UUID NOT NULL REFERENCES aayi_users(id) ON DELETE CASCADE,
          rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (teacher_user_id, author_user_id)
        );
        CREATE TABLE IF NOT EXISTS aayi_stock_comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES aayi_users(id) ON DELETE CASCADE,
          symbol TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS aayi_questions_created_idx ON aayi_student_questions (created_at DESC);
        CREATE INDEX IF NOT EXISTS aayi_question_replies_question_idx ON aayi_question_replies (question_id, created_at ASC);
        CREATE INDEX IF NOT EXISTS aayi_teacher_profiles_subjects_idx ON aayi_teacher_profiles USING GIN (subjects);
        CREATE INDEX IF NOT EXISTS aayi_stock_comments_symbol_idx ON aayi_stock_comments (symbol, created_at DESC);
      `);
    })().catch((error) => {
      globalThis.aayiSchemaReady = undefined;
      throw error;
    });
  }
  return globalThis.aayiSchemaReady;
}
