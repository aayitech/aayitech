const categories = {
  world: "(world OR global)",
  business: "(business OR economy)",
  technology: "(technology OR tech)",
  science: "(science OR research)",
  entertainment: "(entertainment OR film OR music OR television OR celebrity)",
  sports: "(sports OR football OR cricket OR tennis)",
} as const;

type Category = keyof typeof categories;
type GdeltArticle = { title?: unknown; url?: unknown; domain?: unknown; seendate?: unknown; sourcecountry?: unknown };

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = searchParams.get("category") || "world";
  if (!(requested in categories)) {
    return Response.json({ message: "Choose a supported news category." }, { status: 400 });
  }
  const category = requested as Category;
  const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
  url.searchParams.set("query", categories[category]);
  url.searchParams.set("mode", "artlist");
  url.searchParams.set("format", "json");
  url.searchParams.set("maxrecords", "18");
  url.searchParams.set("timespan", "24h");
  url.searchParams.set("sort", "datedesc");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "AAYI TECH News/1.0 (https://www.aayitech.com)" },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.error("[news] GDELT request failed", { status: response.status, statusText: response.statusText, category });
      return Response.json({ message: "Headlines are temporarily unavailable. Please try again shortly." }, { status: 502 });
    }

    const payload = await response.json() as { articles?: unknown };
    const articles: unknown[] = Array.isArray(payload.articles) ? payload.articles : [];
    return Response.json({
      category,
      articles: articles
        .filter((article): article is GdeltArticle => typeof article === "object" && article !== null && "title" in article && "url" in article && typeof article.title === "string" && typeof article.url === "string" && /^https?:\/\//i.test(article.url))
        .slice(0, 18)
        .map((article) => ({
          title: article.title,
          url: article.url,
          publisher: typeof article.domain === "string" ? article.domain : "Original publisher",
          publishedAt: typeof article.seendate === "string" ? article.seendate : null,
          country: typeof article.sourcecountry === "string" ? article.sourcecountry : null,
        })),
      attribution: "Headlines from the GDELT Project; articles belong to their publishers.",
    }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } });
  } catch (error) {
    console.error("[news] headline fetch failed", { name: error instanceof Error ? error.name : "UnknownError", category });
    return Response.json({ message: "Could not load headlines. Check your connection and try again." }, { status: 502 });
  }
}
