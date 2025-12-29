"use client";

import { useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

type PnLStat = {
  label: string;
  value: number;
  positive?: boolean;
};

export default function PnLOverviewModule() {
  const { spotPositions, futuresPositions } = usePortfolioStore();

  const stats = useMemo<PnLStat[]>(() => {
    let unrealized = 0;
    let realized = 0;

    // SPOT PnL
    for (const p of spotPositions) {
      unrealized += (p.currentPrice - p.entryPrice) * p.qty;
    }

    // FUTURES PnL
    for (const f of futuresPositions) {
      const dir = f.side === "long" ? 1 : -1;
      unrealized += (f.markPrice - f.entryPrice) * f.qty * dir * f.leverage;
    }

    const total = unrealized + realized;

    return [
      { label: "Total PnL", value: total, positive: total >= 0 },
      { label: "Unrealized", value: unrealized, positive: unrealized >= 0 },
      { label: "Realized", value: realized, positive: realized >= 0 },
    ];
  }, [spotPositions, futuresPositions]);

  return (
    <div className="space-y-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex justify-between items-center
            px-3 py-2 rounded-lg
            bg-white/5 border border-white/10"
        >
          <span className="text-xs text-white/50">{s.label}</span>
          <span
            className={`font-mono text-sm font-semibold ${
              s.positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {s.value >= 0 ? "+" : ""}
            {s.value.toLocaleString(undefined, { maximumFractionDigits: 2 })} $
          </span>
        </div>
      ))}
    </div>
  );
}
