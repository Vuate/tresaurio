"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Lock, Gift, Sprout, Coins } from "lucide-react";

interface Props {
  instanceId: string;
}

interface RewardEvent {
  id: string;
  date: string;
  token: string;
  amount: number;
  type: "staking" | "airdrop" | "farming";
  apr: number;
  protocol?: string;
}

// Helper to get dynamic dates
function getDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
}

// Sample staking rewards data (user would configure their own)
const DEFAULT_REWARDS: Omit<RewardEvent, "id">[] = [
  {
    date: getDate(2),
    token: "ETH",
    amount: 0.025,
    type: "staking",
    apr: 4.5,
    protocol: "Lido",
  },
  {
    date: getDate(5),
    token: "SOL",
    amount: 2.5,
    type: "staking",
    apr: 7.2,
    protocol: "Marinade",
  },
  {
    date: getDate(8),
    token: "USDC",
    amount: 125,
    type: "farming",
    apr: 12.5,
    protocol: "Aave",
  },
  {
    date: getDate(10),
    token: "ARB",
    amount: 500,
    type: "airdrop",
    apr: 0,
    protocol: "Arbitrum",
  },
  {
    date: getDate(14),
    token: "MATIC",
    amount: 45,
    type: "staking",
    apr: 5.8,
    protocol: "Polygon",
  },
];

//  Fetch current token prices for value calculation
const fetchTokenPrices = async (tokens: string[]): Promise<Record<string, number>> => {
  const prices: Record<string, number> = {};

  try {
    // Fetch from Binance
    const promises = tokens.map(async (token) => {
      try {
        const symbol = token === "USDC" ? "USDCUSDT" : `${token}USDT`;
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const data = await res.json();
        prices[token] = parseFloat(data.price) || (token === "USDC" ? 1 : 0);
      } catch {
        prices[token] = token === "USDC" ? 1 : 0;
      }
    });

    await Promise.all(promises);
  } catch (err) {
    console.error("[RewardCalendar] Price fetch error:", err);
  }

  return prices;
};

export default function RewardCalendarModule({ instanceId }: Props) {
  const storageKey = `reward-calendar-${instanceId}`;
  const [filter, setFilter] = useState<"all" | "staking" | "airdrop" | "farming">("all");
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize rewards with IDs
  useEffect(() => {
    const initialRewards = DEFAULT_REWARDS.map((r, idx) => ({
      ...r,
      id: `reward-${idx}`,
    }));
    setRewards(initialRewards);
  }, []);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.filter) setFilter(settings.filter);
        } catch (err) {
          console.error("[RewardCalendar] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ filter }));
    }
  }, [filter, storageKey]);

  // Fetch token prices
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const tokens = [...new Set(rewards.map(r => r.token))];
      const fetchedPrices = await fetchTokenPrices(tokens);
      setPrices(fetchedPrices);
    } catch (err) {
      console.error("[RewardCalendar] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [rewards]);

  useEffect(() => {
    if (rewards.length > 0) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 3600000); // Refresh every 1 hour
      return () => clearInterval(interval);
    }
  }, [fetchPrices, rewards.length]);

  const filteredRewards = rewards
    .filter((r) => filter === "all" || r.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTypeColor = (type: string) => {
    switch (type) {
      case "staking":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "airdrop":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "farming":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "text-white/60 bg-white/5 border-white/10";
    }
  };

  const getTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4 sm:w-[18px] sm:h-[18px]";
    switch (type) {
      case "staking":
        return <Lock className={iconClass} />;
      case "airdrop":
        return <Gift className={iconClass} />;
      case "farming":
        return <Sprout className={iconClass} />;
      default:
        return <Coins className={iconClass} />;
    }
  };

  // Calculate days until reward
  const getDaysUntil = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Calculate total estimated value
  const totalValue = filteredRewards.reduce((sum, r) => {
    const price = prices[r.token] || 0;
    return sum + r.amount * price;
  }, 0);

  return (
    <div ref={containerRef} className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      <div className="relative z-50 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-white/60 whitespace-nowrap">
          <span className="font-semibold text-white/90">
            <span className="hidden xs:inline">Reward Calendar</span>
            <span className="xs:hidden">Rewards</span>
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>

        <div className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold flex-shrink-0 whitespace-nowrap">
          PERSONAL
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0">
        {(["all", "staking", "airdrop", "farming"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-[calc(50%-0.5rem)]
              py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold
              border transition-all duration-150
              cursor-pointer
              whitespace-nowrap
              ${
                filter === f
                  ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                  : `
                      bg-white/10 text-white border-white/10
                      hover:bg-teal-500/15
                      hover:border-teal-400/40
                      hover:text-teal-400
                      hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
                    `
              }
            `}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div
        className="
          flex-1 min-h-0
          overflow-y-auto overflow-x-hidden
          px-1 sm:px-0

          [&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {loading && rewards.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-[10px] sm:text-xs">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin text-lg sm:text-xl">⏳</div>
              <span>Loading rewards...</span>
            </div>
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white/40">
              <div className="text-2xl sm:text-4xl mb-2">📭</div>
              <div className="text-[10px] sm:text-sm">No rewards scheduled</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-1.5 sm:gap-2">
            {filteredRewards.map((reward) => {
              const daysUntil = getDaysUntil(reward.date);
              const price = prices[reward.token] || 0;
              const value = reward.amount * price;

              return (
                <div
                  key={reward.id}
                  className="px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="flex-shrink-0 text-white/60">
                      {getTypeIcon(reward.type)}
                    </span>
                    <div className="font-semibold text-white text-xs sm:text-sm leading-tight">
                      {reward.token}
                    </div>
                  </div>

                  <div className="mb-2">
                    <span
                      className={`inline-block text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border font-semibold uppercase leading-tight whitespace-nowrap ${getTypeColor(reward.type)}`}
                    >
                      {reward.type}
                    </span>
                  </div>

                  <div className="text-[9px] sm:text-[10px] text-white/60 leading-tight mb-2">
                    {new Date(reward.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    <span className={`ml-1 ${daysUntil <= 3 ? "text-yellow-400 font-semibold" : "text-white/40"}`}>
                      ({daysUntil}d)
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="text-[9px] sm:text-[10px] text-white/50 mb-0.5 leading-tight">Amount</div>
                    <div className="text-sm sm:text-base font-bold text-emerald-400 leading-tight">
                      +{reward.amount.toLocaleString()} {reward.token}
                    </div>
                    {price > 0 && (
                      <div className="text-[9px] sm:text-[10px] text-white/40 leading-tight mt-0.5">
                        ≈ ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>

                  {reward.apr > 0 && (
                    <div className="mb-1.5">
                      <div className="text-[9px] sm:text-[10px] text-white/50 mb-0.5 leading-tight">APR</div>
                      <div className="text-xs sm:text-sm font-semibold text-blue-400 leading-tight">
                        {reward.apr}%
                      </div>
                    </div>
                  )}

                  {reward.protocol && (
                    <div className="pt-1.5 border-t border-white/5">
                      <div className="text-[9px] sm:text-[10px] text-white/40 leading-tight">
                        📍 {reward.protocol}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-white/10 bg-white/5 rounded-lg">
        <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2">
          <div className="flex-1 min-w-[100px]">
            <div className="text-[9px] sm:text-[10px] text-white/50 mb-0.5 sm:mb-1 leading-tight">Total Upcoming</div>
            <div className="text-xs sm:text-sm font-semibold text-white leading-tight">
              {filteredRewards.length} rewards
            </div>
          </div>
          {totalValue > 0 && (
            <div className="text-right flex-shrink-0">
              <div className="text-[9px] sm:text-[10px] text-white/50 mb-0.5 sm:mb-1 leading-tight">Est. Value</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 leading-tight">
                ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}