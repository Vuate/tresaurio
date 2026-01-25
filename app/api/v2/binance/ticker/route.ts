import { NextRequest, NextResponse } from "next/server";
import { BinanceService } from "@/lib/api/binance/BinanceService";

/**
 * GET /api/v2/binance/ticker
 *
 * Get 24hr ticker statistics for single or multiple symbols
 *
 * Query params:
 * - symbol: Single symbol (e.g., BTCUSDT)
 * - symbols: Multiple symbols comma-separated (e.g., BTCUSDT,ETHUSDT,SOLUSDT)
 *
 * @example
 * Single: /api/v2/binance/ticker?symbol=BTCUSDT
 * Multiple: /api/v2/binance/ticker?symbols=BTCUSDT,ETHUSDT,SOLUSDT
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const symbol = searchParams.get("symbol");
    const symbolsParam = searchParams.get("symbols");

    // Validate input
    if (!symbol && !symbolsParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing parameter: 'symbol' or 'symbols' is required",
        },
        { status: 400 },
      );
    }

    // Single symbol
    if (symbol) {
      const data = await BinanceService.get24hrTicker(symbol.toUpperCase());

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // Multiple symbols
    if (symbolsParam) {
      const symbols = symbolsParam
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      if (symbols.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid symbols parameter",
          },
          { status: 400 },
        );
      }

      const data = await BinanceService.get24hrTickers(symbols);

      return NextResponse.json({
        success: true,
        data,
      });
    }
  } catch (error: any) {
    console.error("[Ticker API v2] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch ticker data",
      },
      { status: 500 },
    );
  }
}
