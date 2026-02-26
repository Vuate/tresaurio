import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFuturesRealizedPnl, hasApiKey } from "@/lib/services/exchangeService";
import { Exchange } from "@/lib/services/apiKeyService";

// GET /api/exchange/realized-pnl?exchange=binance
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const exchange = searchParams.get("exchange") as Exchange | null;

    if (!exchange) {
      return NextResponse.json({ success: false, error: "Missing required parameter: exchange" }, { status: 400 });
    }

    const hasKey = await hasApiKey(session.user.id, exchange);
    if (!hasKey) {
      return NextResponse.json({ success: false, error: `No API key configured for ${exchange}`, needsApiKey: true }, { status: 401 });
    }

    const realizedPnl = await getFuturesRealizedPnl(session.user.id, exchange);

    return NextResponse.json({
      success: true,
      exchange,
      data: realizedPnl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Realized PnL] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
