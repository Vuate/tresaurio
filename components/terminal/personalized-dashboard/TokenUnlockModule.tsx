"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertTriangle } from "lucide-react";

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
    date: getNextUnlockDate(21),
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

function getNextUnlockDate(dayOfMonth: number): string {
  const now = new Date();
  let unlockDate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);

  if (unlockDate < now) {
    unlockDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
  }

  return unlockDate.toISOString().split("T")[0];
}

const COINGECKO_IDS: Record<string, string> = {
  ARB: "arbitrum",
  OP: "optimism",
  APT: "aptos",
  SUI: "sui",
  TIA: "celestia",
  WLD: "worldcoin-wld",
};

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ sortBy }));
    }
  }, [sortBy, storageKey]);

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
    const interval = setInterval(fetchData, 300000);
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
        return "text-muted-foreground bg-input";
    }
  };

  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    const unlockDate = new Date(dateStr);
    const diff = Math.ceil(
      (unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      <div className="relative z-50 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            <span className="hidden xs:inline">Token Unlocks</span>
            <span className="xs:hidden">Unlocks</span>
          </span>
          <span className="text-muted-foreground"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
        {(["date", "amount", "impact"] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`
              flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold
              border transition-all duration-150
              cursor-pointer
              ${
                sortBy === sort
                  ? "bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50"
                  : `
                  bg-secondary text-foreground border-border
                  hover:text-[#1A73E8]

                    `
              }
            `}
          >
            {sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      <div
        className="
          flex-1 min-h-0 space-y-1.5 sm:space-y-2
          overflow-y-auto
          px-1 sm:px-0

          [&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40          [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/50 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/60
          scrollbar-thin
scrollbar-thumb-foreground/40          scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
        "
      >
        {loading && data.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-muted-foreground text-[9px] sm:text-[10px]">
            Loading unlock data...
          </div>
        ) : (
          sortedUnlocks.map((unlock) => {
            const daysUntil = getDaysUntil(unlock.date);
            const value = unlock.amount * unlock.currentPrice;

            return (
              <div
                key={unlock.id}
                className="px-2 sm:px-3 py-2 sm:py-2 rounded-lg bg-input border border-border hover:bg-black/8 dark:hover:bg-white/8 transition-colors"
              >
                <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground text-[10px] sm:text-xs truncate">
                      {unlock.token}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground">
                      {unlock.symbol}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold flex-shrink-0 ml-2 ${getCategoryColor(
                      unlock.category
                    )}`}
                  >
                    {unlock.category}
                  </span>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex justify-between text-[10px] sm:text-[11px]">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5 sm:gap-2">
                      {new Date(unlock.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      <span
                        className={`text-[9px] sm:text-[10px] ${
                          daysUntil <= 7 ? "text-yellow-400" : "text-muted-foreground"
                        }`}
                      >
                        ({daysUntil}d)
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] sm:text-[11px]">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">
                      {(unlock.amount / 1000000).toFixed(1)}M {unlock.symbol}
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] sm:text-[11px]">
                    <span className="text-muted-foreground">Supply Impact</span>
                    <span
                      className={`font-bold ${
                        unlock.percentage > 5 ? "text-red-400" : "text-yellow-400"
                      }`}
                    >
                      +{unlock.percentage.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between text-[10px] sm:text-[11px]">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-medium text-foreground">
                      $
                      {value > 1000000000
                        ? (value / 1000000000).toFixed(2) + "B"
                        : (value / 1000000).toFixed(1) + "M"}
                    </span>
                  </div>

                  {/* Impact Warning */}
                  {unlock.percentage > 10 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-1.5 sm:p-2 mt-1 sm:mt-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-red-400">
<AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                        <span>High supply impact - potential price pressure</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}