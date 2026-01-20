// components/terminal/personalized-dashboard/TokenFlowModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface FlowData {
  chain: string;
  inflow: number;
  outflow: number;
  net: number;
  volume24h: number;
}

// 🔥 MOCK DATA
const MOCK_FLOWS: FlowData[] = [
  {
    chain: "Ethereum",
    inflow: 125000000,
    outflow: 98000000,
    net: 27000000,
    volume24h: 450000000,
  },
  {
    chain: "BSC",
    inflow: 85000000,
    outflow: 92000000,
    net: -7000000,
    volume24h: 280000000,
  },
  {
    chain: "Polygon",
    inflow: 45000000,
    outflow: 38000000,
    net: 7000000,
    volume24h: 120000000,
  },
  {
    chain: "Arbitrum",
    inflow: 62000000,
    outflow: 55000000,
    net: 7000000,
    volume24h: 180000000,
  },
  {
    chain: "Optimism",
    inflow: 28000000,
    outflow: 25000000,
    net: 3000000,
    volume24h: 95000000,
  },
];

export default function TokenFlowModule({ instanceId }: Props) {
  const [selectedToken, setSelectedToken] = useState("USDT");

  const totalNet = MOCK_FLOWS.reduce((sum, f) => sum + f.net, 0);

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🌊</div>
          <h3 className="font-semibold">Token Flow</h3>
        </div>
      </div>

      {/* Token Selector */}
      <div className="p-3 border-b border-white/10">
        <select
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
        >
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
          <option value="BTC">Wrapped BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>

      {/* Total Summary */}
      <div
        className={`p-3 border-b border-white/10 ${
          totalNet >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
        }`}
      >
        <div className="text-xs text-white/60 mb-1">Total Net Flow (24h)</div>
        <div
          className={`text-2xl font-bold ${
            totalNet >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalNet >= 0 ? "+" : ""}${(totalNet / 1000000).toFixed(1)}M
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-white/10">
          {MOCK_FLOWS.map((flow) => (
            <div
              key={flow.chain}
              className="p-3 hover:bg-white/5 transition-colors"
            >
              <div className="font-medium text-white mb-2">{flow.chain}</div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">↓ Inflow</span>
                  <span className="text-white font-medium">
                    ${(flow.inflow / 1000000).toFixed(1)}M
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-red-400">↑ Outflow</span>
                  <span className="text-white font-medium">
                    ${(flow.outflow / 1000000).toFixed(1)}M
                  </span>
                </div>

                <div className="h-px bg-white/10 my-1" />

                <div className="flex justify-between text-sm">
                  <span className="text-white/80 font-medium">Net Flow</span>
                  <span
                    className={`font-bold ${
                      flow.net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {flow.net >= 0 ? "+" : ""}$
                    {(Math.abs(flow.net) / 1000000).toFixed(1)}M
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Volume (24h)</span>
                  <span className="text-white/80">
                    ${(flow.volume24h / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>

              {/* Flow Visualization */}
              <div className="mt-3 flex gap-1 h-2">
                <div
                  className="bg-emerald-500 rounded"
                  style={{
                    width: `${(flow.inflow / (flow.inflow + flow.outflow)) * 100}%`,
                  }}
                />
                <div
                  className="bg-red-500 rounded"
                  style={{
                    width: `${(flow.outflow / (flow.inflow + flow.outflow)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
