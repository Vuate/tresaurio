// components/terminal/personalized-dashboard/ICOCalendarModule.tsx

import { useState } from "react";

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
}

// 🔥 MOCK DATA
const MOCK_ICOS: ICOEvent[] = [
  {
    id: "1",
    name: "DefiMax Protocol",
    symbol: "DMX",
    date: "2026-01-25",
    price: 0.05,
    chain: "Ethereum",
    status: "upcoming",
    raised: 2500000,
    target: 5000000,
  },
  {
    id: "2",
    name: "MetaVerse Land",
    symbol: "MVL",
    date: "2026-01-22",
    price: 0.12,
    chain: "Polygon",
    status: "live",
    raised: 1800000,
    target: 3000000,
  },
  {
    id: "3",
    name: "GameFi Arena",
    symbol: "GFA",
    date: "2026-02-01",
    price: 0.08,
    chain: "BSC",
    status: "upcoming",
    raised: 500000,
    target: 2000000,
  },
  {
    id: "4",
    name: "AI Trading Bot",
    symbol: "ATB",
    date: "2026-01-28",
    price: 0.15,
    chain: "Arbitrum",
    status: "upcoming",
    raised: 3200000,
    target: 4000000,
  },
];

export default function ICOCalendarModule({ instanceId }: Props) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "ended">(
    "all",
  );

  const filteredICOs = MOCK_ICOS.filter(
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
    return Math.min((raised / target) * 100, 100);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🚀</div>
          <h3 className="font-semibold">ICO Calendar</h3>
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
        {filteredICOs.length === 0 ? (
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
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Price</span>
                    <span className="font-medium text-white">${ico.price}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Date</span>
                    <span className="font-medium text-white">
                      {new Date(ico.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Raised: ${(ico.raised / 1000000).toFixed(1)}M</span>
                      <span>Target: ${(ico.target / 1000000).toFixed(1)}M</span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
