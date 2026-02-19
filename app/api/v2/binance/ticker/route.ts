import { NextRequest, NextResponse } from "next/server";
import { BinanceService } from "@/lib/api/binance/BinanceService";

/**
 * GET /api/v2/binance/ticker
 *
 * Supports:
 * - /api/v2/binance/ticker?symbol=BTCUSDT
 * - /api/v2/binance/ticker?symbols=BTCUSDT,ETHUSDT
 * - /api/v2/binance/ticker (backward compatibility: returns all 24hr tickers)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const symbol = searchParams.get("symbol");
    const symbolsParam = searchParams.get("symbols");

    // ✅ KRİTİK FIX:
    // Eğer parametre yoksa 400 verme → tüm tickerları döndür
    // Çünkü projedeki bazı componentler parametresiz çağırıyor
    if (!symbol && !symbolsParam) {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr",
        {
          cache: "no-store",
          headers: { Accept: "application/json" },
        },
      );

      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: `Binance error: ${res.status}` },
          { status: 500 },
        );
      }

      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    // Single symbol
    if (symbol) {
      const data = await BinanceService.get24hrTicker(
        symbol.trim().toUpperCase(),
      );

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // Multiple symbols
    const symbols = (symbolsParam ?? "")
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    if (symbols.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid symbols parameter" },
        { status: 400 },
      );
    }

    const data = await BinanceService.get24hrTickers(symbols);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("[Ticker API v2] Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch ticker data";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
