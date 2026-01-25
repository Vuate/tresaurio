// components/terminal/personalized-dashboard/PnLAnalysisModule.tsx

import { useState } from "react";
import { usePnL } from "@/lib/personalized-dashboard/usePnL";

interface Props {
  instanceId: string;
}

export default function PnLAnalysisModule({ instanceId }: Props) {
  const pnl = usePnL();
  const [timeframe, setTimeframe] = useState<
    "today" | "week" | "month" | "all"
  >("today");

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">💰</div>
          <h3 className="font-semibold">PnL Analysis</h3>
        </div>
        <button className="text-white/50 hover:text-white transition-colors">
          ⚙️
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Total PnL Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-sm text-white/60 mb-1">Total PnL</div>
          <div className="flex items-baseline gap-2">
            <div
              className={`text-3xl font-bold ${
                pnl.totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {pnl.totalUnrealized >= 0 ? "+" : ""}$
              {pnl.totalUnrealized.toFixed(2)}
            </div>
            <div
              className={`text-lg ${
                pnl.totalPnLPercent >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              ({pnl.totalPnLPercent >= 0 ? "+" : ""}
              {pnl.totalPnLPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-white/80">Breakdown</div>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Realized</span>
              <span className="text-emerald-400 font-medium">
                +${pnl.realized.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Unrealized</span>
              <span
                className={`font-medium ${
                  pnl.totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {pnl.totalUnrealized >= 0 ? "+" : ""}$
                {pnl.totalUnrealized.toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-white/80 font-medium">Today's PnL</span>
              <span
                className={`font-bold ${
                  pnl.todayPnL >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {pnl.todayPnL >= 0 ? "+" : ""}${pnl.todayPnL.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* By Market */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-white/80">By Market</div>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-white/60">Spot</span>
              </div>
              <div className="text-right">
                <div
                  className={`font-medium ${
                    pnl.spotUnrealized >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {pnl.spotUnrealized >= 0 ? "+" : ""}$
                  {pnl.spotUnrealized.toFixed(2)}
                </div>
                <div className="text-xs text-white/40">
                  ${pnl.spotValue.toFixed(2)} value
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-white/60">Futures</span>
              </div>
              <div className="text-right">
                <div
                  className={`font-medium ${
                    pnl.futuresUnrealized >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {pnl.futuresUnrealized >= 0 ? "+" : ""}$
                  {pnl.futuresUnrealized.toFixed(2)}
                </div>
                <div className="text-xs text-white/40">
                  ${pnl.futuresMargin.toFixed(2)} margin
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-white/80">
            Portfolio Overview
          </div>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Total Investment</span>
              <span className="text-white font-medium">
                ${pnl.totalInvestment.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Current Value</span>
              <span className="text-white font-medium">
                ${pnl.totalValue.toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-white/80 font-medium">Net PnL</span>
              <span
                className={`font-bold text-lg ${
                  pnl.totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {pnl.totalUnrealized >= 0 ? "+" : ""}$
                {pnl.totalUnrealized.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 pt-2">
          {(["today", "week", "month", "all"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`
                flex-1 py-2 rounded text-sm font-medium transition-all
                ${
                  timeframe === tf
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {pnl.totalInvestment === 0 && (
          <div className="text-center py-8 text-white/40">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-sm">No positions yet</div>
            <div className="text-xs mt-1">
              Add positions to see PnL analysis
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
