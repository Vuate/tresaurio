export async function GET() {
  try {
    // Binance BOOK TICKER
    const binanceRes = await fetch(
      "https://api.binance.com/api/v3/ticker/bookTicker?symbol=BTCUSDT",
      { cache: "no-store" }
    );
    const binance = await binanceRes.json();

    // OKX MARKET TICKER
    const okxRes = await fetch(
      "https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT",
      { cache: "no-store" }
    );
    const okx = (await okxRes.json()).data?.[0];

    // VERİ YOKSA GÜVENLİ DEFAULT
    if (!binance || !okx) {
      return Response.json({
        binance: null,
        okx: null,
      });
    }

    const result = {
      binance: {
        price: Number(binance.askPrice),
        spread:
          ((Number(binance.askPrice) - Number(binance.bidPrice)) /
            Number(binance.askPrice)) *
          100,
        stability: 95,
        volume: 12_400_000_000,
        freq: 287,
      },
      okx: {
        price: Number(okx.last),
        spread:
          ((Number(okx.askPx) - Number(okx.bidPx)) / Number(okx.last)) * 100,
        stability: 92,
        volume: Number(okx.vol24h),
        freq: 198,
      },
    };

    return Response.json(result);
  } catch (err) {
    console.error("COMPARISON ERROR:", err);

    // PATLAMA OLMASIN → AYNI ANAHTARLARLA SAFE DEFAULT
    return Response.json({
      binance: {
        price: 0,
        spread: 0,
        stability: 0,
        volume: 0,
        freq: 0,
      },
      okx: {
        price: 0,
        spread: 0,
        stability: 0,
        volume: 0,
        freq: 0,
      },
    });
  }
}
