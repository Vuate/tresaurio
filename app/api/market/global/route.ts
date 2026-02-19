import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/global", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // 60 saniye cache
    });

    if (!res.ok) {
      throw new Error("CoinGecko API error");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch CoinGecko global data" },
      { status: 500 }
    );
  }
}
