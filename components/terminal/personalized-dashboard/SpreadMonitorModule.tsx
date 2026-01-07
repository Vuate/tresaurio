// components/terminal/personalized-dashboard/SpreadMonitorModule.tsx
"use client";

import { useMemo } from "react";
import { useOrderBookStore } from "@/store/orderBookStore";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function SpreadMonitorModule() {
  // 👇 STORE'DAN AL
  const { bids, asks, symbol, mid, source, setSymbol } = useOrderBookStore();

  const metrics = useMemo(() => {
    if (!bids.length || !asks.length) {
      return null;
    }

    const bestBid = bids[0].price;
    const bestAsk = asks[0].price;
    const spread = bestAsk - bestBid;
    const midPrice = mid || (bestBid + bestAsk) / 2;
    const spreadPercent = (spread / midPrice) * 100;

    const bidVolume = bids.slice(0, 10).reduce((sum, b) => sum + b.qty, 0);
    const askVolume = asks.slice(0, 10).reduce((sum, a) => sum + a.qty, 0);

    const totalVolume = bidVolume + askVolume;
    const imbalance =
      totalVolume > 0 ? ((bidVolume - askVolume) / totalVolume) * 100 : 0;

    const pressure =
      bidVolume > askVolume * 1.2
        ? "buy"
        : askVolume > bidVolume * 1.2
        ? "sell"
        : "neutral";

    return {
      bestBid,
      bestAsk,
      spread,
      spreadPercent,
      midPrice,
      bidVolume,
      askVolume,
      imbalance,
      pressure,
    };
  }, [bids, asks, mid]);

  const popularSymbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

  if (!metrics) {
    return (
      <div className="space-y-3 text-xs">
        <div className="text-white/50">Waiting for order book data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs">
      {/* Symbol Selector */}
      <div className="flex gap-1.5 flex-wrap">
        {popularSymbols.map((sym) => (
          <button
            key={sym}
            onClick={() => setSymbol(sym)} // 👈 STORE'A YAZ
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              symbol === sym
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {sym.replace("USDT", "")}
          </button>
        ))}
      </div>

      {/* Source indicator */}
      <div className="text-[10px] text-white/30">
        🔗 Synced with Order Book • {source === "api" ? "LIVE" : "MOCK"}
      </div>

      {/* Spread */}
      <Row label="Spread">
        ${metrics.spread.toFixed(2)} ({metrics.spreadPercent.toFixed(4)}%)
      </Row>

      {/* Best Bid */}
      <Row label="Best Bid">
        <span className="text-emerald-400 font-mono">
          ${metrics.bestBid.toLocaleString()}
        </span>
      </Row>

      {/* Best Ask */}
      <Row label="Best Ask">
        <span className="text-red-400 font-mono">
          ${metrics.bestAsk.toLocaleString()}
        </span>
      </Row>

      {/* Mid Price */}
      <Row label="Mid Price">
        <span className="font-mono">${metrics.midPrice.toLocaleString()}</span>
      </Row>

      {/* Bid Volume */}
      <Row label="Bid Volume">{metrics.bidVolume.toFixed(2)}</Row>

      {/* Ask Volume */}
      <Row label="Ask Volume">{metrics.askVolume.toFixed(2)}</Row>

      {/* Pressure */}
      <Row label="Pressure">
        <span
          className={`flex items-center gap-1 ${
            metrics.pressure === "buy"
              ? "text-emerald-400"
              : metrics.pressure === "sell"
              ? "text-red-400"
              : "text-white/60"
          }`}
        >
          {metrics.pressure === "buy" && <TrendingUp className="w-3 h-3" />}
          {metrics.pressure === "sell" && <TrendingDown className="w-3 h-3" />}
          {metrics.pressure === "neutral" && <Minus className="w-3 h-3" />}
          {metrics.pressure.toUpperCase()}
        </span>
      </Row>

      {/* Imbalance */}
      <Row label="Imbalance">
        <span
          className={
            metrics.imbalance > 0 ? "text-emerald-400" : "text-red-400"
          }
        >
          {metrics.imbalance > 0 ? "+" : ""}
          {metrics.imbalance.toFixed(1)}%
        </span>
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
