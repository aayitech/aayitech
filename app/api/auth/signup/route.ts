import { NextResponse } from "next/server";
import { assertAuthConfigured, authErrorResponse, hashPassword, setSessionCookie } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 10_000) {
      return NextResponse.json({ message: "That request is too large." }, { status: 413 });
    }
    const body = await request.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 100) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 128) {
      return NextResponse.json({ message: "Enter your name, a valid email, and a password between 8 and 128 characters." }, { status: 400 });
    }

    assertAuthConfigured();
    await ensureSchema();
    const passwordHash = await hashPassword(password);
    const result = await getPool().query(
      "INSERT INTO aayi_users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at",
      [fullName, email, passwordHash],
    );
    await setSessionCookie(result.rows[0].id);

    // Signup should succeed even if the optional owner notification provider is unavailable.
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
        const { error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "AAYI TECH <onboarding@resend.dev>",
          to: process.env.CONTACT_EMAIL,
          subject: `New AAYI TECH signup: ${fullName}`,
          html: `<h2>New AAYI TECH account</h2><p><strong>Name:</strong> ${escapeHtml(fullName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Joined:</strong> ${new Date(result.rows[0].created_at).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" })}</p>`,
        });
        if (error) console.error("Signup notification email failed", error);
      } catch (notificationError) {
        console.error("Signup notification email failed", notificationError);
      }
    }
    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return NextResponse.json({ message: "An account with that email already exists. Try signing in." }, { status: 409 });
    }
    return authErrorResponse(error);
  }
}
