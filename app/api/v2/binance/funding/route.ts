import { NextRequest, NextResponse } from "next/server";
import { BinanceService } from "@/lib/api/binance/BinanceService";

/**
 * GET /api/v2/binance/funding
 *
 * Get futures funding rate and premium index
 *
 * Query params:
 * - symbol: Futures symbol (default: BTCUSDT)
 *
 * @example
 * /api/v2/binance/funding?symbol=BTCUSDT
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  try {
    const data = await BinanceService.getFundingRate(symbol.toUpperCase());

    return NextResponse.json({
      ok: true,
      symbol: data.symbol,
      fundingRate: parseFloat(data.lastFundingRate),
      fundingTime: data.nextFundingTime,
      markPrice: parseFloat(data.markPrice),
      indexPrice: parseFloat(data.indexPrice),
      source: "api",
    });
  } catch (error: any) {
    console.error("[Funding API v2] Error:", error);

    // Fallback to mock data (same as old endpoint)
    const MOCK_DATA = {
      BTCUSDT: {
        symbol: "BTCUSDT",
        fundingRate: 0.0001,
        fundingTime: Date.now() + 8 * 60 * 60 * 1000,
        markPrice: 91000,
        indexPrice: 90995,
      },
      ETHUSDT: {
        symbol: "ETHUSDT",
        fundingRate: 0.00008,
        fundingTime: Date.now() + 8 * 60 * 60 * 1000,
        markPrice: 3100,
        indexPrice: 3098,
      },
    };

    const symbolUpper = symbol.toUpperCase();
    const mockData =
      MOCK_DATA[symbolUpper as keyof typeof MOCK_DATA] || MOCK_DATA.BTCUSDT;

    return NextResponse.json({
      ok: true,
      ...mockData,
      source: "mock",
    });
  }
}
