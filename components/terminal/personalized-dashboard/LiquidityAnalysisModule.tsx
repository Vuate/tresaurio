// components/terminal/personalized-dashboard/LiquidityAnalysisModule.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { useOrderBook } from "@/hooks";

interface Props {
  instanceId: string;
}

const MARKET_TYPES = [
  { id: "spot", name: "Spot" },
  { id: "futures", name: "Futures" },
] as const;

const POPULAR_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
];

export default function LiquidityAnalysisModule({ instanceId }: Props) {
  const storageKey = `liquidity-analysis-${instanceId}`;

  // State
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [symbol, setSymbol] = useState("BTCUSDT");

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.symbol) setSymbol(settings.symbol);
          if (settings.marketType) setMarketType(settings.marketType);
        } catch (err) {
          console.error("[LiquidityAnalysis] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ symbol, marketType }));
    }
  }, [symbol, marketType, storageKey]);

  // ✅ USE REAL WEBSOCKET DATA
  const { bids, asks, midPrice, loading, error, status } = useOrderBook({
    symbol,
    marketType,
    limit: 100, // Get deep order book for liquidity analysis
  });

  // ✅ REAL LIQUIDITY CALCULATION
  const liquidityData = useMemo(() => {
    if (!bids || !asks || bids.length === 0 || asks.length === 0 || midPrice === 0) {
      return null;
    }

    // Calculate total bid and ask volumes (in USDT)
    const bidVolume = bids.reduce((sum, level) => sum + level.price * level.quantity, 0);
    const askVolume = asks.reduce((sum, level) => sum + level.price * level.quantity, 0);
    const totalVolume = bidVolume + askVolume;

    // Order book imbalance
    const imbalance = totalVolume > 0 ? ((bidVolume - askVolume) / totalVolume) * 100 : 0;

    // Spread calculation
    const bestBid = bids[0]?.price || 0;
    const bestAsk = asks[0]?.price || 0;
    const spread = bestBid > 0 && bestAsk > 0 ? ((bestAsk - bestBid) / midPrice) * 100 : 0;

    // Market depth at ±1% and ±5% from mid price
    const range1Pct = midPrice * 0.01;
    const range5Pct = midPrice * 0.05;

    const depth1pct =
      bids.filter(b => midPrice - b.price <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

    const depth5pct =
      bids.filter(b => midPrice - b.price <= range5Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range5Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

    // Liquidity score based on 1% depth (normalized to $25M max)
    const liquidityScore = Math.min(100, (depth1pct / 25000000) * 100);

    // Rating
    let rating: "Excellent" | "Good" | "Fair" | "Poor";
    if (liquidityScore >= 80) rating = "Excellent";
    else if (liquidityScore >= 60) rating = "Good";
    else if (liquidityScore >= 40) rating = "Fair";
    else rating = "Poor";

    return {
      bidVolume,
      askVolume,
      totalVolume,
      imbalance,
      spread,
      depth1pct,
      depth5pct,
      liquidityScore,
      rating,
    };
  }, [bids, asks, midPrice]);

  return (
    <div className="space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">
            Liquidity Analysis
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-white/70">{symbol}</span>
          <span className="text-white/40"> • </span>
          <span
            className={
              status === "connected"
                ? "text-emerald-400"
                : status === "fallback"
                  ? "text-orange-400"
                  : "text-yellow-400"
            }
          >
            {status === "connected"
              ? "LIVE"
              : status === "fallback"
                ? "REST"
                : "CONNECTING"}
          </span>
        </div>

        <div className="flex gap-2">
          {/* Market Type Selector */}
          <select
            value={marketType}
            onChange={(e) => setMarketType(e.target.value as "spot" | "futures")}
            className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            {MARKET_TYPES.map((mt) => (
              <option key={mt.id} value={mt.id}>
                {mt.name}
              </option>
            ))}
          </select>

          {/* Symbol Selector */}
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            {POPULAR_SYMBOLS.map((sym) => (
              <option key={sym} value={sym}>
                {sym}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="px-3 py-8 rounded-lg bg-white/5 border border-white/10">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <div className="text-xs text-white/60">Loading liquidity data...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
          ❌ Error: {error}
        </div>
      )}

      {/* Liquidity Score Card */}
      {!loading && !error && liquidityData && (
        <div className="px-3 py-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white/50 text-[10px]">Liquidity Score</div>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-white">
              {liquidityData.liquidityScore.toFixed(0)}
            </div>
            <div
              className={`text-xs font-semibold ${
                liquidityData.rating === "Excellent"
                  ? "text-emerald-400"
                  : liquidityData.rating === "Good"
                  ? "text-blue-400"
                  : liquidityData.rating === "Fair"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {liquidityData.rating}
            </div>
          </div>
          <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${liquidityData.liquidityScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Volume Analysis */}
      {!loading && !error && liquidityData && (
        <>
          <div className="space-y-2">
            <div className="text-white/50 text-[10px] font-semibold uppercase">
              Volume Analysis
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white/50 text-[10px]">Bid Volume</div>
                <div className="text-emerald-400 font-semibold font-mono">
                  ${(liquidityData.bidVolume / 1000000).toFixed(2)}M
                </div>
              </div>

              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white/50 text-[10px]">Ask Volume</div>
                <div className="text-red-400 font-semibold font-mono">
                  ${(liquidityData.askVolume / 1000000).toFixed(2)}M
                </div>
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-white/50 text-[10px]">Total Volume</div>
              <div className="text-white font-semibold font-mono">
                ${(liquidityData.totalVolume / 1000000).toFixed(2)}M
              </div>
            </div>

            {/* Imbalance Bar */}
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="text-white/50 text-[10px]">
                  Order Book Imbalance
                </div>
                <div
                  className={`text-[10px] font-semibold ${
                    Math.abs(liquidityData.imbalance) > 10
                      ? "text-yellow-400"
                      : "text-white/70"
                  }`}
                >
                  {liquidityData.imbalance > 0 ? "+" : ""}
                  {liquidityData.imbalance.toFixed(2)}%
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500"
                  style={{ width: `${50 + liquidityData.imbalance / 2}%` }}
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${50 - liquidityData.imbalance / 2}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-white/40 mt-1">
                <span>Buy Pressure</span>
                <span>Sell Pressure</span>
              </div>
            </div>
          </div>

          {/* Depth Analysis */}
          <div className="space-y-2">
            <div className="text-white/50 text-[10px] font-semibold uppercase">
              Market Depth
            </div>

            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-1">
                <div className="text-white/50 text-[10px]">±1% Depth</div>
                <div className="text-white font-mono text-[11px]">
                  ${(liquidityData.depth1pct / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (liquidityData.depth1pct / 25000000) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-1">
                <div className="text-white/50 text-[10px]">±5% Depth</div>
                <div className="text-white font-mono text-[11px]">
                  ${(liquidityData.depth5pct / 1000000).toFixed(2)}M
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (liquidityData.depth5pct / 65000000) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <div className="text-white/50 text-[10px]">Spread</div>
                <div
                  className={`font-mono text-[11px] ${
                    liquidityData.spread < 0.03
                      ? "text-emerald-400"
                      : "text-yellow-400"
                  }`}
                >
                  {liquidityData.spread.toFixed(3)}%
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-start gap-2">
              {liquidityData.rating === "Excellent" ||
              liquidityData.rating === "Good" ? (
                <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              )}
              <div>
                <div className="text-white text-[10px] font-semibold mb-1">
                  Analysis
                </div>
                <div className="text-white/60 text-[10px] leading-relaxed">
                  {liquidityData.rating === "Excellent" &&
                    "Excellent liquidity with tight spreads. Ideal for large orders with minimal slippage."}
                  {liquidityData.rating === "Good" &&
                    "Good liquidity available. Suitable for most trading strategies with reasonable slippage."}
                  {liquidityData.rating === "Fair" &&
                    "Fair liquidity. Consider market impact when placing large orders."}
                  {liquidityData.rating === "Poor" &&
                    "Limited liquidity. Exercise caution with order sizes to avoid significant slippage."}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
