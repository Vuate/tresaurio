"use client";

import { useMemo } from "react";
import { useOrderBookStore } from "@/store/orderBookStore";

export default function LiquidityAnalysisModule() {
  const { bids, asks, mid } = useOrderBookStore();

  const metrics = useMemo(() => {
    if (!bids.length || !asks.length || !mid || mid <= 0) {
      return {
        bidDepth: 0,
        askDepth: 0,
        spreadPct: 0,
        pressure: "neutral" as const,
        score: 0,
      };
    }

    const bidDepth = bids.reduce((a, b) => a + b.qty, 0);
    const askDepth = asks.reduce((a, b) => a + b.qty, 0);

    const spreadPct = (Math.abs(bids[0].price - asks[0].price) / mid) * 100;

    const pressure =
      bidDepth > askDepth * 1.2
        ? "buy"
        : askDepth > bidDepth * 1.2
        ? "sell"
        : "neutral";

    const score =
      spreadPct > 0
        ? Math.min(100, Math.round((bidDepth + askDepth) / spreadPct))
        : 0;

    return { bidDepth, askDepth, spreadPct, pressure, score };
  }, [bids, asks, mid]);

  return (
    <div className="space-y-3 text-xs">
      <Row label="Spread">{metrics.spreadPct.toFixed(3)}%</Row>
      <Row label="Bid Depth">{metrics.bidDepth.toFixed(2)}</Row>
      <Row label="Ask Depth">{metrics.askDepth.toFixed(2)}</Row>

      <Row label="Pressure">
        <span
          className={
            metrics.pressure === "buy"
              ? "text-emerald-400"
              : metrics.pressure === "sell"
              ? "text-red-400"
              : "text-white/60"
          }
        >
          {metrics.pressure.toUpperCase()}
        </span>
      </Row>

      <Row label="Liquidity Score">
        <span className="text-teal-400 font-semibold">{metrics.score}</span>
      </Row>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span>{children}</span>
    </div>
  );
}
