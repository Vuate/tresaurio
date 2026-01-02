import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  const res = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
    { cache: "no-store" }
  );

  const json = await res.json();

  return NextResponse.json({
    symbol: json.symbol,
    price: json.price,
  });
}
