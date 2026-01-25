// components/terminal/personalized-dashboard/TokenUnlockModule.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

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

// Known token unlock schedules (static data with dynamic prices)
const UNLOCK_SCHEDULES: Omit<UnlockEvent, "currentPrice" | "id">[] = [
  {
    token: "Arbitrum",
    symbol: "ARB",
    date: getNextUnlockDate(21), // 21st of each month
    amount: 92650000,
    percentage: 0.93,
    category: "investors",
  },
  {
    token: "Optimism",
    symbol: "OP",
    date: getNextUnlockDate(30),
    amount: 31340000,
    percentage: 0.73,
    category: "ecosystem",
  },
  {
    token: "Aptos",
    symbol: "APT",
    date: getNextUnlockDate(12),
    amount: 11310000,
    percentage: 0.95,
    category: "team",
  },
  {
    token: "Sui",
    symbol: "SUI",
    date: getNextUnlockDate(1),
    amount: 64190000,
    percentage: 0.64,
    category: "ecosystem",
  },
  {
    token: "Celestia",
    symbol: "TIA",
    date: getNextUnlockDate(31),
    amount: 175740000,
    percentage: 17.4,
    category: "investors",
  },
  {
    token: "Worldcoin",
    symbol: "WLD",
    date: getNextUnlockDate(24),
    amount: 37230000,
    percentage: 0.53,
    category: "public",
  },
];

// Get next unlock date based on day of month
function getNextUnlockDate(dayOfMonth: number): string {
  const now = new Date();
  let unlockDate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);

  // If the date has passed this month, use next month
  if (unlockDate < now) {
    unlockDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
  }

  return unlockDate.toISOString().split("T")[0];
}

// Symbol mapping for CoinGecko
const COINGECKO_IDS: Record<string, string> = {
  ARB: "arbitrum",
  OP: "optimism",
  APT: "aptos",
  SUI: "sui",
  TIA: "celestia",
  WLD: "worldcoin-wld",
};

// 🔥 Fetch current prices from CoinGecko
const fetchTokenPrices = async (): Promise<Record<string, number>> => {
  const ids = Object.values(COINGECKO_IDS).join(",");

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const data = await res.json();

    const prices: Record<string, number> = {};
    for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
      prices[symbol] = data[geckoId]?.usd || 0;
    }

    return prices;
  } catch (err) {
    console.error("[TokenUnlock] Price fetch error:", err);

    // Fallback to Binance
    const fallbackPrices: Record<string, number> = {};
    for (const symbol of Object.keys(COINGECKO_IDS)) {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
        );
        const data = await res.json();
        fallbackPrices[symbol] = parseFloat(data.price) || 0;
      } catch {
        fallbackPrices[symbol] = 0;
      }
    }
    return fallbackPrices;
  }
};

// 🔥 Fetch unlock data with current prices
const fetchUnlockData = async (): Promise<UnlockEvent[]> => {
  const prices = await fetchTokenPrices();

  return UNLOCK_SCHEDULES.map((unlock, idx) => ({
    ...unlock,
    id: `unlock-${unlock.symbol}-${idx}`,
    currentPrice: prices[unlock.symbol] || 0,
  }));
};

export default function TokenUnlockModule({ instanceId }: Props) {
  const storageKey = `token-unlock-${instanceId}`;
  const [sortBy, setSortBy] = useState<"date" | "amount" | "impact">("date");
  const [data, setData] = useState<UnlockEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.sortBy) setSortBy(settings.sortBy);
        } catch (err) {
          console.error("[TokenUnlock] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ sortBy }));
    }
  }, [sortBy, storageKey]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchUnlockData();
      setData(result);
    } catch (err) {
      console.error("[TokenUnlock] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const sortedUnlocks = [...data].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount":
        return b.amount * b.currentPrice - a.amount * a.currentPrice;
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

  // Calculate days until unlock
  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    const unlockDate = new Date(dateStr);
    const diff = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🔓</div>
          <h3 className="font-semibold">Token Unlocks</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
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
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading unlock data...
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {sortedUnlocks.map((unlock) => {
              const daysUntil = getDaysUntil(unlock.date);
              const value = unlock.amount * unlock.currentPrice;

              return (
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
                      <span className="font-medium text-white flex items-center gap-2">
                        {new Date(unlock.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        <span className={`text-xs ${daysUntil <= 7 ? "text-yellow-400" : "text-white/40"}`}>
                          ({daysUntil}d)
                        </span>
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
                      <span className={`font-bold ${unlock.percentage > 5 ? "text-red-400" : "text-yellow-400"}`}>
                        +{unlock.percentage.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Value</span>
                      <span className="font-medium text-white">
                        ${value > 1000000000
                          ? (value / 1000000000).toFixed(2) + "B"
                          : (value / 1000000).toFixed(1) + "M"}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
