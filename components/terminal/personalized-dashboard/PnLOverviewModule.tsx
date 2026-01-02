"use client";

import { usePnL } from "@/lib/personalized-dashboard/usePnL";

function Row({ label, value }: { label: string; value: number }) {
  const positive = value >= 0;

  return (
    <div
      className="flex justify-between items-center
        px-3 py-2 rounded-lg
        bg-white/5 border border-white/10"
    >
      <span className="text-xs text-white/50">{label}</span>
      <span
        className={`font-mono text-sm font-semibold ${
          positive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {positive ? "+" : ""}
        {value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}{" "}
        $
      </span>
    </div>
  );
}

export default function PnLOverviewModule() {
  const {
    spotUnrealized,
    futuresUnrealized,
    totalUnrealized,
    realized,
    todayPnL,
  } = usePnL();

  return (
    <div className="space-y-3">
      <Row label="Spot PnL" value={spotUnrealized} />
      <Row label="Futures PnL" value={futuresUnrealized} />
      <Row label="Today PnL" value={todayPnL} />
      <Row label="Unrealized" value={totalUnrealized} />
      <Row label="Realized" value={realized} />
    </div>
  );
}
