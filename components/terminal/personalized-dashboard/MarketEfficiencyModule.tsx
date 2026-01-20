// components/terminal/personalized-dashboard/MarketEfficiencyModule.tsx

import { useState, useMemo, useEffect } from "react";
import { useOrderBook, useTicker } from "@/hooks";

interface Props {
  instanceId: string;
}

interface EfficiencyData {
  symbol: string;
  score: number;
  spread: number;
  spreadPercent: number;
  depth: number;
  volume24h: number;
  volatility: number;
  loading: boolean;
}

const TRACKED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

// Component for tracking a single symbol's efficiency
function SymbolEfficiencyTracker({
  symbol,
  marketType,
}: {
  symbol: string;
  marketType: "spot" | "futures";
}) {
  // Get order book data
  const { bids, asks, spread, spreadPercent, midPrice, loading: obLoading } = useOrderBook({
    symbol,
    marketType,
    limit: 50,
  });

  // Get ticker data
  const { data: ticker, loading: tickerLoading } = useTicker({
    symbol,
    marketType,
  });

  const loading = obLoading || tickerLoading;

  // Calculate efficiency metrics
  const efficiency = useMemo(() => {
    if (loading || !bids || !asks || !ticker || bids.length === 0 || asks.length === 0) {
      return null;
    }

    // Calculate depth (total value within ±1% of mid price)
    const range1Pct = midPrice * 0.01;
    const depth =
      bids.filter(b => midPrice - b.price <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

    // Calculate volatility (24h high-low range as % of current price)
    const volatility = ticker.lastPrice > 0
      ? ((ticker.highPrice - ticker.lowPrice) / ticker.lastPrice) * 100
      : 0;

    // Calculate efficiency score (0-100)
    // Factors: tight spread (30%), high depth (30%), high volume (20%), low volatility (20%)
    const spreadScore = Math.max(0, 100 - (spreadPercent * 1000)); // Tight spread = high score
    const depthScore = Math.min(100, (depth / 10000000) * 100); // $10M depth = 100 score
    const volumeScore = Math.min(100, (ticker.quoteVolume / 1000000000) * 50); // $1B volume = 50 score
    const volatilityScore = Math.max(0, 100 - (volatility * 10)); // Low volatility = high score

    const score = Math.round(
      spreadScore * 0.3 +
      depthScore * 0.3 +
      volumeScore * 0.2 +
      volatilityScore * 0.2
    );

    return {
      symbol,
      score,
      spread,
      spreadPercent,
      depth,
      volume24h: ticker.quoteVolume,
      volatility,
      loading: false,
    };
  }, [symbol, bids, asks, ticker, midPrice, spreadPercent, loading]);

  return efficiency;
}

export default function MarketEfficiencyModule({ instanceId }: Props) {
  const storageKey = `market-efficiency-${instanceId}`;

  const [sortBy, setSortBy] = useState<"score" | "spread" | "volume">("score");
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.marketType) setMarketType(settings.marketType);
          if (settings.sortBy) setSortBy(settings.sortBy);
        } catch (err) {
          console.error("[MarketEfficiency] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ marketType, sortBy }));
    }
  }, [marketType, sortBy, storageKey]);

  // Track all symbols
  const btcData = SymbolEfficiencyTracker({ symbol: "BTCUSDT", marketType });
  const ethData = SymbolEfficiencyTracker({ symbol: "ETHUSDT", marketType });
  const solData = SymbolEfficiencyTracker({ symbol: "SOLUSDT", marketType });
  const bnbData = SymbolEfficiencyTracker({ symbol: "BNBUSDT", marketType });
  const xrpData = SymbolEfficiencyTracker({ symbol: "XRPUSDT", marketType });
  const adaData = SymbolEfficiencyTracker({ symbol: "ADAUSDT", marketType });

  const allData = useMemo(() => {
    return [btcData, ethData, solData, bnbData, xrpData, adaData].filter(
      (d): d is EfficiencyData => d !== null
    );
  }, [btcData, ethData, solData, bnbData, xrpData, adaData]);

  const sortedData = useMemo(() => {
    return [...allData].sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "spread":
          return a.spreadPercent - b.spreadPercent;
        case "volume":
          return b.volume24h - a.volume24h;
        default:
          return 0;
      }
    });
  }, [allData, sortBy]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">⚡</div>
          <h3 className="font-semibold">Market Efficiency</h3>
        </div>

        {/* Market Type Toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setMarketType("spot")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              marketType === "spot"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Spot
          </button>
          <button
            onClick={() => setMarketType("futures")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              marketType === "futures"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Futures
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["score", "spread", "volume"] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              sortBy === sort
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {sortedData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <div className="text-xs text-white/60">Loading market data...</div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {sortedData.map((data) => (
              <div
                key={data.symbol}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium text-white">
                    {data.symbol.replace("USDT", "")}/USDT
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold ${getScoreColor(data.score)}`}
                    >
                      {data.score}
                    </span>
                    <span className="text-xs text-white/60">
                      {getScoreLabel(data.score)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-white/60">Spread:</span>
                    <span className="text-white ml-1 font-medium">
                      {data.spreadPercent.toFixed(3)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Depth:</span>
                    <span className="text-white ml-1 font-medium">
                      ${(data.depth / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Volume:</span>
                    <span className="text-white ml-1 font-medium">
                      ${(data.volume24h / 1000000000).toFixed(2)}B
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Volatility:</span>
                    <span className="text-white ml-1 font-medium">
                      {data.volatility.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        data.score >= 90
                          ? "bg-emerald-500"
                          : data.score >= 70
                            ? "bg-blue-500"
                            : data.score >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      } transition-all`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
