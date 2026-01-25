import { NextRequest, NextResponse } from "next/server";
import { BinanceService } from "@/lib/api/binance/BinanceService";

/**
 * GET /api/v2/binance/depth
 *
 * Get order book depth
 *
 * Query params:
 * - symbol: Symbol to get depth for (default: BTCUSDT)
 * - limit: Number of levels (5, 10, 20, 50, 100, 500, 1000, 5000) (default: 20)
 *
 * @example
 * /api/v2/binance/depth?symbol=BTCUSDT&limit=20
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const limitParam = searchParams.get("limit");

    // Validate limit
    const limit = limitParam ? Math.min(Number(limitParam), 5000) : 20;

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid limit parameter",
        },
        { status: 400 },
      );
    }

    const data = await BinanceService.getDepth(symbol.toUpperCase(), limit);

    return NextResponse.json({
      ok: true,
      symbol: symbol.toUpperCase(),
      lastUpdateId: data.lastUpdateId,
      bids: data.bids,
      asks: data.asks,
    });
  } catch (error: any) {
    console.error("[Depth API v2] Error:", error);

    const isTimeout = error.message.includes("timeout");

    return NextResponse.json(
      {
        ok: false,
        error: isTimeout ? "TIMEOUT" : "FETCH_FAILED",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
