import { getSessionUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ message: "Sign in to view your saved SEO reports." }, { status: 401 });
  try {
    await ensureSchema();
    const result = await getPool().query(
      "SELECT id, topic, report, created_at FROM aayi_keyword_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [user.id],
    );
    return Response.json({ reports: result.rows });
  } catch {
    return Response.json({ message: "Saved reports are temporarily unavailable." }, { status: 503 });
  }
}
