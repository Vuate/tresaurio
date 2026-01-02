"use client";

import { usePortfolioStore } from "@/store/portfolioStore";

export default function SpotPositionsModule() {
  const spotPositions = usePortfolioStore((s) => s.spotPositions);

  return (
    <div className="space-y-2">
      {spotPositions.map((p) => {
        const pnl = (p.currentPrice - p.entryPrice) * p.qty;
        const pnlPct = ((p.currentPrice - p.entryPrice) / p.entryPrice) * 100;

        const positive = pnl >= 0;

        return (
          <div
            key={p.id}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-semibold text-white">
                {p.symbol.replace("USDT", "")}
              </div>
              <div
                className={`text-xs font-semibold ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {positive ? "+" : ""}
                {pnl.toFixed(2)} $
              </div>
            </div>

            <div className="grid grid-cols-3 text-[11px] text-white/50">
              <div>
                Qty
                <div className="text-white/80 font-mono">{p.qty}</div>
              </div>
              <div>
                Entry
                <div className="text-white/80 font-mono">
                  {p.entryPrice.toLocaleString()}
                </div>
              </div>
              <div>
                Price
                <div className="text-white/80 font-mono">
                  {p.currentPrice.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center text-[11px]">
              <span className="text-white/40">PnL %</span>
              <span
                className={`font-semibold ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {positive ? "+" : ""}
                {pnlPct.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
