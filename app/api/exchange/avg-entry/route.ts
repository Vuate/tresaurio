// app/api/exchange/avg-entry/route.ts
// Get average entry price from trade history

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAvgEntryPrice } from "@/lib/services/exchangeService";
import { Exchange } from "@/lib/services/apiKeyService";

// GET /api/exchange/avg-entry?exchange=binance&symbol=BTCUSDT
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const exchange = searchParams.get("exchange") as Exchange | null;
    const symbol = searchParams.get("symbol");

    if (!exchange || !symbol) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: exchange, symbol" },
        { status: 400 }
      );
    }

    const avgPrice = await getAvgEntryPrice(session.user.id, exchange, symbol);

    return NextResponse.json({
      success: true,
      symbol,
      avgEntryPrice: avgPrice,
    });
  } catch (error) {
    console.error("[Avg Entry] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
