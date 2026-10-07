import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { ensureSchema, getPool } from "@/lib/db";

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = "aayi_session";
const SESSION_TTL = 60 * 60 * 24 * 14;

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET_NOT_CONFIGURED");
  return secret;
}

export function assertAuthConfigured() {
  authSecret();
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, digest] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !digest) return false;
  const expected = Buffer.from(digest, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sign(value: string) {
  return createHmac("sha256", authSecret()).update(value).digest("base64url");
}

export function createSession(userId: string) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = `${userId}.${expires}`;
  return { token: `${payload}.${sign(payload)}`, maxAge: SESSION_TTL };
}

export async function setSessionCookie(userId: string) {
  const { token, maxAge } = createSession(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const [userId, expiresText, signature] = token.split(".");
    if (!userId || !expiresText || !signature) return null;
    const payload = `${userId}.${expiresText}`;
    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    if (Number(expiresText) <= Math.floor(Date.now() / 1000)) return null;

    await ensureSchema();
    const result = await getPool().query(
      "SELECT id, full_name, email, created_at FROM aayi_users WHERE id = $1",
      [userId],
    );
    return result.rows[0] ?? null;
  } catch {
    return null;
  }
}

export function authErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "DATABASE_NOT_CONFIGURED") {
    return Response.json({ message: "Accounts are not available yet. The site owner needs to connect Railway Postgres using DATABASE_URL." }, { status: 503 });
  }
  if (message === "AUTH_SECRET_NOT_CONFIGURED") {
    return Response.json({ message: "Accounts are not available yet. The site owner needs to set AUTH_SECRET." }, { status: 503 });
  }
  return Response.json({ message: "We could not complete that request. Please try again." }, { status: 500 });
}
