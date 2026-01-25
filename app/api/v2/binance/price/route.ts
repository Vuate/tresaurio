import { NextRequest, NextResponse } from "next/server";
import { BinanceService } from "@/lib/api/binance/BinanceService";

/**
 * GET /api/v2/binance/price
 *
 * Get current price for a symbol
 *
 * Query params:
 * - symbol: Symbol to get price for (default: BTCUSDT)
 *
 * @example
 * /api/v2/binance/price?symbol=BTCUSDT
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const symbol = searchParams.get("symbol") || "BTCUSDT";

    const data = await BinanceService.getPrice(symbol.toUpperCase());

    return NextResponse.json({
      success: true,
      symbol: data.symbol,
      price: data.price,
    });
  } catch (error: any) {
    console.error("[Price API v2] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch price data",
      },
      { status: 500 },
    );
  }
}
