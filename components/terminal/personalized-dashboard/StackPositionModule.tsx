"use client";

import { useState, useRef } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Layers } from "lucide-react";

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

//  MOCK DATA
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

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  DeFi: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Gaming: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  AI: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Stable: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

export default function StackPositionModule({ instanceId }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const totalValue = MOCK_STACKS.reduce((sum, s) => sum + s.totalValue, 0);

  return (
    <div ref={containerRef} className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      <div className="relative z-50 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground whitespace-nowrap">
            <span className="hidden xs:inline">Stack Tracker</span>
            <span className="xs:hidden">Stacks</span>
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-emerald-400 whitespace-nowrap">LIVE</span>
        </div>

        <div className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold flex-shrink-0 whitespace-nowrap">
          PERSONAL
        </div>
      </div>

      <div className="flex-shrink-0 p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 sm:mb-1 leading-tight">
          Total Portfolio Value
        </div>
        <div className="text-lg sm:text-xl font-bold text-foreground leading-tight">
          ${totalValue.toLocaleString()}
        </div>
        <div className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">
          {MOCK_STACKS.length} stacks tracked
        </div>
      </div>

      <div
        className="
          flex-1 min-h-0
          overflow-y-auto overflow-x-hidden
          px-1 pr-3

          [&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20          [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/30 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/40
          scrollbar-thin
scrollbar-thumb-foreground/20          scrollbar-track-transparent
        "
      >
        <div className="space-y-1.5 sm:space-y-2">
          {MOCK_STACKS.map((stack) => {
            const isExpanded = expandedIds.has(stack.id);
            return (
              <div
                key={stack.id}
                className="rounded-lg bg-input border border-border hover:bg-black/8 dark:hover:bg-white/8 transition-colors overflow-hidden"
              >
                <button
                  onClick={() => {
                    const newSet = new Set(expandedIds);
                    if (isExpanded) {
                      newSet.delete(stack.id);
                    } else {
                      newSet.add(stack.id);
                    }
                    setExpandedIds(newSet);
                  }}
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground shrink-0" />
                      <div className="font-semibold text-foreground text-xs sm:text-sm leading-tight truncate">
                        {stack.name}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight whitespace-nowrap">
                      {stack.category}
                    </span>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded border font-semibold whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 ${
                        stack.change24h >= 0
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                      }`}
                    >
                      {stack.change24h >= 0 ? (
                        <>
                          <TrendingUp className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">+{stack.change24h.toFixed(1)}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">{stack.change24h.toFixed(1)}%</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                    <span className="text-sm sm:text-base font-bold text-foreground leading-tight truncate">
                      ${stack.totalValue.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm text-blue-400 font-semibold whitespace-nowrap flex-shrink-0">
                      {stack.allocation}%
                    </span>
                  </div>

                  <div className="h-1.5 sm:h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${stack.allocation}%` }}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-2 sm:px-3 pb-2 sm:pb-2.5 pt-1 border-t border-border animate-in slide-in-from-top-2 duration-200">
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-1.5 font-medium">
                      Tokens in Stack:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stack.tokens.map((token) => (
                        <span
                          key={token}
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border text-[9px] sm:text-[10px] font-semibold ${
                            CATEGORY_COLORS[stack.category] ||
                            "text-muted-foreground bg-input border-border"
                          }`}
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-input rounded-lg">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 leading-tight">
              Best Performer
            </div>
            <div className="text-xs sm:text-sm font-semibold text-emerald-400 leading-tight truncate">
              {MOCK_STACKS.reduce((max, stack) =>
                stack.change24h > max.change24h ? stack : max
              ).name}
            </div>
          </div>
          <div className="text-right min-w-0">
            <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-0.5 leading-tight">
              Total Stacks
            </div>
            <div className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
              {MOCK_STACKS.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}