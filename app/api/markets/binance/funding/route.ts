// app/api/markets/binance/funding/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mock data for fallback
const MOCK_FUNDING_DATA: Record<string, any> = {
  BTCUSDT: {
    symbol: "BTCUSDT",
    lastFundingRate: "0.00010000",
    nextFundingTime: Date.now() + 8 * 60 * 60 * 1000,
    markPrice: "95234.50",
    indexPrice: "95230.25",
  },
  ETHUSDT: {
    symbol: "ETHUSDT",
    lastFundingRate: "0.00008000",
    nextFundingTime: Date.now() + 8 * 60 * 60 * 1000,
    markPrice: "2156.30",
    indexPrice: "2155.80",
  },
  BNBUSDT: {
    symbol: "BNBUSDT",
    lastFundingRate: "0.00012000",
    nextFundingTime: Date.now() + 8 * 60 * 60 * 1000,
    markPrice: "615.20",
    indexPrice: "615.10",
  },
  SOLUSDT: {
    symbol: "SOLUSDT",
    lastFundingRate: "0.00015000",
    nextFundingTime: Date.now() + 8 * 60 * 60 * 1000,
    markPrice: "108.45",
    indexPrice: "108.40",
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  try {
    console.log("[Funding API] Attempting to fetch for symbol:", symbol);

    // Try to fetch from Binance
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(
      `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    ).catch((error) => {
      console.error("[Funding API] Fetch failed:", error.message);
      return null;
    });

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const data = await response.json();
      console.log("[Funding API] Successfully fetched from Binance");

      return NextResponse.json({
        ok: true,
        symbol: data.symbol,
        fundingRate: parseFloat(data.lastFundingRate),
        fundingTime: parseInt(data.nextFundingTime),
        markPrice: parseFloat(data.markPrice),
        indexPrice: parseFloat(data.indexPrice),
        source: "api",
      });
    }

    // Fallback to mock data
    console.log("[Funding API] Using mock data for:", symbol);
    const mockData = MOCK_FUNDING_DATA[symbol] || MOCK_FUNDING_DATA.BTCUSDT;

    return NextResponse.json({
      ok: true,
      symbol: mockData.symbol,
      fundingRate: parseFloat(mockData.lastFundingRate),
      fundingTime: mockData.nextFundingTime,
      markPrice: parseFloat(mockData.markPrice),
      indexPrice: parseFloat(mockData.indexPrice),
      source: "mock",
    });
  } catch (error: any) {
    console.error("[Funding API] Exception:", error.message);

    // Final fallback to mock data
    const mockData = MOCK_FUNDING_DATA[symbol] || MOCK_FUNDING_DATA.BTCUSDT;

    return NextResponse.json({
      ok: true,
      symbol: mockData.symbol,
      fundingRate: parseFloat(mockData.lastFundingRate),
      fundingTime: mockData.nextFundingTime,
      markPrice: parseFloat(mockData.markPrice),
      indexPrice: parseFloat(mockData.indexPrice),
      source: "mock",
    });
  }
}
