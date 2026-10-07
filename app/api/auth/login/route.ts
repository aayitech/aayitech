import { NextResponse } from "next/server";
import { assertAuthConfigured, authErrorResponse, setSessionCookie, verifyPassword } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 10_000) {
      return Response.json({ message: "That request is too large." }, { status: 413 });
    }
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || password.length > 128) {
      return NextResponse.json({ message: "Enter your email and password." }, { status: 400 });
    }

    assertAuthConfigured();
    await ensureSchema();
    const result = await getPool().query("SELECT id, full_name, email, password_hash, created_at FROM aayi_users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ message: "Email or password is incorrect." }, { status: 401 });
    }
    await setSessionCookie(user.id);
    return NextResponse.json({ user: { id: user.id, full_name: user.full_name, email: user.email, created_at: user.created_at } });
  } catch (error) {
    return authErrorResponse(error);
  }
}
