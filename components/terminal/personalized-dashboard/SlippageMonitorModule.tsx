// components/terminal/personalized-dashboard/SlippageMonitorModule.tsx

import { useState, useMemo, useEffect } from "react";
import { useOrderBook } from "@/hooks";
import type { Exchange } from "@/services/WebSocketService";

interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
  { id: "coinbase", name: "Coinbase" },
];

export default function SlippageMonitorModule({ instanceId }: Props) {
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [orderSize, setOrderSize] = useState("10000");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  // ✅ USE REAL WEBSOCKET DATA with multi-exchange support
  const { bids, asks, midPrice, loading, error, status } = useOrderBook({
    symbol,
    marketType,
    exchange,
    limit: 100, // Get deep order book for accurate slippage calculation
  });

  // Save settings to localStorage
  useEffect(() => {
    const storageKey = `slippage-monitor-${instanceId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({ symbol, marketType, exchange, orderSize, orderType })
    );
  }, [instanceId, symbol, marketType, exchange, orderSize, orderType]);

  // Load settings from localStorage
  useEffect(() => {
    const storageKey = `slippage-monitor-${instanceId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.symbol) setSymbol(settings.symbol);
        if (settings.marketType) setMarketType(settings.marketType);
        if (settings.exchange) setExchange(settings.exchange);
        if (settings.orderSize) setOrderSize(settings.orderSize);
        if (settings.orderType) setOrderType(settings.orderType);
      } catch (err) {
        console.error("[SlippageMonitor] Failed to load settings:", err);
      }
    }
  }, [instanceId]);

  // ✅ REAL SLIPPAGE CALCULATION
  const slippageData = useMemo(() => {
    if (!bids || !asks || bids.length === 0 || asks.length === 0) {
      return null;
    }

    const orderSizeUSDT = parseFloat(orderSize) || 0;
    if (orderSizeUSDT <= 0) return null;

    // Select the appropriate side of the order book
    const levels = orderType === "buy" ? asks : bids;
    const basePrice = orderType === "buy" ? asks[0].price : bids[0].price;

    let remainingUSDT = orderSizeUSDT;
    let totalQuantity = 0;
    let weightedPriceSum = 0;
    let liquidityDepth = 0;

    // Walk through order book levels
    for (const level of levels) {
      const levelUSDT = level.price * level.quantity;
      liquidityDepth += levelUSDT;

      if (remainingUSDT <= 0) break;

      const usedUSDT = Math.min(remainingUSDT, levelUSDT);
      const usedQuantity = usedUSDT / level.price;

      totalQuantity += usedQuantity;
      weightedPriceSum += level.price * usedQuantity;
      remainingUSDT -= usedUSDT;
    }

    // Calculate effective price
    const effectivePrice = totalQuantity > 0 ? weightedPriceSum / totalQuantity : basePrice;
    const slippageAmount = Math.abs(effectivePrice - basePrice);
    const slippagePercent = (slippageAmount / basePrice) * 100;
    const totalCost = effectivePrice * totalQuantity;

    // Determine impact level
    const impact = slippagePercent > 0.3 ? "high" : slippagePercent > 0.1 ? "medium" : "low";

    return {
      basePrice,
      slippagePercent,
      slippageAmount,
      effectivePrice,
      totalCost,
      liquidityDepth,
      impact,
      quantityFilled: totalQuantity,
      insufficientLiquidity: remainingUSDT > 0,
    };
  }, [bids, asks, orderSize, orderType]);

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

      {/* Exchange & Market Type */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value as Exchange)}
          className="flex-1 py-2 px-3 rounded text-sm font-medium bg-white/5 text-white border border-white/10 outline-none"
        >
          {EXCHANGES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
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

      {/* Status Indicator */}
      {status && (
        <div className="px-3 py-1 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "connected"
                  ? "bg-emerald-400 animate-pulse"
                  : status === "connecting"
                    ? "bg-yellow-400 animate-pulse"
                    : status === "fallback"
                      ? "bg-orange-400"
                      : "bg-red-400"
              }`}
            />
            <span className="text-white/60">
              {status === "connected"
                ? "Live"
                : status === "connecting"
                  ? "Connecting..."
                  : status === "fallback"
                    ? "REST Fallback"
                    : "Disconnected"}
            </span>
          </div>
        </div>
      )}

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

        {/* Order Type */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">Order Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType("buy")}
              className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                orderType === "buy"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setOrderType("sell")}
              className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                orderType === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Sell
            </button>
          </div>
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <div className="text-xs text-white/60">Loading order book...</div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-400">❌</span>
              <div className="text-xs text-red-400">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && slippageData && (
          <div className="space-y-3 pt-2">
            {/* Base Price */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">
                {orderType === "buy" ? "Best Ask" : "Best Bid"} Price
              </div>
              <div className="text-lg font-bold text-white">
                ${slippageData.basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                ${slippageData.effectivePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-blue-500/10 rounded-lg p-3">
              <div className="text-xs text-blue-400 mb-1">
                Total Cost (incl. slippage)
              </div>
              <div className="text-lg font-bold text-blue-400">
                ${slippageData.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-blue-400/60 mt-1">
                {slippageData.quantityFilled.toFixed(6)} {symbol.replace("USDT", "")}
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
                Liquidity Depth: ${slippageData.liquidityDepth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        )}

        {/* Warnings */}
        {!loading && !error && slippageData && (
          <>
            {slippageData.impact === "high" && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-red-400">⚠️</span>
                  <div className="text-xs text-red-400">
                    <strong>High slippage detected!</strong> Consider splitting
                    your order or using limit orders.
                  </div>
                </div>
              </div>
            )}

            {slippageData.insufficientLiquidity && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400">⚠️</span>
                  <div className="text-xs text-orange-400">
                    <strong>Insufficient liquidity!</strong> Order cannot be
                    fully filled at current market depth.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
