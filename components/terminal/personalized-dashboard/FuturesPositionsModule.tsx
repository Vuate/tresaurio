"use client";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function FuturesPositionsModule() {
  const futures = usePortfolioStore((s) => s.futuresPositions);

  if (!futures.length) {
    return (
      <div className="text-xs text-white/40">No open futures positions</div>
    );
  }

  return (
    <div className="space-y-2 text-xs">
      {futures.map((p) => {
        const pnl =
          p.side === "long"
            ? (p.markPrice - p.entryPrice) * p.qty * p.leverage
            : (p.entryPrice - p.markPrice) * p.qty * p.leverage;

        const pnlPct =
          ((p.markPrice - p.entryPrice) / p.entryPrice) *
          (p.side === "long" ? 100 : -100);

        const liqDist =
          p.side === "long"
            ? ((p.markPrice - p.liquidationPrice) / p.markPrice) * 100
            : ((p.liquidationPrice - p.markPrice) / p.markPrice) * 100;

        const pnlColor = pnl >= 0 ? "text-emerald-400" : "text-red-400";

        const riskColor =
          liqDist < 5
            ? "text-red-400"
            : liqDist < 10
            ? "text-yellow-400"
            : "text-emerald-400";

        return (
          <div
            key={p.id}
            className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div className="font-semibold text-white">
                {p.symbol}
                <span
                  className={`ml-2 text-[10px] px-2 py-0.5 rounded ${
                    p.side === "long"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {p.side.toUpperCase()} x{p.leverage}
                </span>
              </div>

              <div className={`font-mono ${pnlColor}`}>
                {pnl >= 0 ? "+" : ""}
                {pnl.toFixed(2)} $
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex justify-between text-white/60">
              <span>Entry</span>
              <span>{p.entryPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-white/60">
              <span>Mark</span>
              <span>{p.markPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/40">PnL %</span>
              <span className={pnlColor}>
                {pnlPct >= 0 ? "+" : ""}
                {pnlPct.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/40">Liq Distance</span>
              <span className={riskColor}>{liqDist.toFixed(2)}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
