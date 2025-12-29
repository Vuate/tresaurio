"use client";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function FuturesPositionsModule() {
  const positions = usePortfolioStore((s) => s.futuresPositions);

  return (
    <div className="space-y-2 text-xs">
      {positions.map((p) => {
        const pnl =
          p.side === "long"
            ? (p.markPrice - p.entryPrice) * p.qty * p.leverage
            : (p.entryPrice - p.markPrice) * p.qty * p.leverage;

        const pnlPct =
          ((p.markPrice - p.entryPrice) / p.entryPrice) *
          100 *
          (p.side === "long" ? 1 : -1);

        const danger =
          p.side === "long"
            ? p.markPrice <= p.liquidationPrice * 1.05
            : p.markPrice >= p.liquidationPrice * 0.95;

        return (
          <div
            key={p.id}
            className={`rounded-xl border px-3 py-2
              ${
                danger
                  ? "border-red-500/50 bg-red-500/5"
                  : "border-white/10 bg-white/5"
              }`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div className="font-semibold text-white">
                {p.symbol}
                <span
                  className={`ml-2 text-[10px] px-2 py-0.5 rounded-full
                    ${
                      p.side === "long"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                >
                  {p.side.toUpperCase()} {p.leverage}x
                </span>
              </div>

              <div
                className={`font-mono font-semibold ${
                  pnl >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {pnl >= 0 ? "+" : ""}
                {pnl.toFixed(2)} $
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-white/60">
              <div>
                Entry
                <div className="text-white">{p.entryPrice}</div>
              </div>

              <div>
                Mark
                <div className="text-white">{p.markPrice}</div>
              </div>

              <div>
                Liq
                <div className="text-red-400">{p.liquidationPrice}</div>
              </div>
            </div>

            {/* PNL BAR */}
            <div className="mt-2 h-1 rounded bg-white/10 overflow-hidden">
              <div
                className={`h-full ${
                  pnl >= 0 ? "bg-emerald-400" : "bg-red-400"
                }`}
                style={{
                  width: `${Math.min(Math.abs(pnlPct), 100)}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
