import { getSessionUser } from "@/lib/auth";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";

function parseSymbol(value: string | null) {
  const symbol = (value || "").trim().toUpperCase();
  return /^[A-Z0-9.^-]{1,10}$/.test(symbol) ? symbol : "";
}

export async function GET(request: Request) {
  const symbol = parseSymbol(new URL(request.url).searchParams.get("symbol"));
  if (!symbol) return Response.json({ message: "Enter a valid ticker symbol." }, { status: 400 });
  try {
    await ensureSchema();
    const result = await getPool().query(`SELECT c.id, c.symbol, c.body, c.created_at, u.full_name AS author
      FROM aayi_stock_comments c JOIN aayi_users u ON u.id = c.user_id
      WHERE c.symbol = $1 ORDER BY c.created_at DESC LIMIT 50`, [symbol]);
    return Response.json({ comments: result.rows }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("[stock-community] read failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ message: "Stock discussion is temporarily unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const user = await getSessionUser();
    if (!user) return Response.json({ message: "Sign in to share your market view." }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const symbol = parseSymbol(searchParams.get("symbol"));
    const body = await request.json();
    const message = typeof body.body === "string" ? body.body.trim().slice(0, 1500) : "";
    if (!symbol || message.length < 5) return Response.json({ message: "Choose a ticker and write at least 5 characters." }, { status: 400 });
    const recent = await getPool().query("SELECT COUNT(*)::int AS count FROM aayi_stock_comments WHERE user_id = $1 AND created_at > NOW() - INTERVAL '10 minutes'", [user.id]);
    if (recent.rows[0].count >= 5) return Response.json({ message: "You have posted several times recently. Please wait a few minutes." }, { status: 429 });
    await getPool().query("INSERT INTO aayi_stock_comments (user_id, symbol, body) VALUES ($1, $2, $3)", [user.id, symbol, message]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[stock-community] write failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ message: "Your comment could not be saved. Please try again." }, { status: 500 });
  }
}
