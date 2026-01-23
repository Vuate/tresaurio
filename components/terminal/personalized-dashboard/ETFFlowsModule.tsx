// components/terminal/personalized-dashboard/ETFFlowsModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface ETFData {
  id: string;
  name: string;
  ticker: string;
  flow: number;
  aum: number;
  change24h: number;
  date: string;
}

// 🔥 MOCK DATA
const MOCK_ETF_FLOWS: ETFData[] = [
  {
    id: "1",
    name: "iShares Bitcoin Trust",
    ticker: "IBIT",
    flow: 125000000,
    aum: 28500000000,
    change24h: 2.5,
    date: "2026-01-19",
  },
  {
    id: "2",
    name: "Fidelity Wise Origin Bitcoin Fund",
    ticker: "FBTC",
    flow: 85000000,
    aum: 15200000000,
    change24h: 1.8,
    date: "2026-01-19",
  },
  {
    id: "3",
    name: "ARK 21Shares Bitcoin ETF",
    ticker: "ARKB",
    flow: -45000000,
    aum: 8500000000,
    change24h: -1.2,
    date: "2026-01-19",
  },
  {
    id: "4",
    name: "Grayscale Bitcoin Trust",
    ticker: "GBTC",
    flow: -180000000,
    aum: 24000000000,
    change24h: -3.5,
    date: "2026-01-19",
  },
];

export default function ETFFlowsModule({ instanceId }: Props) {
  const [sortBy, setSortBy] = useState<"flow" | "aum" | "change">("flow");

  const sortedData = [...MOCK_ETF_FLOWS].sort((a, b) => {
    switch (sortBy) {
      case "flow":
        return b.flow - a.flow;
      case "aum":
        return b.aum - a.aum;
      case "change":
        return b.change24h - a.change24h;
      default:
        return 0;
    }
  });

  const totalFlow = MOCK_ETF_FLOWS.reduce((sum, etf) => sum + etf.flow, 0);

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📈</div>
          <h3 className="font-semibold">BTC ETF Flows</h3>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["flow", "aum", "change"] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              sortBy === sort
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {sort === "aum"
              ? "AUM"
              : sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      {/* Total Summary */}
      <div
        className={`p-3 border-b border-white/10 ${
          totalFlow >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
        }`}
      >
        <div className="text-xs text-white/60 mb-1">Net Flow (24h)</div>
        <div
          className={`text-2xl font-bold ${
            totalFlow >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalFlow >= 0 ? "+" : ""}${(totalFlow / 1000000).toFixed(1)}M
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-white/10">
          {sortedData.map((etf) => (
            <div
              key={etf.id}
              className="p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-white">{etf.ticker}</div>
                  <div className="text-xs text-white/60">{etf.name}</div>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded ${
                    etf.change24h >= 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {etf.change24h >= 0 ? "+" : ""}
                  {etf.change24h.toFixed(1)}%
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Flow (24h)</span>
                  <span
                    className={`font-bold ${
                      etf.flow >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {etf.flow >= 0 ? "+" : ""}$
                    {(Math.abs(etf.flow) / 1000000).toFixed(1)}M
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-white/60">AUM</span>
                  <span className="text-white font-medium">
                    ${(etf.aum / 1000000000).toFixed(2)}B
                  </span>
                </div>
              </div>

              {/* Flow Bar */}
              <div className="mt-2">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      etf.flow >= 0 ? "bg-emerald-500" : "bg-red-500"
                    } transition-all`}
                    style={{
                      width: `${Math.min((Math.abs(etf.flow) / 2000000) * 100, 100)}%`,
                    }}
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
