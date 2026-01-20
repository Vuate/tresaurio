// components/terminal/personalized-dashboard/MarketEfficiencyModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface EfficiencyData {
  symbol: string;
  score: number;
  spread: number;
  depth: number;
  volume24h: number;
  volatility: number;
}

// 🔥 MOCK DATA
const MOCK_EFFICIENCY: EfficiencyData[] = [
  {
    symbol: "BTCUSDT",
    score: 95,
    spread: 0.02,
    depth: 8500000,
    volume24h: 28000000000,
    volatility: 2.5,
  },
  {
    symbol: "ETHUSDT",
    score: 92,
    spread: 0.03,
    depth: 4200000,
    volume24h: 15000000000,
    volatility: 3.2,
  },
  {
    symbol: "SOLUSDT",
    score: 78,
    spread: 0.08,
    depth: 850000,
    volume24h: 1200000000,
    volatility: 5.8,
  },
  {
    symbol: "XRPUSDT",
    score: 85,
    spread: 0.05,
    depth: 1500000,
    volume24h: 2800000000,
    volatility: 4.1,
  },
];

export default function MarketEfficiencyModule({ instanceId }: Props) {
  const [sortBy, setSortBy] = useState<"score" | "spread" | "volume">("score");

  const sortedData = [...MOCK_EFFICIENCY].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "spread":
        return a.spread - b.spread;
      case "volume":
        return b.volume24h - a.volume24h;
      default:
        return 0;
    }
  });

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
                    {data.spread}%
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
                    ${(data.volume24h / 1000000000).toFixed(1)}B
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Volatility:</span>
                  <span className="text-white ml-1 font-medium">
                    {data.volatility}%
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
      </div>
    </div>
  );
}
