export const revalidate = 900;

export async function GET(request: Request) {
  const symbol = new URL(request.url).searchParams.get("symbol")?.trim().toUpperCase() ?? "";
  if (!/^[A-Z.]{1,10}$/.test(symbol)) return Response.json({ message: "Enter a valid stock ticker symbol, such as AAPL or MSFT." }, { status: 400 });
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) return Response.json({ message: "Stock quotes are ready to connect. Add ALPHA_VANTAGE_API_KEY to the server environment to enable live quotes." }, { status: 503 });

  try {
    const url = new URL("https://www.alphavantage.co/query");
    url.searchParams.set("function", "GLOBAL_QUOTE");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("apikey", apiKey);
    const response = await fetch(url, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error("quote provider unavailable");
    const data = await response.json();
    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) {
      const detail = data.Note || data.Information || "No quote was returned for that symbol.";
      return Response.json({ message: String(detail).slice(0, 240) }, { status: 502 });
    }
    return Response.json({
      symbol: quote["01. symbol"],
      price: Number(quote["05. price"]),
      change: Number(quote["09. change"]),
      changePercent: String(quote["10. change percent"] ?? "").replace("%", ""),
      latestTradingDay: quote["07. latest trading day"],
      source: "Alpha Vantage",
      delayed: true,
    }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } });
  } catch {
    return Response.json({ message: "The stock quote provider could not be reached. Please try again." }, { status: 502 });
  }
}
