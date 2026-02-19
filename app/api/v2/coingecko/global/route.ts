import { NextResponse } from "next/server";

export async function GET() {
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/global", {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!r.ok) {
      return NextResponse.json(
        { success: false, error: `CoinGecko error: ${r.status}` },
        { status: 500 }
      );
    }

    const data = await r.json();
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
