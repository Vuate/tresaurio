// lib/api/binance/test.ts (geçici test için)

import { BinanceService } from "./BinanceService";

async function testBinanceService() {
  console.log("🧪 Testing BinanceService...\n");

  try {
    // Test 1: Get single price
    console.log("1️⃣ Testing getPrice...");
    const price = await BinanceService.getPrice("BTCUSDT");
    console.log("✅ Price:", price);

    // Test 2: Get 24hr ticker
    console.log("\n2️⃣ Testing get24hrTicker...");
    const ticker = await BinanceService.get24hrTicker("ETHUSDT");
    console.log(
      "✅ Ticker:",
      ticker.symbol,
      ticker.lastPrice,
      ticker.priceChangePercent,
    );

    // Test 3: Get multiple tickers
    console.log("\n3️⃣ Testing get24hrTickers...");
    const tickers = await BinanceService.get24hrTickers([
      "BTCUSDT",
      "ETHUSDT",
      "SOLUSDT",
    ]);
    console.log(
      "✅ Tickers:",
      tickers.map((t) => `${t.symbol}: $${t.lastPrice}`),
    );

    // Test 4: Get depth
    console.log("\n4️⃣ Testing getDepth...");
    const depth = await BinanceService.getDepth("BTCUSDT", 5);
    console.log("✅ Depth:", {
      bids: depth.bids.length,
      asks: depth.asks.length,
      topBid: depth.bids[0],
      topAsk: depth.asks[0],
    });

    // Test 5: Cache stats
    console.log("\n5️⃣ Cache Stats:");
    console.log(BinanceService.getCacheStats());

    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testBinanceService();
