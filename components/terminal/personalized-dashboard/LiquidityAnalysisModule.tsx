// components/terminal/personalized-dashboard/LiquidityAnalysisModule.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Droplets, TrendingUp, TrendingDown, Plus, X } from "lucide-react";
import { wsService } from "@/services/WebSocketService";

interface LiquidityData {
  symbol: string;
  totalBidLiquidity: number;
  totalAskLiquidity: number;
  bidLevels: number;
  askLevels: number;
  liquidityScore: number;
  imbalance: number;
  depthQuality: string;
  avgBidSize: number;
  avgAskSize: number;
}

// 🔥 DEFAULT SYMBOLS
const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

export default function LiquidityAnalysisModule() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [liquidityData, setLiquidityData] = useState<
    Map<string, LiquidityData>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");

  // 🔥 CUSTOM SYMBOLS (localStorage)
  const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("liquidity-analysis-symbols");
      return stored ? JSON.parse(stored) : DEFAULT_SYMBOLS;
    }
    return DEFAULT_SYMBOLS;
  });

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "liquidity-analysis-symbols",
        JSON.stringify(customSymbols)
      );
    }
  }, [customSymbols]);

  useEffect(() => {
    let mounted = true;
    const unsubscribers: (() => void)[] = [];

    // 🔥 Subscribe to all custom symbols
    customSymbols.forEach((symbol) => {
      const stream = `${symbol.toLowerCase()}@depth20@100ms`;

      const unsubscribe = wsService.subscribe(stream, (data) => {
        if (!mounted) return;

        try {
          if (
            data.bids &&
            data.asks &&
            data.bids.length > 0 &&
            data.asks.length > 0
          ) {
            // Calculate total liquidity (all 20 levels)
            const totalBidLiquidity = data.bids.reduce(
              (sum: number, [price, qty]: [string, string]) =>
                sum + parseFloat(price) * parseFloat(qty),
              0
            );

            const totalAskLiquidity = data.asks.reduce(
              (sum: number, [price, qty]: [string, string]) =>
                sum + parseFloat(price) * parseFloat(qty),
              0
            );

            // Count levels
            const bidLevels = data.bids.length;
            const askLevels = data.asks.length;

            // Average order size
            const avgBidSize =
              data.bids.reduce(
                (sum: number, [_, qty]: [string, string]) =>
                  sum + parseFloat(qty),
                0
              ) / bidLevels;

            const avgAskSize =
              data.asks.reduce(
                (sum: number, [_, qty]: [string, string]) =>
                  sum + parseFloat(qty),
                0
              ) / askLevels;

            // Liquidity imbalance
            const totalLiquidity = totalBidLiquidity + totalAskLiquidity;
            const imbalance =
              totalLiquidity > 0
                ? ((totalBidLiquidity - totalAskLiquidity) / totalLiquidity) *
                  100
                : 0;

            // 🔥 Liquidity Score (0-100)
            const minLiquidity = 10000; // $10k minimum
            const maxLiquidity = 1000000; // $1M maximum
            const avgLiquidity = (totalBidLiquidity + totalAskLiquidity) / 2;
            const liquidityScore = Math.min(
              100,
              Math.max(
                0,
                ((avgLiquidity - minLiquidity) /
                  (maxLiquidity - minLiquidity)) *
                  100
              )
            );

            // Depth quality assessment
            let depthQuality = "Poor";
            if (avgLiquidity > 500000) depthQuality = "Excellent";
            else if (avgLiquidity > 100000) depthQuality = "Good";
            else if (avgLiquidity > 50000) depthQuality = "Fair";

            setLiquidityData((prev) => {
              const next = new Map(prev);
              next.set(symbol, {
                symbol,
                totalBidLiquidity,
                totalAskLiquidity,
                bidLevels,
                askLevels,
                liquidityScore,
                imbalance,
                depthQuality,
                avgBidSize,
                avgAskSize,
              });
              return next;
            });

            setLoading(false);
          }
        } catch (error) {
          console.error("[LiquidityAnalysis] Parse error:", error);
        }
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      mounted = false;
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [customSymbols]);

  // 🔥 Add symbol
  const addSymbol = () => {
    const formatted = newSymbol.toUpperCase().trim();
    if (!formatted) {
      alert("Please enter a symbol");
      return;
    }

    const symbol = formatted.includes("USDT") ? formatted : `${formatted}USDT`;

    if (customSymbols.includes(symbol)) {
      alert("Symbol already in watchlist");
      return;
    }

    setCustomSymbols([...customSymbols, symbol]);
    setSelectedSymbol(symbol);
    setNewSymbol("");
    setShowAddModal(false);
  };

  // 🔥 Remove symbol
  const removeSymbol = (symbol: string) => {
    if (customSymbols.length <= 1) {
      alert("Must have at least 1 symbol");
      return;
    }

    setCustomSymbols(customSymbols.filter((s) => s !== symbol));
    if (selectedSymbol === symbol) {
      setSelectedSymbol(customSymbols.filter((s) => s !== symbol)[0]);
    }
  };

  const currentData = liquidityData.get(selectedSymbol);
  const totalLiquidity = currentData
    ? currentData.totalBidLiquidity + currentData.totalAskLiquidity
    : 0;

  return (
    <div className="relative space-y-3 text-xs h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-white/60 text-xs flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          <span className="font-semibold text-white/90">
            Liquidity Analysis
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none"
          >
            {customSymbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-2 py-1 flex items-center gap-1 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-white/40 text-[10px]">
          Connecting to live data...
        </div>
      ) : currentData ? (
        <div className="flex-1 overflow-y-auto space-y-2">
          {/* Total Liquidity */}
          <div className="bg-white/5 border border-white/10 rounded p-3">
            <div className="text-white/40 text-[10px] mb-1">
              Total Liquidity (20 levels)
            </div>
            <div className="text-white text-2xl font-bold">
              $
              {totalLiquidity.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>

          {/* Bid/Ask Liquidity */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">
                Bid Liquidity
              </div>
              <div className="text-emerald-400 font-semibold">
                $
                {currentData.totalBidLiquidity.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">
                Ask Liquidity
              </div>
              <div className="text-red-400 font-semibold">
                $
                {currentData.totalAskLiquidity.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>

          {/* Liquidity Score */}
          <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-[10px]">Liquidity Score</span>
              <span
                className={`font-bold text-lg ${
                  currentData.liquidityScore >= 80
                    ? "text-emerald-400"
                    : currentData.liquidityScore >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {currentData.liquidityScore.toFixed(1)}/100
              </span>
            </div>

            {/* Score Bar */}
            <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  currentData.liquidityScore >= 80
                    ? "bg-emerald-500"
                    : currentData.liquidityScore >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${currentData.liquidityScore}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/50">Depth Quality</span>
              <span
                className={`font-semibold ${
                  currentData.depthQuality === "Excellent"
                    ? "text-emerald-400"
                    : currentData.depthQuality === "Good"
                    ? "text-blue-400"
                    : currentData.depthQuality === "Fair"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {currentData.depthQuality}
              </span>
            </div>
          </div>

          {/* Order Book Depth */}
          <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
            <div className="text-white/40 text-[10px] font-semibold">
              Order Book Depth
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-white/50">Bid Levels</span>
                <span className="text-emerald-400 font-semibold">
                  {currentData.bidLevels}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Ask Levels</span>
                <span className="text-red-400 font-semibold">
                  {currentData.askLevels}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Avg Bid Size</span>
                <span className="text-emerald-400 font-semibold">
                  {currentData.avgBidSize.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Avg Ask Size</span>
                <span className="text-red-400 font-semibold">
                  {currentData.avgAskSize.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Liquidity Imbalance */}
          <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
            <div className="text-white/40 text-[10px] font-semibold">
              Liquidity Imbalance
            </div>

            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/50">Balance</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  currentData.imbalance >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {currentData.imbalance >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(currentData.imbalance).toFixed(2)}%
                {currentData.imbalance >= 0 ? " Bid Heavy" : " Ask Heavy"}
              </span>
            </div>

            {/* Imbalance Bar */}
            <div className="h-2 w-full rounded bg-white/10 overflow-hidden flex">
              <div
                className="bg-emerald-500"
                style={{
                  width: `${50 + currentData.imbalance / 2}%`,
                }}
              />
              <div
                className="bg-red-500"
                style={{
                  width: `${50 - currentData.imbalance / 2}%`,
                }}
              />
            </div>
          </div>

          {/* Market Condition */}
          <div className="bg-white/5 border border-white/10 rounded p-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/50">Market Condition</span>
              <span
                className={`font-semibold ${
                  currentData.liquidityScore >= 80 &&
                  Math.abs(currentData.imbalance) < 10
                    ? "text-emerald-400"
                    : currentData.liquidityScore >= 50
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {currentData.liquidityScore >= 80 &&
                Math.abs(currentData.imbalance) < 10
                  ? "Highly Liquid & Balanced"
                  : currentData.liquidityScore >= 50
                  ? "Moderate Liquidity"
                  : "Low Liquidity"}
              </span>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE DATA (100ms)
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-white/40 text-[10px]">
          No data available
        </div>
      )}

      {/* 🔥 ADD SYMBOL MODAL */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">Add Symbol</h3>
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewSymbol("");
              }}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 p-3 space-y-3">
            <div>
              <label className="block text-white/50 mb-1.5 text-[10px] font-semibold">
                Symbol Name
              </label>
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSymbol();
                }}
                placeholder="BTC, ETH, SOL..."
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none focus:border-emerald-500/50 placeholder:text-white/30"
                autoFocus
              />
              <div className="text-[9px] text-white/40 mt-1.5">
                Automatically adds USDT (e.g., BTC → BTCUSDT)
              </div>
            </div>

            {/* Popular Symbols */}
            <div>
              <div className="text-white/50 mb-2 text-[10px] font-semibold">
                Popular Symbols
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "BTC",
                  "ETH",
                  "BNB",
                  "SOL",
                  "XRP",
                  "ADA",
                  "DOGE",
                  "AVAX",
                  "DOT",
                  "MATIC",
                  "LINK",
                  "UNI",
                ].map((sym) => {
                  const fullSymbol = `${sym}USDT`;
                  const isAdded = customSymbols.includes(fullSymbol);

                  return (
                    <button
                      key={sym}
                      onClick={() => {
                        if (!isAdded) {
                          setCustomSymbols([...customSymbols, fullSymbol]);
                          setSelectedSymbol(fullSymbol);
                          setShowAddModal(false);
                        }
                      }}
                      disabled={isAdded}
                      className={`py-2 rounded text-xs font-semibold transition-colors ${
                        isAdded
                          ? "bg-white/5 text-white/30 cursor-not-allowed"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Watchlist */}
            <div>
              <div className="text-white/50 mb-2 text-[10px] font-semibold">
                Current Watchlist ({customSymbols.length})
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {customSymbols.map((sym) => (
                  <div
                    key={sym}
                    className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5 text-xs"
                  >
                    <span className="text-white">{sym}</span>
                    <button
                      onClick={() => removeSymbol(sym)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-white/10">
            <button
              onClick={addSymbol}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-semibold text-xs transition-colors"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
