// components/terminal/personalized-dashboard/LiquidityAnalysisModule.tsx
"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

interface LiquidityMetrics {
  symbol: string;
  bidVolume: number;
  askVolume: number;
  spread: number;
  spreadPercent: number;
  depth1Percent: number;
  depth5Percent: number;
  imbalance: number;
}

const MOCK_DATA: Record<string, LiquidityMetrics> = {
  BTCUSDT: {
    symbol: "BTCUSDT",
    bidVolume: 1250.5,
    askVolume: 1180.3,
    spread: 0.5,
    spreadPercent: 0.0012,
    depth1Percent: 850000,
    depth5Percent: 4200000,
    imbalance: 5.6,
  },
  ETHUSDT: {
    symbol: "ETHUSDT",
    bidVolume: 8500.2,
    askVolume: 8200.8,
    spread: 0.02,
    spreadPercent: 0.0009,
    depth1Percent: 320000,
    depth5Percent: 1600000,
    imbalance: 3.5,
  },
};

interface Props {
  instanceId: string;
}

export default function LiquidityAnalysisModule({ instanceId }: Props) {
  const storageKey = `liquidity-analysis-${instanceId}-symbol`;

  const [selectedSymbol, setSelectedSymbol] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || "BTCUSDT";
    }
    return "BTCUSDT";
  });

  const [data, setData] = useState<LiquidityMetrics | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, selectedSymbol);
    }
  }, [selectedSymbol, storageKey]);

  useEffect(() => {
    setData(MOCK_DATA[selectedSymbol] || MOCK_DATA.BTCUSDT);
  }, [selectedSymbol]);

  if (!data) return <div className="text-xs text-white/40">Loading...</div>;

  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block text-white/50 mb-1 text-[10px]">Symbol</label>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/70 font-semibold">
          <Activity className="w-3 h-3" />
          <span>Orderbook Depth</span>
        </div>

        <Row label="Bid Volume">{data.bidVolume.toFixed(2)} BTC</Row>
        <Row label="Ask Volume">{data.askVolume.toFixed(2)} BTC</Row>

        <Row label="Spread">
          ${data.spread.toFixed(2)} ({data.spreadPercent.toFixed(4)}%)
        </Row>

        <Row label="1% Depth">${data.depth1Percent.toLocaleString()}</Row>
        <Row label="5% Depth">${data.depth5Percent.toLocaleString()}</Row>

        <Row label="Imbalance">
          <span
            className={data.imbalance > 0 ? "text-emerald-400" : "text-red-400"}
          >
            {data.imbalance > 0 ? "+" : ""}
            {data.imbalance.toFixed(2)}%
          </span>
        </Row>
      </div>

      <div className="bg-white/5 border border-white/10 rounded p-2 text-[10px] text-white/50">
        {data.imbalance > 5
          ? "🟢 Strong buy pressure"
          : data.imbalance < -5
          ? "🔴 Strong sell pressure"
          : "⚪ Balanced market"}
      </div>
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
