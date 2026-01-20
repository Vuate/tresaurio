// components/terminal/personalized-dashboard/SlippageMonitorModule.tsx

import { useState, useMemo } from "react";

interface Props {
  instanceId: string;
}

export default function SlippageMonitorModule({ instanceId }: Props) {
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [orderSize, setOrderSize] = useState("10000");

  // 🔥 MOCK CALCULATION
  const slippageData = useMemo(() => {
    const size = parseFloat(orderSize) || 0;
    const basePrice = 45000;

    // Simple slippage simulation
    const slippagePercent = (size / 100000) * 0.5; // 0.5% per 100k
    const slippageAmount = basePrice * (slippagePercent / 100);
    const effectivePrice = basePrice + slippageAmount;
    const totalCost = size + (size * slippagePercent) / 100;

    return {
      basePrice,
      slippagePercent,
      slippageAmount,
      effectivePrice,
      totalCost,
      liquidityDepth: 850000,
      impact:
        slippagePercent > 0.3
          ? "high"
          : slippagePercent > 0.1
            ? "medium"
            : "low",
    };
  }, [orderSize]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-400 bg-red-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "low":
        return "text-emerald-400 bg-emerald-500/10";
      default:
        return "text-white/60 bg-white/5";
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📊</div>
          <h3 className="font-semibold">Slippage Monitor</h3>
        </div>
      </div>

      {/* Market Type Toggle */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        <button
          onClick={() => setMarketType("spot")}
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            marketType === "spot"
              ? "bg-blue-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          Spot
        </button>
        <button
          onClick={() => setMarketType("futures")}
          className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
            marketType === "futures"
              ? "bg-blue-500 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          Futures
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Symbol Input */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="BTCUSDT"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Order Size Input */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">
            Order Size (USDT)
          </label>
          <input
            type="number"
            value={orderSize}
            onChange={(e) => setOrderSize(e.target.value)}
            placeholder="10000"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Results */}
        <div className="space-y-3 pt-2">
          {/* Base Price */}
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/60 mb-1">Base Price</div>
            <div className="text-lg font-bold text-white">
              ${slippageData.basePrice.toLocaleString()}
            </div>
          </div>

          {/* Slippage % */}
          <div
            className={`rounded-lg p-3 ${getImpactColor(slippageData.impact)}`}
          >
            <div className="text-xs mb-1 opacity-80">Estimated Slippage</div>
            <div className="text-2xl font-bold">
              {slippageData.slippagePercent.toFixed(3)}%
            </div>
            <div className="text-xs mt-1 opacity-80">
              ${slippageData.slippageAmount.toFixed(2)} per unit
            </div>
          </div>

          {/* Effective Price */}
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/60 mb-1">Effective Price</div>
            <div className="text-lg font-bold text-white">
              ${slippageData.effectivePrice.toLocaleString()}
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-blue-500/10 rounded-lg p-3">
            <div className="text-xs text-blue-400 mb-1">
              Total Cost (incl. slippage)
            </div>
            <div className="text-lg font-bold text-blue-400">
              ${slippageData.totalCost.toLocaleString()}
            </div>
          </div>

          {/* Market Impact */}
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/60">Market Impact</span>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${getImpactColor(slippageData.impact)}`}
              >
                {slippageData.impact.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-white/60">
              Liquidity Depth: ${slippageData.liquidityDepth.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Warning */}
        {slippageData.impact === "high" && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-400">⚠️</span>
              <div className="text-xs text-red-400">
                <strong>High slippage detected!</strong> Consider splitting your
                order or using limit orders.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
