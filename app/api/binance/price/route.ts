import { NextResponse } from "next/server";

export async function GET() {
  try {
    const symbols = [
      "BTCUSDT",
      "ETHUSDT",
      "BNBUSDT",
      "SOLUSDT",
      "XRPUSDT",
      "USDTUSD",
    ];

    const requests = symbols.map((symbol) =>
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`).then(
        (r) => r.json()
      )
    );

    const data = await Promise.all(requests);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Binance API ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Binance API connection error" },
      { status: 500 }
    );
  }
}
