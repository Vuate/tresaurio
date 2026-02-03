// app/api/exchange/positions/route.ts
// Get futures positions from exchange

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFuturesPositions, hasApiKey } from "@/lib/services/exchangeService";
import { Exchange } from "@/lib/services/apiKeyService";

// GET /api/exchange/positions?exchange=binance
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
    const label = searchParams.get("label") || undefined;

    if (!exchange) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: exchange" },
        { status: 400 }
      );
    }

    // Check if API key exists
    const hasKey = await hasApiKey(session.user.id, exchange);
    if (!hasKey) {
      return NextResponse.json(
        {
          success: false,
          error: `No API key configured for ${exchange}`,
          needsApiKey: true,
        },
        { status: 401 }
      );
    }

    const positions = await getFuturesPositions(session.user.id, exchange, label);

    return NextResponse.json({
      success: true,
      exchange,
      data: positions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Exchange Positions] GET Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Check for not implemented
    if (errorMessage.includes("not implemented")) {
      return NextResponse.json(
        { success: false, error: errorMessage, code: "NOT_IMPLEMENTED" },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
