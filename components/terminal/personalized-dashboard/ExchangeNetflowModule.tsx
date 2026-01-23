// components/terminal/personalized-dashboard/ExchangeNetflowModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface NetflowData {
  exchange: string;
  inflow: number;
  outflow: number;
  net: number;
  change24h: number;
}

// 🔥 MOCK DATA
const MOCK_NETFLOW: NetflowData[] = [
  {
    exchange: "Binance",
    inflow: 125000000,
    outflow: 98000000,
    net: 27000000,
    change24h: 15.2,
  },
  {
    exchange: "Coinbase",
    inflow: 85000000,
    outflow: 112000000,
    net: -27000000,
    change24h: -12.5,
  },
  {
    exchange: "OKX",
    inflow: 45000000,
    outflow: 38000000,
    net: 7000000,
    change24h: 8.3,
  },
  {
    exchange: "Bybit",
    inflow: 62000000,
    outflow: 55000000,
    net: 7000000,
    change24h: 4.7,
  },
  {
    exchange: "Kraken",
    inflow: 28000000,
    outflow: 35000000,
    net: -7000000,
    change24h: -6.2,
  },
];

export default function ExchangeNetflowModule({ instanceId }: Props) {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">💸</div>
          <h3 className="font-semibold">Exchange Netflow</h3>
        </div>
      </div>

      {/* Timeframe */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        {(["24h", "7d", "30d"] as const).map((tf) => (
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
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-white/10">
          {MOCK_NETFLOW.map((data) => (
            <div
              key={data.exchange}
              className="p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">{data.exchange}</div>
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

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">↓ Inflow</span>
                  <span className="text-white font-medium">
                    ${(data.inflow / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-400">↑ Outflow</span>
                  <span className="text-white font-medium">
                    ${(data.outflow / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 font-medium">Net Flow</span>
                  <span
                    className={`font-bold ${
                      data.net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {data.net >= 0 ? "+" : ""}$
                    {(Math.abs(data.net) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Flow Bar */}
              <div className="mt-3 flex gap-1 h-2">
                <div
                  className="bg-emerald-500 rounded"
                  style={{
                    width: `${(data.inflow / (data.inflow + data.outflow)) * 100}%`,
                  }}
                />
                <div
                  className="bg-red-500 rounded"
                  style={{
                    width: `${(data.outflow / (data.inflow + data.outflow)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Summary */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-white/60 mb-1">Total Net Flow (24h)</div>
        <div className="text-lg font-bold text-emerald-400">
          +$
          {(MOCK_NETFLOW.reduce((sum, d) => sum + d.net, 0) / 1000000).toFixed(
            1,
          )}
          M
        </div>
      </div>
    </div>
  );
}
