// components/terminal/personalized-dashboard/LiquidityAnalysisModule.tsx
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance", active: true },
  { id: "okx", name: "OKX", active: true },
  { id: "bybit", name: "Bybit", active: true },
  { id: "coinbase", name: "Coinbase", active: true },
];

const SYMBOLS_BY_EXCHANGE = {
  binance: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT"],
  okx: ["BTC-USDT", "ETH-USDT", "SOL-USDT", "BNB-USDT", "XRP-USDT", "ADA-USDT"],
  bybit: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT"],
  coinbase: ["BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD", "ADA-USD"],
};

export default function LiquidityAnalysisModule({ instanceId }: Props) {
  const exchangeStorageKey = `liquidity-analysis-${instanceId}-exchange`;
  const symbolStorageKey = `liquidity-analysis-${instanceId}-symbol`;

  const [exchangeOpen, setExchangeOpen] = useState(false);
const [symbolOpen, setSymbolOpen] = useState(false);

const exchangeRef = useRef<HTMLDivElement>(null);
const symbolRef = useRef<HTMLDivElement>(null);

  // Exchange state
  const [exchange, setExchange] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(exchangeStorageKey) || "binance";
    }
    return "binance";
  });

  // Symbol state
  const [symbol, setSymbol] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(symbolStorageKey);
      if (saved) return saved;
    }
    return SYMBOLS_BY_EXCHANGE[exchange as keyof typeof SYMBOLS_BY_EXCHANGE][0];
  });

  // Save exchange to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(exchangeStorageKey, exchange);
    }
  }, [exchange, exchangeStorageKey]);

  // Save symbol to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(symbolStorageKey, symbol);
    }
  }, [symbol, symbolStorageKey]);

  // When exchange changes, update symbol to first available
  useEffect(() => {
    const availableSymbols =
      SYMBOLS_BY_EXCHANGE[exchange as keyof typeof SYMBOLS_BY_EXCHANGE];
    if (!availableSymbols.includes(symbol)) {
      setSymbol(availableSymbols[0]);
    }
  }, [exchange, symbol]);

  useEffect(() => {
  function handle(e: MouseEvent) {
    if (
      exchangeRef.current &&
      !exchangeRef.current.contains(e.target as Node)
    ) {
      setExchangeOpen(false);
    }

    if (
      symbolRef.current &&
      !symbolRef.current.contains(e.target as Node)
    ) {
      setSymbolOpen(false);
    }
  }

  document.addEventListener("pointerdown", handle);
  return () => document.removeEventListener("pointerdown", handle);
}, []);


  // Mock liquidity data
  const liquidityData = useMemo(() => {
    const bidVolume = 50000000 + Math.random() * 100000000; // $50M - $150M
    const askVolume = 45000000 + Math.random() * 100000000; // $45M - $145M
    const totalVolume = bidVolume + askVolume;
    const imbalance = ((bidVolume - askVolume) / totalVolume) * 100;

    const spread = 0.01 + Math.random() * 0.05; // 0.01% - 0.06%
    const depth1pct = 5000000 + Math.random() * 20000000; // $5M - $25M
    const depth5pct = 15000000 + Math.random() * 50000000; // $15M - $65M

    const liquidityScore = Math.min(100, (depth1pct / 25000000) * 100);

    let rating: "Excellent" | "Good" | "Fair" | "Poor";
    if (liquidityScore >= 80) rating = "Excellent";
    else if (liquidityScore >= 60) rating = "Good";
    else if (liquidityScore >= 40) rating = "Fair";
    else rating = "Poor";

    return {
      bidVolume,
      askVolume,
      totalVolume,
      imbalance,
      spread,
      depth1pct,
      depth5pct,
      liquidityScore,
      rating,
    };
  }, [symbol, exchange]);

  const availableSymbols =
    SYMBOLS_BY_EXCHANGE[exchange as keyof typeof SYMBOLS_BY_EXCHANGE];

return (
  <div className="space-y-3 text-xs h-full flex flex-col">
    {/* Fixed Header Section */}
    <div className="flex-shrink-0 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        {/* SOL YAZI */}
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">
            Liquidity Analysis
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-white/70">{symbol}</span>
          <span className="text-white/40"> • </span>
          <span
            className={
              exchange === "binance" ? "text-emerald-400" : "text-yellow-400"
            }
          >
            {exchange === "binance" ? "LIVE" : "MOCK"}
          </span>
        </div>

        {/* EXCHANGE */}
        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen(v => !v)}
            className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2 cursor-pointer"
          >
            {exchange.charAt(0).toUpperCase() + exchange.slice(1)}

            <span className={`transition-transform ${exchangeOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {exchangeOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute z-50 mt-1
                w-[140px]
                bg-[#0b1f1f]
                right-0 left-auto
                border border-emerald-500/20
                rounded-none

                max-h-[min(72px,30vh)]
                overflow-y-auto
                overflow-x-hidden

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {EXCHANGES.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchange(ex.id);
                    setExchangeOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-white hover:text-emerald-400 cursor-pointer"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SYMBOL */}
        <div ref={symbolRef} className="relative">
          <button
            onClick={() => setSymbolOpen(v => !v)}
            className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2 cursor-pointer"
          >
            {symbol}
            <span className={`transition-transform ${symbolOpen ? "rotate-180" : ""}`}>
              ▾
            </span>
          </button>

          {symbolOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute z-50 mt-1
                right-0 left-auto

                w-[140px]
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-none

                max-h-[min(72px,30vh)]
                overflow-y-auto
                overflow-x-hidden

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {availableSymbols.map(sym => (
                <button
                  key={sym}
                  onClick={() => {
                    setSymbol(sym);
                    setSymbolOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-white hover:text-emerald-400 cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exchange Warning */}
      {exchange !== "binance" && (
        <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs">
          ⚠️ {EXCHANGES.find((e) => e.id === exchange)?.name} WebSocket coming
          soon. Showing mock liquidity data.
        </div>
      )}
    </div>

    {/* Scrollable Content */}
    <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-3
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-teal-400/40
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70
      scrollbar-thin
      scrollbar-thumb-teal-400/40
      scrollbar-track-transparent
    ">
      {/* Liquidity Score Card */}
      <div className="px-3 py-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/50 text-[10px]">Liquidity Score</div>
          <BarChart3 className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-white">
            {liquidityData.liquidityScore.toFixed(0)}
          </div>
          <div
            className={`text-xs font-semibold ${
              liquidityData.rating === "Excellent"
                ? "text-emerald-400"
                : liquidityData.rating === "Good"
                ? "text-blue-400"
                : liquidityData.rating === "Fair"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {liquidityData.rating}
          </div>
        </div>
        <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${liquidityData.liquidityScore}%` }}
          />
        </div>
      </div>

      {/* Volume Analysis */}
      <div className="space-y-2">
        <div className="text-white/50 text-[10px] font-semibold uppercase">
          Volume Analysis
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white/50 text-[10px]">Bid Volume</div>
            <div className="text-emerald-400 font-semibold font-mono">
              ${(liquidityData.bidVolume / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="text-white/50 text-[10px]">Ask Volume</div>
            <div className="text-red-400 font-semibold font-mono">
              ${(liquidityData.askVolume / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>

        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="text-white/50 text-[10px]">Total Volume</div>
          <div className="text-white font-semibold font-mono">
            ${(liquidityData.totalVolume / 1000000).toFixed(2)}M
          </div>
        </div>

        {/* Imbalance Bar */}
        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <div className="text-white/50 text-[10px]">
              Order Book Imbalance
            </div>
            <div
              className={`text-[10px] font-semibold ${
                Math.abs(liquidityData.imbalance) > 10
                  ? "text-yellow-400"
                  : "text-white/70"
              }`}
            >
              {liquidityData.imbalance > 0 ? "+" : ""}
              {liquidityData.imbalance.toFixed(2)}%
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500"
              style={{ width: `${50 + liquidityData.imbalance / 2}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${50 - liquidityData.imbalance / 2}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-white/40 mt-1">
            <span>Buy Pressure</span>
            <span>Sell Pressure</span>
          </div>
        </div>
      </div>

      {/* Depth Analysis */}
      <div className="space-y-2">
        <div className="text-white/50 text-[10px] font-semibold uppercase">
          Market Depth
        </div>

        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-1">
            <div className="text-white/50 text-[10px]">±1% Depth</div>
            <div className="text-white font-mono text-[11px]">
              ${(liquidityData.depth1pct / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min(
                  100,
                  (liquidityData.depth1pct / 25000000) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center mb-1">
            <div className="text-white/50 text-[10px]">±5% Depth</div>
            <div className="text-white font-mono text-[11px]">
              ${(liquidityData.depth5pct / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500"
              style={{
                width: `${Math.min(
                  100,
                  (liquidityData.depth5pct / 65000000) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-white/50 text-[10px]">Spread</div>
            <div
              className={`font-mono text-[11px] ${
                liquidityData.spread < 0.03
                  ? "text-emerald-400"
                  : "text-yellow-400"
              }`}
            >
              {liquidityData.spread.toFixed(3)}%
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-start gap-2">
          {liquidityData.rating === "Excellent" ||
          liquidityData.rating === "Good" ? (
            <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
          )}
          <div>
            <div className="text-white text-[10px] font-semibold mb-1">
              Analysis
            </div>
            <div className="text-white/60 text-[10px] leading-relaxed">
              {liquidityData.rating === "Excellent" &&
                "Excellent liquidity with tight spreads. Ideal for large orders with minimal slippage."}
              {liquidityData.rating === "Good" &&
                "Good liquidity available. Suitable for most trading strategies with reasonable slippage."}
              {liquidityData.rating === "Fair" &&
                "Fair liquidity. Consider market impact when placing large orders."}
              {liquidityData.rating === "Poor" &&
                "Limited liquidity. Exercise caution with order sizes to avoid significant slippage."}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
