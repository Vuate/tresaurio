// components/terminal/personalized-dashboard/ICOCalendarModule.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  instanceId: string;
}

interface ICOEvent {
  id: string;
  name: string;
  symbol: string;
  date: string;
  price: number;
  chain: string;
  status: "upcoming" | "live" | "ended";
  raised: number;
  target: number;
  category?: string;
}

// 🔥 Fetch recent raises from DeFiLlama
const fetchRecentRaises = async (): Promise<ICOEvent[]> => {
  const results: ICOEvent[] = [];

  try {
    // Fetch recent raises from DeFiLlama
    const res = await fetch("https://api.llama.fi/raises");
    const data = await res.json();

    // Get raises from last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const recentRaises = data.raises
      ?.filter((r: any) => r.date * 1000 > thirtyDaysAgo)
      .slice(0, 20) || [];

    for (const raise of recentRaises) {
      const raiseDate = new Date(raise.date * 1000);
      const now = new Date();

      // Determine status based on date
      let status: "upcoming" | "live" | "ended" = "ended";
      if (raiseDate > now) {
        status = "upcoming";
      } else if (now.getTime() - raiseDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        status = "live"; // Within last 7 days
      }

      results.push({
        id: `raise-${raise.name}-${raise.date}`,
        name: raise.name || "Unknown Project",
        symbol: raise.symbol || "---",
        date: raiseDate.toISOString().split("T")[0],
        price: 0, // TGE price not available from this API
        chain: raise.chains?.[0] || raise.category || "Multi-chain",
        status,
        raised: raise.amount || 0,
        target: raise.amount || 0, // Target usually equals raised for completed rounds
        category: raise.category,
      });
    }

    // Sort by date (most recent first)
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error("[ICOCalendar] Fetch error:", err);
    return [];
  }
};

// Fallback: Known upcoming launchpad events (manually maintained)
const UPCOMING_LAUNCHPADS: Omit<ICOEvent, "id">[] = [
  {
    name: "Movement Labs",
    symbol: "MOVE",
    date: getFutureDate(7),
    price: 0.02,
    chain: "Ethereum",
    status: "upcoming",
    raised: 38000000,
    target: 50000000,
  },
  {
    name: "Monad",
    symbol: "MON",
    date: getFutureDate(14),
    price: 0,
    chain: "Monad",
    status: "upcoming",
    raised: 225000000,
    target: 225000000,
  },
  {
    name: "Berachain",
    symbol: "BERA",
    date: getFutureDate(21),
    price: 0,
    chain: "Cosmos",
    status: "upcoming",
    raised: 142000000,
    target: 142000000,
  },
];

function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
}

export default function ICOCalendarModule({ instanceId }: Props) {
  const storageKey = `ico-calendar-${instanceId}`;
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "ended">("all");
  const [data, setData] = useState<ICOEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.filter) setFilter(settings.filter);
        } catch (err) {
          console.error("[ICOCalendar] Failed to load settings:", err);
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

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const raises = await fetchRecentRaises();

      // Combine with upcoming launchpads
      const upcomingWithIds = UPCOMING_LAUNCHPADS.map((ico, idx) => ({
        ...ico,
        id: `upcoming-${idx}`,
      }));

      // Filter out duplicates
      const combined = [...upcomingWithIds];
      for (const raise of raises) {
        if (!combined.some(c => c.name.toLowerCase() === raise.name.toLowerCase())) {
          combined.push(raise);
        }
      }

      setData(combined);
    } catch (err) {
      console.error("[ICOCalendar] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 600000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredICOs = data.filter(
    (ico) => filter === "all" || ico.status === filter,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "text-emerald-400 bg-emerald-500/10";
      case "upcoming":
        return "text-blue-400 bg-blue-500/10";
      case "ended":
        return "text-white/40 bg-white/5";
      default:
        return "text-white/60 bg-white/5";
    }
  };

  const getProgressPercent = (raised: number, target: number) => {
    if (target === 0) return 100;
    return Math.min((raised / target) * 100, 100);
  };

  // Calculate days until/since
  const getDaysLabel = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `in ${diffDays}d`;
    if (diffDays === 0) return "Today";
    return `${Math.abs(diffDays)}d ago`;
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🚀</div>
          <h3 className="font-semibold">ICO Calendar</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["all", "live", "upcoming", "ended"] as const).map((f) => (
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
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading ICO data...
          </div>
        ) : filteredICOs.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            <div className="text-4xl mb-2">🚫</div>
            <div className="text-sm">No ICOs found</div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredICOs.map((ico) => (
              <div
                key={ico.id}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-white">{ico.name}</div>
                    <div className="text-xs text-white/60 flex items-center gap-2 mt-1">
                      <span>{ico.symbol}</span>
                      <span>•</span>
                      <span>{ico.chain}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(ico.status)}`}
                  >
                    {ico.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {ico.price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Price</span>
                      <span className="font-medium text-white">${ico.price}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Date</span>
                    <span className="font-medium text-white flex items-center gap-2">
                      {new Date(ico.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      <span className={`text-xs ${ico.status === "upcoming" ? "text-blue-400" : "text-white/40"}`}>
                        ({getDaysLabel(ico.date)})
                      </span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {ico.raised > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Raised: ${(ico.raised / 1000000).toFixed(1)}M</span>
                        {ico.target !== ico.raised && (
                          <span>Target: ${(ico.target / 1000000).toFixed(1)}M</span>
                        )}
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                          style={{
                            width: `${getProgressPercent(ico.raised, ico.target)}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-right text-white/60 mt-1">
                        {getProgressPercent(ico.raised, ico.target).toFixed(0)}%
                      </div>
                    </div>
                  )}

                  {ico.category && (
                    <div className="text-xs text-white/40">
                      Category: {ico.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
