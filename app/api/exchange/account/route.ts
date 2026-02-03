// app/api/exchange/account/route.ts
// Get spot balances from exchange

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSpotBalances, hasApiKey } from "@/lib/services/exchangeService";
import { Exchange } from "@/lib/services/apiKeyService";

// GET /api/exchange/account?exchange=binance
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

    const balances = await getSpotBalances(session.user.id, exchange, label);

    return NextResponse.json({
      success: true,
      exchange,
      data: balances,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Exchange Account] GET Error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Check for common API errors
    if (errorMessage.includes("Invalid API")) {
      return NextResponse.json(
        { success: false, error: "Invalid API key or secret", code: "INVALID_API_KEY" },
        { status: 401 }
      );
    }

    if (errorMessage.includes("IP")) {
      return NextResponse.json(
        { success: false, error: "IP not whitelisted on exchange", code: "IP_NOT_WHITELISTED" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
