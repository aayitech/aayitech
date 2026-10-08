import { aiErrorResponse, aiCompletion } from "@/lib/ai-provider";

export const runtime = "nodejs";

const siteGuide = `You are AAYI TECH's site assistant. AAYI TECH is a practical digital tools hub. Current destinations: local weather and recent headlines at /weather (browser location is optional; a city can also be selected; forecast data comes from MET Norway and headlines from GDELT), stock market lookup at /markets/stocks (needs an Alpha Vantage server API key), crypto pulse at /markets/crypto (shows major Binance USDT pairs and their 24-hour direction), this site assistant at /assistant, affiliate picks at /affiliates (recommendations are being curated; links are disclosed), and Ambreen's original portfolio at /ambreen with project details at /ambreen/projects. Accounts at /signup save a profile when the Railway Postgres database is connected. Be warm, concise, practical, and honest about features that still need provider setup. If asked about unrelated topics, answer briefly and steer back to the site's tools. Never give financial advice or claim a stock/crypto is a buy.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const messages = incoming
      .filter((message: unknown) => typeof message === "object" && message !== null && "role" in message && "content" in message)
      .filter((message: { role: string }) => message.role === "user" || message.role === "assistant")
      .slice(-8)
      .map((message: { role: "user" | "assistant"; content: unknown }) => ({ role: message.role, content: typeof message.content === "string" ? message.content.slice(0, 1200) : "" }))
      .filter((message: { content: string }) => message.content.length > 0);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return Response.json({ message: "Ask a question to start a conversation." }, { status: 400 });
    }
    const answer = await aiCompletion([{ role: "system", content: siteGuide }, ...messages]);
    return Response.json({ answer });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
