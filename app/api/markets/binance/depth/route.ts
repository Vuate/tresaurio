import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = (searchParams.get("symbol") || "BTCUSDT").toUpperCase();
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 8000);

  try {
    // Binance "vision" domain (çoğu ortamda daha stabil)
    const url = `https://data-api.binance.vision/api/v3/depth?symbol=${symbol}&limit=${limit}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: "UPSTREAM_ERROR", status: res.status },
        { status: 502 }
      );
    }

    const data = await res.json();

    // data: { lastUpdateId, bids: [[price, qty]], asks: [[price, qty]] }
    return NextResponse.json({ ok: true, symbol, ...data }, { status: 200 });
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "TIMEOUT" : "FETCH_FAILED";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  } finally {
    clearTimeout(t);
  }
}
