import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") ?? "BTCUSDT";

    const res = await fetch(
      `https://data-api.binance.vision/api/v3/ticker/price?symbol=${symbol}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "BINANCE_UPSTREAM_ERROR", status: res.status },
        { status: 502 }
      );
    }

    const json = await res.json();

    return NextResponse.json({
      symbol: json.symbol,
      price: json.price,
    });
  } catch (e) {
    console.error("BINANCE ROUTE ERROR", e);
    return NextResponse.json({ error: "BINANCE_TIMEOUT" }, { status: 500 });
  }
}
