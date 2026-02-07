"use client";

import { useState } from "react";
import { usePnL } from "@/hooks/usePnL";

interface Props {
  instanceId: string;
}

export default function PnLAnalysisModule({ instanceId }: Props) {
  const pnl = usePnL();
  const [timeframe, setTimeframe] = useState<
    "today" | "week" | "month" | "all"
  >("today");

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      <div className="relative z-50 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-white/60">
          <span className="font-semibold text-white/90">
            <span className="hidden xs:inline">PnL Analysis</span>
            <span className="xs:hidden">PnL</span>
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
        {(["today", "week", "month", "all"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`
              flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold
              border transition-all duration-150
              cursor-pointer
              ${
                timeframe === tf
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
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg p-2.5 sm:p-3 border border-emerald-500/20">
              <div className="text-[10px] sm:text-xs text-white/60 mb-1">Total PnL</div>
              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                <div
                  className={`text-2xl sm:text-3xl font-bold ${
                    pnl.totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {pnl.totalUnrealized >= 0 ? "+" : ""}$
                  {pnl.totalUnrealized.toFixed(2)}
                </div>
                <div
                  className={`text-base sm:text-lg ${
                    pnl.totalPnLPercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  ({pnl.totalPnLPercent >= 0 ? "+" : ""}
                  {pnl.totalPnLPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
            
      <div
        className="
          flex-1 min-h-0 space-y-2 sm:space-y-3
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
        {/* Empty State */}
        {pnl.totalInvestment === 0 ? (
          <div className="text-center py-6 sm:py-8 text-white/40">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">📊</div>
            <div className="text-[10px] sm:text-xs">No positions yet</div>
            <div className="text-[9px] sm:text-[10px] mt-0.5 sm:mt-1">
              Add positions to see PnL analysis
            </div>
          </div>
        ) : (
          <>


            {/* Breakdown */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[10px] sm:text-xs font-medium text-white/80 px-1">
                Breakdown
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-2.5 space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/60 whitespace-nowrap text-[10px] sm:text-xs">Realized</span>
                  <span className="text-emerald-400 font-medium ml-auto whitespace-nowrap text-[10px] sm:text-xs">
                    +${pnl.realized.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/60 whitespace-nowrap text-[10px] sm:text-xs">Unrealized</span>
                  <span
                    className={`font-medium ml-auto whitespace-nowrap text-[10px] sm:text-xs ${
                      pnl.totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pnl.totalUnrealized >= 0 ? "+" : ""}$
                    {pnl.totalUnrealized.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-1 sm:my-1.5" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/80 font-medium whitespace-nowrap text-[10px] sm:text-xs">Today's PnL</span>
                  <span
                    className={`font-bold ml-auto whitespace-nowrap text-[10px] sm:text-xs ${
                      pnl.todayPnL >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pnl.todayPnL >= 0 ? "+" : ""}${pnl.todayPnL.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* By Market */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[10px] sm:text-xs font-medium text-white/80 px-1">
                By Market
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-2.5 space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400" />
                    <span className="text-white/60 text-[10px] sm:text-xs">Spot</span>
                  </div>
                  <div className="text-right ml-auto min-w-0">
                    <div
                      className={`font-medium whitespace-nowrap text-[10px] sm:text-xs ${
                        pnl.spotUnrealized >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {pnl.spotUnrealized >= 0 ? "+" : ""}$
                      {pnl.spotUnrealized.toFixed(2)}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/40">
                      ${pnl.spotValue.toFixed(2)} value
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400" />
                    <span className="text-white/60 text-[10px] sm:text-xs">Futures</span>
                  </div>
                  <div className="text-right ml-auto min-w-0">
                    <div
                      className={`font-medium whitespace-nowrap text-[10px] sm:text-xs ${
                        pnl.futuresUnrealized >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {pnl.futuresUnrealized >= 0 ? "+" : ""}$
                      {pnl.futuresUnrealized.toFixed(2)}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-white/40">
                      ${pnl.futuresMargin.toFixed(2)} margin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Value */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-[10px] sm:text-xs font-medium text-white/80 px-1">
                Portfolio Overview
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-2.5 space-y-1.5 sm:space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/60 whitespace-nowrap text-[10px] sm:text-xs">Total Investment</span>
                  <span className="text-white font-medium ml-auto whitespace-nowrap text-[10px] sm:text-xs">
                    ${pnl.totalInvestment.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/60 whitespace-nowrap text-[10px] sm:text-xs">Current Value</span>
                  <span className="text-white font-medium ml-auto whitespace-nowrap text-[10px] sm:text-xs">
                    ${pnl.totalValue.toFixed(2)}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-1 sm:my-1.5" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-white/80 font-medium whitespace-nowrap text-[10px] sm:text-xs">Net PnL</span>
                  <span
                    className={`font-bold text-base sm:text-lg ml-auto whitespace-nowrap ${
                      pnl.totalUnrealized >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pnl.totalUnrealized >= 0 ? "+" : ""}$
                    {pnl.totalUnrealized.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}