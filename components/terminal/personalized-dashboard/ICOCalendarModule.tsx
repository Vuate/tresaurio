"use client";

import { useState, useEffect, useCallback } from "react";
import { Gem } from "lucide-react";

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

//  Fetch recent raises from DeFiLlama
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

    if (diffDays > 0) return diffDays;
    if (diffDays === 0) return 0;
    return Math.abs(diffDays);
  };

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      <div className="relative z-50 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-white/60">
          <span className="font-semibold text-white/90">
            <span className="hidden xs:inline">ICO Calendar</span>
            <span className="xs:hidden">ICO</span>
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
        {(["all", "live", "upcoming", "ended"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold
              border transition-all duration-150
              cursor-pointer
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
          flex-1 min-h-0 space-y-1.5 sm:space-y-2
          overflow-y-auto
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
        {loading && data.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-white/40 text-[9px] sm:text-[10px]">
            Loading ICO data...
          </div>
        ) : filteredICOs.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-white/40 text-[9px] sm:text-[10px]">
            No ICOs found
          </div>
        ) : (
          filteredICOs.map((ico) => {
            const daysLabel = getDaysLabel(ico.date);
            const isUpcoming = new Date(ico.date) > new Date();

            return (
              <div
                key={ico.id}
                className="px-2 sm:px-3 py-2 sm:py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
              >
            <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="font-semibold text-white text-[10px] sm:text-xs truncate">
                  {ico.name}
                </div>
                <div className="text-[9px] sm:text-[10px] text-white/40 truncate">
                  {ico.symbol} • {ico.chain}
                </div>
              </div>
              <span
                className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold flex-shrink-0 ${getStatusColor(ico.status)}`}
              >
                {ico.status}
              </span>
            </div>
                <div className="space-y-1 sm:space-y-1.5">
                  {ico.price > 0 && (
                    <div className="flex justify-between text-[10px] sm:text-[11px]">
                      <span className="text-white/60">Price</span>
                      <span className="font-medium text-white">${ico.price}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[10px] sm:text-[11px]">
                    <span className="text-white/60">Date</span>
                    <span className="font-medium text-white flex items-center gap-1.5 sm:gap-2">
                      {new Date(ico.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      <span
                        className={`text-[9px] sm:text-[10px] ${
                          isUpcoming && daysLabel <= 7 
                            ? "text-yellow-400" 
                            : "text-white/40"
                        }`}
                      >
                        ({isUpcoming ? `${daysLabel}d` : `${daysLabel}d ago`})
                      </span>
                    </span>
                  </div>

                  {ico.raised > 0 && (
                    <>
                      <div className="flex justify-between text-[10px] sm:text-[11px]">
                        <span className="text-white/60">Raised</span>
                        <span className="font-medium text-white">
                          ${(ico.raised / 1000000).toFixed(1)}M
                        </span>
                      </div>

                      {ico.target !== ico.raised && (
                        <div className="flex justify-between text-[10px] sm:text-[11px]">
                          <span className="text-white/60">Target</span>
                          <span className="font-medium text-white">
                            ${(ico.target / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      )}

                      <div className="pt-1 sm:pt-1.5">
                        <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                            style={{
                              width: `${getProgressPercent(ico.raised, ico.target)}%`,
                            }}
                          />
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-right text-white/60 mt-0.5 sm:mt-1">
                          {getProgressPercent(ico.raised, ico.target).toFixed(0)}%
                        </div>
                      </div>
                    </>
                  )}

                  {ico.category && (
                    <div className="text-[9px] sm:text-[10px] text-white/40 pt-0.5">
                      {ico.category}
                    </div>
                  )}

                  {ico.raised > 100000000 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1.5 sm:p-2 mt-1 sm:mt-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-blue-400">
<Gem className="w-3 h-3 text-blue-400" />
                        <span>Major funding round - high market interest</span>
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