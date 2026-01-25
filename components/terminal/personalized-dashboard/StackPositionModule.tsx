// components/terminal/personalized-dashboard/StackPositionModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface StackData {
  id: string;
  name: string;
  category: string;
  tokens: string[];
  totalValue: number;
  allocation: number;
  change24h: number;
}

// 🔥 MOCK DATA
const MOCK_STACKS: StackData[] = [
  {
    id: "1",
    name: "Layer 1s",
    category: "Infrastructure",
    tokens: ["ETH", "SOL", "AVAX", "NEAR"],
    totalValue: 45000,
    allocation: 35,
    change24h: 2.8,
  },
  {
    id: "2",
    name: "DeFi Blue Chips",
    category: "DeFi",
    tokens: ["UNI", "AAVE", "CRV", "MKR"],
    totalValue: 28000,
    allocation: 22,
    change24h: 1.5,
  },
  {
    id: "3",
    name: "Gaming & Metaverse",
    category: "Gaming",
    tokens: ["AXS", "SAND", "MANA", "ENJ"],
    totalValue: 18000,
    allocation: 14,
    change24h: -2.3,
  },
  {
    id: "4",
    name: "AI & Data",
    category: "AI",
    tokens: ["FET", "OCEAN", "GRT", "RNDR"],
    totalValue: 22000,
    allocation: 17,
    change24h: 5.2,
  },
  {
    id: "5",
    name: "Stablecoins",
    category: "Stable",
    tokens: ["USDC", "DAI", "USDT"],
    totalValue: 15000,
    allocation: 12,
    change24h: 0.0,
  },
];

export default function StackPositionModule({ instanceId }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalValue = MOCK_STACKS.reduce((sum, s) => sum + s.totalValue, 0);

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📚</div>
          <h3 className="font-semibold">Stack Tracker</h3>
        </div>
      </div>

      {/* Total Summary */}
      <div className="p-3 border-b border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <div className="text-xs text-white/60 mb-1">Total Portfolio Value</div>
        <div className="text-2xl font-bold text-white">
          ${totalValue.toLocaleString()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-white/10">
          {MOCK_STACKS.map((stack) => (
            <div key={stack.id} className="hover:bg-white/5 transition-colors">
              <button
                onClick={() =>
                  setExpandedId(expandedId === stack.id ? null : stack.id)
                }
                className="w-full p-3 text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-white">{stack.name}</div>
                    <div className="text-xs text-white/60">
                      {stack.category}
                    </div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      stack.change24h >= 0
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {stack.change24h >= 0 ? "+" : ""}
                    {stack.change24h.toFixed(1)}%
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-white">
                    ${stack.totalValue.toLocaleString()}
                  </span>
                  <span className="text-sm text-blue-400">
                    {stack.allocation}%
                  </span>
                </div>

                {/* Allocation Bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${stack.allocation}%` }}
                  />
                </div>
              </button>

              {/* Expanded View */}
              {expandedId === stack.id && (
                <div className="px-3 pb-3 space-y-2">
                  <div className="text-xs text-white/60 mb-1">
                    Tokens in Stack:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {stack.tokens.map((token) => (
                      <span
                        key={token}
                        className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-medium"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
