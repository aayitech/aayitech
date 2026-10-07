import { getSessionUser } from "@/lib/auth";
import { aiErrorResponse, aiCompletion } from "@/lib/ai-provider";
import { ensureSchema, getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = typeof body.topic === "string" ? body.topic.trim().slice(0, 180) : "";
    const country = typeof body.country === "string" ? body.country.trim().slice(0, 80) : "";
    const audience = typeof body.audience === "string" ? body.audience.trim().slice(0, 240) : "";
    const business = typeof body.business === "string" ? body.business.trim().slice(0, 160) : "";
    if (topic.length < 3) return Response.json({ message: "Add a topic or service with at least 3 characters." }, { status: 400 });

    const raw = await aiCompletion([
      { role: "system", content: "You are an experienced SEO strategist. Create useful, specific keyword research for a small business. Do not invent search volume or keyword difficulty numbers. Distinguish suggestions from measured data. Return valid JSON only, with keys: summary (string), primaryKeyword (string), keywords (array of objects with keyword, intent, cluster, priority (high/medium/low), and why), pageTitle (string), metaDescription (string), contentAngles (array of strings), faqIdeas (array of strings). Give 15 varied long-tail and supporting keyword ideas. Keep the language clear and practical." },
      { role: "user", content: JSON.stringify({ topic, targetCountry: country || "Not specified", targetAudience: audience || "Not specified", businessType: business || "Not specified" }) },
    ], true);
    let report: unknown;
    try { report = JSON.parse(raw); } catch { throw new Error("AI_EMPTY_RESPONSE"); }

    const user = await getSessionUser();
    let saved = false;
    if (user && process.env.DATABASE_URL) {
      try {
        await ensureSchema();
        await getPool().query("INSERT INTO aayi_keyword_reports (user_id, topic, report) VALUES ($1, $2, $3::jsonb)", [user.id, topic, JSON.stringify(report)]);
        saved = true;
      } catch {
        // Return the generated report even if report history storage is temporarily unavailable.
      }
    }
    return Response.json({ report, saved });
  } catch (error) {
    if (error instanceof Error && error.message === "AI_NOT_CONFIGURED") return aiErrorResponse(error);
    return aiErrorResponse(error);
  }
}
