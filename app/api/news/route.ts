import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.CRYPTOCOMPARE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "CRYPTOCOMPARE_API_KEY not set" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

  const params = new URLSearchParams({
    lang: "EN",
    limit: String(limit),
    api_key: apiKey,
  });

  const categories = searchParams.get("categories");
  if (categories) params.append("categories", categories);

  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/news/?${params.toString()}`,
      { next: { revalidate: 120 } }
    );

    if (!response.ok) {
      return NextResponse.json({ error: `CryptoCompare error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (data.Type !== 100 || !data.Data) {
      return NextResponse.json({ error: "Invalid CryptoCompare response" }, { status: 500 });
    }

    const items = data.Data.map((item: {
      id: string;
      title: string;
      body: string;
      url: string;
      source: string;
      published_on: number;
      categories: string;
      sentiment?: string;
    }) => ({
      id: item.id,
      title: item.title,
      description: item.body?.substring(0, 150) || "",
      url: item.url,
      source: item.source,
      publishedAt: new Date(item.published_on * 1000).toISOString(),
      sentiment: (item.sentiment as "positive" | "negative" | "neutral") || "neutral",
      category: item.categories?.split("|")[0]?.toLowerCase() || "crypto",
    }));

    return NextResponse.json(
      { Type: 100, Data: items },
      { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
