"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { BarChart3, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";
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

const MARKET_TYPES = [
  { id: "spot", name: "Spot" },
  { id: "futures", name: "Futures" },
] as const;

const POPULAR_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
];

export default function LiquidityAnalysisModule({ instanceId }: Props) {
  const storageKey = `liquidity-analysis-${instanceId}`;

  // State
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [symbolOpen, setSymbolOpen] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.symbol) setSymbol(settings.symbol);
          if (settings.marketType) setMarketType(settings.marketType);
          if (settings.exchange) setExchange(settings.exchange);
        } catch (err) {
          console.error("[LiquidityAnalysis] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ symbol, marketType, exchange }));
    }
  }, [symbol, marketType, exchange, storageKey]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exchangeRef.current && !exchangeRef.current.contains(e.target as Node)) {
        setExchangeOpen(false);
      }
      if (marketRef.current && !marketRef.current.contains(e.target as Node)) {
        setMarketOpen(false);
      }
      if (symbolRef.current && !symbolRef.current.contains(e.target as Node)) {
        setSymbolOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //  USE REAL WEBSOCKET DATA with multi-exchange support
  const { bids, asks, midPrice, loading, error, status, retry } = useOrderBook({
    symbol,
    marketType,
    exchange,
    limit: 100,
    timeoutMs: 30000,
  });

  // REAL LIQUIDITY CALCULATION
  const liquidityData = useMemo(() => {
    if (!bids || !asks || bids.length === 0 || asks.length === 0 || midPrice === 0) {
      return null;
    }

    const bidVolume = bids.reduce((sum, level) => sum + level.price * level.quantity, 0);
    const askVolume = asks.reduce((sum, level) => sum + level.price * level.quantity, 0);
    const totalVolume = bidVolume + askVolume;

    const imbalance = totalVolume > 0 ? ((bidVolume - askVolume) / totalVolume) * 100 : 0;

    const bestBid = bids[0]?.price || 0;
    const bestAsk = asks[0]?.price || 0;
    const spread = bestBid > 0 && bestAsk > 0 ? ((bestAsk - bestBid) / midPrice) * 100 : 0;

    const range1Pct = midPrice * 0.01;
    const range5Pct = midPrice * 0.05;

    const depth1pct =
      bids.filter(b => midPrice - b.price <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

    const depth5pct =
      bids.filter(b => midPrice - b.price <= range5Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range5Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

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
  }, [bids, asks, midPrice]);

  return (
    <div className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      {/* Header */}
      <div className="relative z-50 flex items-center justify-between gap-2 flex-shrink-0 flex-wrap">
        <div className="text-[10px] sm:text-xs text-white/60">
          <span className="font-semibold text-white/90">
            <span className="hidden xs:inline">Liquidity Analysis</span>
            <span className="xs:hidden">Liquidity</span>
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-white/70">{symbol}</span>
          <span className="text-white/40"> • </span>
          <span
            className={
              status === "connected"
                ? "text-emerald-400"
                : status === "fallback"
                  ? "text-orange-400"
                  : "text-yellow-400"
            }
          >
            {status === "connected"
              ? "LIVE"
              : status === "fallback"
                ? "REST"
                : "CONNECTING"}
          </span>
        </div>

        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* Exchange Selector */}
<div ref={exchangeRef} className="relative">
  <button
    onClick={() => setExchangeOpen((v) => !v)}
    className="
      h-7 sm:h-8 px-2 sm:px-3 rounded-lg
      bg-[#0b1f1f]
      border border-white/10
      text-[10px] sm:text-xs text-white
      flex items-center gap-1.5 sm:gap-2
      cursor-pointer
      hover:bg-white/5
      transition-colors
    "
  >
    <span>
      {EXCHANGES.find((e) => e.id === exchange)?.name}
    </span>
    <span
      className={`
        text-white/50
        transition-transform duration-200
        ${exchangeOpen ? "rotate-180" : ""}
      `}
    >
      ▾
    </span>
  </button>

  {exchangeOpen && (() => {
    const buttonRect = exchangeRef.current?.getBoundingClientRect();
    const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;

    return (
      <div
        onWheel={(e) => e.stopPropagation()}
className={`
  absolute mt-1 z-[999]
  w-[120px] sm:w-[140px]
  bg-[#0b1f1f]
  border border-emerald-500/20
  rounded-lg
  overflow-hidden
  shadow-xl

  ${shouldOpenLeft ? 'right-0' : 'left-0'}
`}
      >
        {EXCHANGES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => {
              setExchange(ex.id as Exchange);
              setExchangeOpen(false);
            }}
            className="
              w-full px-2.5 sm:px-3 py-1.5 sm:py-2
              text-left text-[10px] sm:text-xs
              bg-transparent cursor-pointer
              text-white
              transition-colors
              hover:text-emerald-400
                hover:bg-emerald-500/10
            "
          >
            {ex.name}
          </button>
        ))}
      </div>
    );
  })()}
</div>

<div ref={marketRef} className="relative">
  <button
    onClick={() => setMarketOpen((v) => !v)}
    className="
      h-7 sm:h-8 px-2 sm:px-3 rounded-lg
      bg-[#0b1f1f]
      border border-white/10
      text-[10px] sm:text-xs text-white
      flex items-center gap-1.5 sm:gap-2
      cursor-pointer
      hover:bg-white/5
      transition-colors
    "
  >
    <span>{MARKET_TYPES.find((m) => m.id === marketType)?.name}</span>
    <span
      className={`
        text-white/50
        transition-transform duration-200
        ${marketOpen ? "rotate-180" : ""}
      `}
    >
      ▾
    </span>
  </button>

  {marketOpen && (() => {
    const buttonRect = marketRef.current?.getBoundingClientRect();
    const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;

    return (
      <div
        onWheel={(e) => e.stopPropagation()}
        className={`
          absolute mt-1 z-[999]
          w-[100px] sm:w-[120px]
          bg-[#0b1f1f]
          border border-emerald-500/20
          rounded-lg
          overflow-hidden
          shadow-xl

          ${shouldOpenLeft ? 'right-0' : 'left-0'}
        `}
      >
        {MARKET_TYPES.map((mt) => (
          <button
            key={mt.id}
            onClick={() => {
              setMarketType(mt.id);
              setMarketOpen(false);
            }}
            className="
              w-full px-2.5 sm:px-3 py-1.5 sm:py-2
              text-left text-[10px] sm:text-xs
              bg-transparent cursor-pointer
              text-white
              transition-colors
              hover:text-emerald-400
                hover:bg-emerald-500/10
            "
          >
            {mt.name}
          </button>
        ))}
      </div>
    );
  })()}
</div>

<div ref={symbolRef} className="relative">
  <button
    onClick={() => setSymbolOpen((v) => !v)}
    className="
      h-7 sm:h-8 px-2 sm:px-3 rounded-lg
      bg-[#0b1f1f]
      border border-white/10
      text-[10px] sm:text-xs text-white
      flex items-center gap-1.5 sm:gap-2
      cursor-pointer
      hover:bg-white/5
      transition-colors
    "
  >
    <span>{symbol}</span>
    <span
      className={`
        text-white/50
        transition-transform duration-200
        ${symbolOpen ? "rotate-180" : ""}
      `}
    >
      ▾
    </span>
  </button>

  {symbolOpen && (() => {
    const buttonRect = symbolRef.current?.getBoundingClientRect();
    const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;

    return (
      <div
        onWheel={(e) => e.stopPropagation()}
className={`
  absolute mt-1 z-[999]
  w-[120px] sm:w-[140px]
  bg-[#0b1f1f]
  border border-emerald-500/20
  rounded-lg
  overflow-hidden
  shadow-xl

  ${shouldOpenLeft ? 'right-0' : 'left-0'}
`}
      >
        {POPULAR_SYMBOLS.map((sym) => (
          <button
            key={sym}
            onClick={() => {
              setSymbol(sym);
              setSymbolOpen(false);
            }}
            className="
              w-full px-2.5 sm:px-3 py-1.5 sm:py-2
              text-left text-[10px] sm:text-xs
              bg-transparent cursor-pointer
              text-white
              transition-colors
              hover:text-emerald-400
              hover:bg-emerald-500/10
            "
          >
            {sym}
          </button>
        ))}
      </div>
    );
  })()}
</div>

        </div>
      </div>

      <div
        className="
          flex-1 min-h-0 space-y-1.5 sm:space-y-2
          overflow-y-auto
          px-1 sm:px-0

          [&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {loading && (
          <div className="px-2 sm:px-3 py-6 sm:py-8 rounded-lg bg-white/5 border border-white/10">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-400"></div>
              <div className="text-[9px] sm:text-[10px] text-white/60">Loading liquidity data...</div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="px-2 sm:px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-red-300">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={retry}
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-[9px] sm:text-[10px] font-medium flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Retry</span>
              </button>
            </div>
          </div>
        )}

        {!loading && !error && liquidityData && (
          <>
            <div className="px-2 sm:px-3 py-2 sm:py-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="text-white/50 text-[9px] sm:text-[10px]">Liquidity Score</div>
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {liquidityData.liquidityScore.toFixed(0)}
                </div>
                <div
                  className={`text-[10px] sm:text-xs font-semibold ${
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
              <div className="mt-1.5 sm:mt-2 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${liquidityData.liquidityScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-white/50 text-[9px] sm:text-[10px] font-semibold uppercase px-1">
                Volume Analysis
              </div>

<div className="grid grid-cols-2 gap-1.5 sm:gap-2">
  <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
    <div className="text-white/50 text-[9px] sm:text-[10px] mb-1">Bid Volume</div>
    <div className="text-emerald-400 font-semibold font-mono text-[10px] sm:text-xs break-all">
      ${(liquidityData.bidVolume / 1000000).toFixed(2)}M
    </div>
  </div>

  <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
    <div className="text-white/50 text-[9px] sm:text-[10px] mb-1">Ask Volume</div>
    <div className="text-red-400 font-semibold font-mono text-[10px] sm:text-xs break-all">
      ${(liquidityData.askVolume / 1000000).toFixed(2)}M
    </div>
  </div>
</div>

              <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-white/50 text-[9px] sm:text-[10px]">Total Volume</div>
                <div className="text-white font-semibold font-mono text-[10px] sm:text-xs">
                  ${(liquidityData.totalVolume / 1000000).toFixed(2)}M
                </div>
              </div>

              <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <div className="text-white/50 text-[9px] sm:text-[10px]">
                    Order Book Imbalance
                  </div>
                  <div
                    className={`text-[9px] sm:text-[10px] font-semibold ${
                      Math.abs(liquidityData.imbalance) > 10
                        ? "text-yellow-400"
                        : "text-white/70"
                    }`}
                  >
                    {liquidityData.imbalance > 0 ? "+" : ""}
                    {liquidityData.imbalance.toFixed(2)}%
                  </div>
                </div>
                <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${50 + liquidityData.imbalance / 2}%` }}
                  />
                  <div
                    className="bg-red-500 transition-all"
                    style={{ width: `${50 - liquidityData.imbalance / 2}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] sm:text-[9px] text-white/40 mt-1">
                  <span>Buy Pressure</span>
                  <span>Sell Pressure</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="text-white/50 text-[9px] sm:text-[10px] font-semibold uppercase px-1">
                Market Depth
              </div>

              <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-white/50 text-[9px] sm:text-[10px]">±1% Depth</div>
                  <div className="text-white font-mono text-[10px] sm:text-[11px]">
                    ${(liquidityData.depth1pct / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (liquidityData.depth1pct / 25000000) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-white/50 text-[9px] sm:text-[10px]">±5% Depth</div>
                  <div className="text-white font-mono text-[10px] sm:text-[11px]">
                    ${(liquidityData.depth5pct / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (liquidityData.depth5pct / 65000000) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="flex justify-between items-center">
                  <div className="text-white/50 text-[9px] sm:text-[10px]">Spread</div>
                  <div
                    className={`font-mono text-[10px] sm:text-[11px] ${
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

            <div className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-start gap-1.5 sm:gap-2">
                {liquidityData.rating === "Excellent" ||
                liquidityData.rating === "Good" ? (
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-white text-[9px] sm:text-[10px] font-semibold mb-0.5 sm:mb-1">
                    Analysis
                  </div>
                  <div className="text-white/60 text-[9px] sm:text-[10px] leading-relaxed">
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
          </>
        )}
      </div>
    </div>
  );
}