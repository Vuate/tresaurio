// components/terminal/personalized-dashboard/RSIHeatmapModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface RSIData {
  symbol: string;
  rsi: number;
  price: number;
  change24h: number;
}

// 🔥 MOCK DATA
const MOCK_RSI: RSIData[] = [
  { symbol: "BTCUSDT", rsi: 68, price: 45230, change24h: 2.5 },
  { symbol: "ETHUSDT", rsi: 72, price: 2456, change24h: 3.2 },
  { symbol: "BNBUSDT", rsi: 45, price: 312, change24h: -1.8 },
  { symbol: "SOLUSDT", rsi: 82, price: 108, change24h: 8.5 },
  { symbol: "XRPUSDT", rsi: 38, price: 0.58, change24h: -4.2 },
  { symbol: "ADAUSDT", rsi: 55, price: 0.52, change24h: 1.1 },
  { symbol: "DOGEUSDT", rsi: 41, price: 0.088, change24h: -2.3 },
  { symbol: "MATICUSDT", rsi: 64, price: 0.95, change24h: 2.8 },
  { symbol: "LINKUSDT", rsi: 58, price: 14.2, change24h: 0.9 },
];

export default function RSIHeatmapModule({ instanceId }: Props) {
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "1d">("4h");

  const getRSIColor = (rsi: number) => {
    if (rsi >= 70) return "bg-red-500";
    if (rsi >= 60) return "bg-orange-500";
    if (rsi >= 40) return "bg-yellow-500";
    if (rsi >= 30) return "bg-emerald-500";
    return "bg-green-500";
  };

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return "Overbought";
    if (rsi >= 30) return "Neutral";
    return "Oversold";
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🌡️</div>
          <h3 className="font-semibold">RSI Heatmap</h3>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        {(["1h", "4h", "1d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              timeframe === tf
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-2">
          {MOCK_RSI.map((data) => (
            <div
              key={data.symbol}
              className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">
                  {data.symbol.replace("USDT", "")}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded ${
                    data.change24h >= 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {data.change24h >= 0 ? "+" : ""}
                  {data.change24h.toFixed(1)}%
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getRSIColor(data.rsi)} transition-all`}
                      style={{ width: `${data.rsi}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-bold text-white w-12 text-right">
                  {data.rsi}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">{getRSILabel(data.rsi)}</span>
                <span className="text-white/60">
                  ${data.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-white/60 mb-2">RSI Scale</div>
        <div className="flex gap-1">
          <div className="flex-1 h-2 bg-green-500 rounded" />
          <div className="flex-1 h-2 bg-emerald-500 rounded" />
          <div className="flex-1 h-2 bg-yellow-500 rounded" />
          <div className="flex-1 h-2 bg-orange-500 rounded" />
          <div className="flex-1 h-2 bg-red-500 rounded" />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>0</span>
          <span>30</span>
          <span>70</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
