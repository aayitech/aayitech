export const runtime = "nodejs";

type ForecastPoint = {
  time: string;
  data?: {
    instant?: { details?: Record<string, number> };
    next_1_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
    next_6_hours?: { summary?: { symbol_code?: string } };
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lon"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return Response.json({ message: "Choose a valid location to see its forecast." }, { status: 400 });
  }

  // MET Norway asks clients to keep coordinates cache-friendly (max 4 decimals)
  // and to identify the application in its User-Agent.
  const lat = latitude.toFixed(3);
  const lon = longitude.toFixed(3);
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  const contact = process.env.CONTACT_EMAIL || "https://www.aayitech.com/contact";

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": `AAYI TECH weather/1.0 (${contact})`,
      },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      console.error("[weather] MET API request failed", { status: response.status, statusText: response.statusText });
      return Response.json({ message: "Weather data is temporarily unavailable. Please try again shortly." }, { status: 502 });
    }

    const payload = await response.json() as { properties?: { timeseries?: ForecastPoint[] } };
    const series = payload?.properties?.timeseries;
    if (!Array.isArray(series) || series.length === 0) {
      return Response.json({ message: "No forecast is available for this location." }, { status: 502 });
    }

    const hours = series.slice(0, 8).map((item) => ({
      time: item.time,
      temperature: item.data?.instant?.details?.air_temperature ?? null,
      symbol: item.data?.next_1_hours?.summary?.symbol_code ?? item.data?.next_6_hours?.summary?.symbol_code ?? null,
      precipitation: item.data?.next_1_hours?.details?.precipitation_amount ?? null,
    }));
    const current = series[0];

    return Response.json({
      updatedAt: current.time,
      current: {
        temperature: current.data?.instant?.details?.air_temperature ?? null,
        humidity: current.data?.instant?.details?.relative_humidity ?? null,
        windSpeed: current.data?.instant?.details?.wind_speed ?? null,
        symbol: current.data?.next_1_hours?.summary?.symbol_code ?? current.data?.next_6_hours?.summary?.symbol_code ?? null,
        precipitation: current.data?.next_1_hours?.details?.precipitation_amount ?? null,
      },
      hours,
      attribution: "Weather data © MET Norway, CC BY 4.0",
    }, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } });
  } catch (error) {
    console.error("[weather] forecast fetch failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ message: "Could not load the forecast. Check your connection and try again." }, { status: 502 });
  }
}
