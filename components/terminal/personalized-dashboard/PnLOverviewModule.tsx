"use client";

import { usePnL } from "@/hooks/usePnL";

interface Props {
  instanceId: string;
}

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
    <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 min-w-0">
      <span className="text-xs text-white/50 whitespace-nowrap">{label}</span>
      <div className={`font-mono text-sm font-semibold ml-auto flex flex-wrap items-center gap-1 ${
          positive ? "text-emerald-400" : "text-red-400"
        }`}>
        <span className="whitespace-nowrap">
          {positive ? "+" : ""}$
          {Math.abs(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        {showPercent && percent !== undefined && (
          <span
            className={`text-xs whitespace-nowrap ${
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
    <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 min-w-0">
      <span className="text-xs text-white/50 whitespace-nowrap">{label}</span>
      <span className="font-mono text-sm font-semibold text-white whitespace-nowrap ml-auto">
        $
        {value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

export default function PnLOverviewModule({ instanceId }: Props) {
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
      <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-2 min-w-0">
        <div className="text-white/40 text-[10px] font-semibold uppercase">
          Portfolio Overview
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-white/50 text-xs whitespace-nowrap">Total Value</span>
          <span className="text-white text-lg font-bold whitespace-nowrap ml-auto">
            $
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-white/50 text-xs whitespace-nowrap">Total Invested</span>
          <span className="text-white/70 text-sm whitespace-nowrap ml-auto">
            $
            {totalInvestment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <Row
        label="Total PnL"
        value={totalUnrealized}
        showPercent
        percent={totalPnLPercent}
      />

      <div className="space-y-2">
        <div className="text-white/40 text-[10px] font-semibold uppercase px-1">
          Breakdown
        </div>
        <Row label="Spot PnL" value={spotUnrealized} />
        <Row label="Futures PnL" value={futuresUnrealized} />
      </div>

      <div className="space-y-2">
        <div className="text-white/40 text-[10px] font-semibold uppercase px-1">
          Details
        </div>
        <InfoRow label="Spot Investment" value={spotInvestment} />
        <InfoRow label="Spot Value" value={spotValue} />
        <InfoRow label="Futures Margin" value={futuresMargin} />
      </div>

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