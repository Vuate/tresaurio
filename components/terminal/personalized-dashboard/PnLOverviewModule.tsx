// components/terminal/personalized-dashboard/PnLOverviewModule.tsx
"use client";

import { usePnL } from "@/lib/personalized-dashboard/usePnL";

function Row({
  label,
  value,
  showPercent = false,
  percent,
}: {
  label: string;
  value: number;
  showPercent?: boolean;
  percent?: number;
}) {
  const positive = value >= 0;

  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10">
      <span className="text-xs text-white/50">{label}</span>
      <div className="text-right">
        <span
          className={`font-mono text-sm font-semibold ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {positive ? "+" : ""}$
          {Math.abs(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        {showPercent && percent !== undefined && (
          <span
            className={`ml-2 text-xs ${
              positive ? "text-emerald-400/70" : "text-red-400/70"
            }`}
          >
            ({positive ? "+" : ""}
            {percent.toFixed(2)}%)
          </span>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-white/5 border border-white/10">
      <span className="text-xs text-white/50">{label}</span>
      <span className="font-mono text-sm font-semibold text-white">
        $
        {value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

export default function PnLOverviewModule() {
  const {
    spotUnrealized,
    futuresUnrealized,
    totalUnrealized,
    spotInvestment,
    spotValue,
    futuresMargin,
    totalInvestment,
    totalValue,
    totalPnLPercent,
    realized,
    todayPnL,
  } = usePnL();

  return (
    <div className="space-y-3 text-xs">
      {/* Summary Card */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
        <div className="text-white/40 text-[10px] font-semibold uppercase">
          Portfolio Overview
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-white/50 text-xs">Total Value</span>
          <span className="text-white text-lg font-bold">
            $
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-white/50 text-xs">Total Invested</span>
          <span className="text-white/70 text-sm">
            $
            {totalInvestment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Total PnL */}
      <Row
        label="Total PnL"
        value={totalUnrealized}
        showPercent
        percent={totalPnLPercent}
      />

      {/* Breakdown */}
      <div className="space-y-2">
        <div className="text-white/40 text-[10px] font-semibold uppercase px-1">
          Breakdown
        </div>
        <Row label="Spot PnL" value={spotUnrealized} />
        <Row label="Futures PnL" value={futuresUnrealized} />
      </div>

      {/* Investment Details */}
      <div className="space-y-2">
        <div className="text-white/40 text-[10px] font-semibold uppercase px-1">
          Details
        </div>
        <InfoRow label="Spot Investment" value={spotInvestment} />
        <InfoRow label="Spot Value" value={spotValue} />
        <InfoRow label="Futures Margin" value={futuresMargin} />
      </div>

      {/* Future Features */}
      <div className="space-y-2">
        <div className="text-white/40 text-[10px] font-semibold uppercase px-1">
          Coming Soon
        </div>
        <Row label="Today PnL" value={todayPnL} />
        <Row label="Realized PnL" value={realized} />
      </div>
    </div>
  );
}
