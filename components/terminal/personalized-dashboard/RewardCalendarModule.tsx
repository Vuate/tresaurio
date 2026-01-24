// components/terminal/personalized-dashboard/RewardCalendarModule.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

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

// 🔥 Fetch current token prices for value calculation
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
      const interval = setInterval(fetchPrices, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [fetchPrices, rewards.length]);

  const filteredRewards = rewards
    .filter((r) => filter === "all" || r.type === filter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getTypeColor = (type: string) => {
    switch (type) {
      case "staking":
        return "text-blue-400 bg-blue-500/10";
      case "airdrop":
        return "text-purple-400 bg-purple-500/10";
      case "farming":
        return "text-emerald-400 bg-emerald-500/10";
      default:
        return "text-white/60 bg-white/5";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "staking":
        return "🔒";
      case "airdrop":
        return "🎁";
      case "farming":
        return "🌾";
      default:
        return "💰";
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
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📅</div>
          <h3 className="font-semibold">Reward Calendar</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
            PERSONAL
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["all", "staking", "airdrop", "farming"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading && rewards.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading rewards...
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-sm">No rewards scheduled</div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredRewards.map((reward) => {
              const daysUntil = getDaysUntil(reward.date);
              const price = prices[reward.token] || 0;
              const value = reward.amount * price;

              return (
                <div
                  key={reward.id}
                  className="p-3 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(reward.type)}</span>
                      <div>
                        <div className="font-medium text-white">
                          {reward.token}
                        </div>
                        <div className="text-xs text-white/60 flex items-center gap-1">
                          {new Date(reward.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          <span className={`${daysUntil <= 3 ? "text-yellow-400" : "text-white/40"}`}>
                            ({daysUntil}d)
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${getTypeColor(reward.type)}`}
                    >
                      {reward.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white/60">Amount</div>
                      <div className="text-lg font-bold text-emerald-400">
                        +{reward.amount.toLocaleString()} {reward.token}
                      </div>
                      {price > 0 && (
                        <div className="text-xs text-white/40">
                          ≈ ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {reward.apr > 0 && (
                        <>
                          <div className="text-xs text-white/60">APR</div>
                          <div className="text-sm font-medium text-blue-400">
                            {reward.apr}%
                          </div>
                        </>
                      )}
                      {reward.protocol && (
                        <div className="text-xs text-white/40 mt-1">
                          {reward.protocol}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-white/60 mb-1">Total Upcoming</div>
            <div className="text-sm font-medium text-white">
              {filteredRewards.length} rewards
            </div>
          </div>
          {totalValue > 0 && (
            <div className="text-right">
              <div className="text-xs text-white/60 mb-1">Est. Value</div>
              <div className="text-sm font-bold text-emerald-400">
                ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
