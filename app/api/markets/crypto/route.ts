export const revalidate = 60;

const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"];

export async function GET() {
  try {
    const query = encodeURIComponent(JSON.stringify(symbols));
    const response = await fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbols=${query}`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error("market data unavailable");
    const rows = await response.json();
    const assets = rows.map((row: Record<string, string>) => ({
      symbol: row.symbol.replace("USDT", ""),
      price: Number(row.lastPrice),
      change24h: Number(row.priceChangePercent),
      high24h: Number(row.highPrice),
      low24h: Number(row.lowPrice),
      quoteVolume: Number(row.quoteVolume),
    }));
    return Response.json({ assets, updatedAt: new Date().toISOString(), source: "Binance public market data" }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } });
  } catch {
    return Response.json({ message: "Public crypto market data is temporarily unavailable." }, { status: 502 });
  }
}
