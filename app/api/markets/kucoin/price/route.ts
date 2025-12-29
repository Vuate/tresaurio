import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "BTC-USDT";

  const res = await fetch(
    `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`,
    { cache: "no-store" }
  );

  const json = await res.json();

  return NextResponse.json({
    symbol,
    price: json.data.price,
  });
}
