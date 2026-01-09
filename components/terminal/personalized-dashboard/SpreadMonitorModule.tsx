// components/terminal/personalized-dashboard/SpreadMonitorModule.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Plus, X } from "lucide-react";
import { wsService } from "@/services/WebSocketService";

interface SpreadData {
  symbol: string;
  bestBid: number;
  bestAsk: number;
  spread: number;
  spreadPercent: number;
  bidVolume: number;
  askVolume: number;
  imbalance: number;
  midPrice: number;
  // 🔥 YENİ METRIKLER
  totalBidDepth: number;
  totalAskDepth: number;
  weightedSpread: number;
  efficiency: number;
}

// 🔥 DEFAULT SYMBOLS
const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

export default function SpreadMonitorModule() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [spreadData, setSpreadData] = useState<Map<string, SpreadData>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");

  // 🔥 CUSTOM SYMBOLS (localStorage)
  const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("spread-monitor-symbols");
      return stored ? JSON.parse(stored) : DEFAULT_SYMBOLS;
    }
    return DEFAULT_SYMBOLS;
  });

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "spread-monitor-symbols",
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
            // Parse best bid/ask
            const bestBid = parseFloat(data.bids[0][0]);
            const bestAsk = parseFloat(data.asks[0][0]);
            const bidVolume = parseFloat(data.bids[0][1]);
            const askVolume = parseFloat(data.asks[0][1]);

            // Calculate total depth (top 5 levels)
            const totalBidDepth = data.bids
              .slice(0, 5)
              .reduce(
                (sum: number, [_, qty]: [string, string]) =>
                  sum + parseFloat(qty),
                0
              );
            const totalAskDepth = data.asks
              .slice(0, 5)
              .reduce(
                (sum: number, [_, qty]: [string, string]) =>
                  sum + parseFloat(qty),
                0
              );

            // Basic metrics
            const spread = bestAsk - bestBid;
            const midPrice = (bestBid + bestAsk) / 2;
            const spreadPercent = (spread / midPrice) * 100;

            // Volume imbalance
            const totalVolume = bidVolume + askVolume;
            const imbalance =
              totalVolume > 0
                ? ((bidVolume - askVolume) / totalVolume) * 100
                : 0;

            // 🔥 Weighted spread (considers depth)
            const totalDepth = totalBidDepth + totalAskDepth;
            const depthImbalance =
              totalDepth > 0
                ? ((totalBidDepth - totalAskDepth) / totalDepth) * 100
                : 0;
            const weightedSpread =
              spreadPercent * (1 + Math.abs(depthImbalance) / 100);

            // 🔥 Market efficiency score (0-100)
            const efficiency = Math.max(
              0,
              Math.min(100, 100 - spreadPercent * 1000)
            );

            setSpreadData((prev) => {
              const next = new Map(prev);
              next.set(symbol, {
                symbol,
                bestBid,
                bestAsk,
                spread,
                spreadPercent,
                bidVolume,
                askVolume,
                imbalance,
                midPrice,
                totalBidDepth,
                totalAskDepth,
                weightedSpread,
                efficiency,
              });
              return next;
            });

            setLoading(false);
          }
        } catch (error) {
          console.error("[SpreadMonitor] Parse error:", error);
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

  const currentData = spreadData.get(selectedSymbol);

  return (
    <div className="relative space-y-3 text-xs h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-white/60 text-xs">
          <span className="font-semibold text-white/90">Spread Monitor</span>
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
          {/* Mid Price */}
          <div className="bg-white/5 border border-white/10 rounded p-3">
            <div className="text-white/40 text-[10px] mb-1">Mid Price</div>
            <div className="text-white text-2xl font-bold">
              $
              {currentData.midPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Spread Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">Spread</div>
              <div className="text-white font-semibold">
                ${currentData.spread.toFixed(2)}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">Spread %</div>
              <div className="text-white font-semibold">
                {currentData.spreadPercent.toFixed(4)}%
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">Best Bid</div>
              <div className="text-emerald-400 font-semibold">
                $
                {currentData.bestBid.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">Best Ask</div>
              <div className="text-red-400 font-semibold">
                $
                {currentData.bestAsk.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* 🔥 Volume & Depth Analysis */}
          <div className="bg-white/5 border border-white/10 rounded p-3 space-y-2">
            <div className="text-white/40 text-[10px] font-semibold">
              Volume & Depth
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-white/50">Bid Volume</span>
                <span className="text-emerald-400 font-semibold">
                  {currentData.bidVolume.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Ask Volume</span>
                <span className="text-red-400 font-semibold">
                  {currentData.askVolume.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Bid Depth (5)</span>
                <span className="text-emerald-400 font-semibold">
                  {currentData.totalBidDepth.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Ask Depth (5)</span>
                <span className="text-red-400 font-semibold">
                  {currentData.totalAskDepth.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Order Imbalance */}
            <div className="space-y-1 pt-2 border-t border-white/5">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/50">Order Imbalance</span>
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
                  {currentData.imbalance >= 0 ? " Bid" : " Ask"}
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
          </div>

          {/* 🔥 Advanced Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">
                Weighted Spread
              </div>
              <div className="text-white font-semibold">
                {currentData.weightedSpread.toFixed(4)}%
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">
                Efficiency Score
              </div>
              <div
                className={`font-semibold ${
                  currentData.efficiency >= 90
                    ? "text-emerald-400"
                    : currentData.efficiency >= 70
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {currentData.efficiency.toFixed(1)}/100
              </div>
            </div>
          </div>

          {/* Market Quality */}
          <div className="bg-white/5 border border-white/10 rounded p-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/50">Market Quality</span>
              <span
                className={`font-semibold ${
                  currentData.spreadPercent < 0.01
                    ? "text-emerald-400"
                    : currentData.spreadPercent < 0.05
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {currentData.spreadPercent < 0.01
                  ? "Excellent"
                  : currentData.spreadPercent < 0.05
                  ? "Good"
                  : "Fair"}
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
