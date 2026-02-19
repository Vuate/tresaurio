import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval") ?? "1m";
  const limit = searchParams.get("limit") ?? "30";

  if (!symbol) {
    return NextResponse.json(
      { success: false, error: "Missing parameter: 'symbol' is required" },
      { status: 400 },
    );
  }

  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(
      symbol.toUpperCase(),
    )}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(
      limit,
    )}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Binance error: ${res.status}` },
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch klines";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
