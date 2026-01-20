// components/terminal/personalized-dashboard/TokenUnlockModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface UnlockEvent {
  id: string;
  token: string;
  symbol: string;
  date: string;
  amount: number;
  percentage: number;
  category: "team" | "investors" | "ecosystem" | "public";
  currentPrice: number;
}

// 🔥 MOCK DATA
const MOCK_UNLOCKS: UnlockEvent[] = [
  {
    id: "1",
    token: "Arbitrum",
    symbol: "ARB",
    date: "2026-01-21",
    amount: 1200000000,
    percentage: 12.5,
    category: "investors",
    currentPrice: 1.25,
  },
  {
    id: "2",
    token: "Optimism",
    symbol: "OP",
    date: "2026-01-28",
    amount: 800000000,
    percentage: 8.3,
    category: "ecosystem",
    currentPrice: 2.15,
  },
  {
    id: "3",
    token: "Aptos",
    symbol: "APT",
    date: "2026-02-05",
    amount: 500000000,
    percentage: 15.2,
    category: "team",
    currentPrice: 8.5,
  },
  {
    id: "4",
    token: "Sui",
    symbol: "SUI",
    date: "2026-02-10",
    amount: 300000000,
    percentage: 6.7,
    category: "public",
    currentPrice: 1.8,
  },
];

export default function TokenUnlockModule({ instanceId }: Props) {
  const [sortBy, setSortBy] = useState<"date" | "amount" | "impact">("date");

  const sortedUnlocks = [...MOCK_UNLOCKS].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount":
        return b.amount - a.amount;
      case "impact":
        return b.percentage - a.percentage;
      default:
        return 0;
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "team":
        return "text-red-400 bg-red-500/10";
      case "investors":
        return "text-yellow-400 bg-yellow-500/10";
      case "ecosystem":
        return "text-blue-400 bg-blue-500/10";
      case "public":
        return "text-emerald-400 bg-emerald-500/10";
      default:
        return "text-white/60 bg-white/5";
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🔓</div>
          <h3 className="font-semibold">Token Unlocks</h3>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["date", "amount", "impact"] as const).map((sort) => (
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
          {sortedUnlocks.map((unlock) => (
            <div
              key={unlock.id}
              className="p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-white">{unlock.token}</div>
                  <div className="text-xs text-white/60">{unlock.symbol}</div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${getCategoryColor(unlock.category)}`}
                >
                  {unlock.category}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Date</span>
                  <span className="font-medium text-white">
                    {new Date(unlock.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Amount</span>
                  <span className="font-medium text-white">
                    {(unlock.amount / 1000000).toFixed(1)}M {unlock.symbol}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Supply Impact</span>
                  <span className="font-bold text-red-400">
                    +{unlock.percentage}%
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Value</span>
                  <span className="font-medium text-white">
                    $
                    {((unlock.amount * unlock.currentPrice) / 1000000).toFixed(
                      1,
                    )}
                    M
                  </span>
                </div>

                {/* Impact Warning */}
                {unlock.percentage > 10 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-red-400">
                      <span>⚠️</span>
                      <span>High supply impact - potential price pressure</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
