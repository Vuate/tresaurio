// components/terminal/personalized-dashboard/MarketEfficiencyModule.tsx

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { RefreshCw, AlertTriangle, Plus, X } from "lucide-react";
import { useOrderBook, useTicker } from "@/hooks";
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

interface EfficiencyData {
  symbol: string;
  score: number;
  spread: number;
  spreadPercent: number;
  depth: number;
  volume24h: number;
  volatility: number;
  loading: boolean;
  error?: string | null;
}

const DEFAULT_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

const MAX_SYMBOLS = 10;

// Component for tracking a single symbol's efficiency
function SymbolEfficiencyTracker({
  symbol,
  marketType,
  exchange,
}: {
  symbol: string;
  marketType: "spot" | "futures";
  exchange: Exchange;
}): EfficiencyData | null {
  const { bids, asks, spread, spreadPercent, midPrice, loading: obLoading, error: obError } = useOrderBook({
    symbol,
    marketType,
    exchange,
    limit: 20,
    timeoutMs: 30000,
  });

  const { data: ticker, loading: tickerLoading, error: tickerError } = useTicker({
    symbol,
    marketType,
    exchange,
    timeoutMs: 30000,
  });

  const loading = obLoading || tickerLoading;
  const error = obError || tickerError;

  const efficiency = useMemo(() => {
    if (error) {
      return {
        symbol,
        score: 0,
        spread: 0,
        spreadPercent: 0,
        depth: 0,
        volume24h: 0,
        volatility: 0,
        loading: false,
        error: error as string,
      };
    }

    if (loading || !bids || !asks || !ticker || bids.length === 0 || asks.length === 0) {
      return null;
    }

    const range1Pct = midPrice * 0.01;
    const depth =
      bids.filter(b => midPrice - b.price <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0) +
      asks.filter(a => a.price - midPrice <= range1Pct).reduce((sum, l) => sum + l.price * l.quantity, 0);

    const volatility = ticker.lastPrice > 0
      ? ((ticker.highPrice - ticker.lowPrice) / ticker.lastPrice) * 100
      : 0;

    const spreadScore = Math.max(0, 100 - (spreadPercent * 1000));
    const depthScore = Math.min(100, (depth / 10000000) * 100);
    const volumeScore = Math.min(100, (ticker.quoteVolume / 1000000000) * 50);
    const volatilityScore = Math.max(0, 100 - (volatility * 10));

    const score = Math.round(
      spreadScore * 0.3 +
      depthScore * 0.3 +
      volumeScore * 0.2 +
      volatilityScore * 0.2
    );

    return {
      symbol,
      score,
      spread,
      spreadPercent,
      depth,
      volume24h: ticker.quoteVolume,
      volatility,
      loading: false,
    };
  }, [symbol, bids, asks, ticker, midPrice, spread, spreadPercent, loading, error]);

  return efficiency;
}

export default function MarketEfficiencyModule({ instanceId }: Props) {
  const storageKey = `market-efficiency-${instanceId}`;

  const [sortBy, setSortBy] = useState<"score" | "spread" | "volume">("score");
  const [marketType, setMarketType] = useState<"spot" | "futures">("spot");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [newSymbol, setNewSymbol] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.marketType) setMarketType(settings.marketType);
          if (settings.sortBy) setSortBy(settings.sortBy);
          if (settings.exchange) setExchange(settings.exchange);
          if (settings.symbols && Array.isArray(settings.symbols)) setSymbols(settings.symbols);
        } catch (err) {
          console.error("[MarketEfficiency] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ marketType, sortBy, exchange, symbols }));
    }
  }, [marketType, sortBy, exchange, symbols, storageKey]);

  // Close exchange dropdown on outside click
  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (exchangeRef.current && !exchangeRef.current.contains(e.target as Node)) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  const addSymbol = useCallback(() => {
    const symbol = newSymbol.toUpperCase().trim();
    if (!symbol) return;

    const finalSymbol = symbol.endsWith("USDT") ? symbol : `${symbol}USDT`;

    if (symbols.includes(finalSymbol)) {
      alert("Symbol already exists");
      return;
    }

    if (symbols.length >= MAX_SYMBOLS) {
      alert(`Maximum ${MAX_SYMBOLS} symbols allowed`);
      return;
    }

    setSymbols(prev => [...prev, finalSymbol]);
    setNewSymbol("");
    setShowAddForm(false);
  }, [newSymbol, symbols]);

  const removeSymbol = useCallback((symbolToRemove: string) => {
    setSymbols(prev => prev.filter(s => s !== symbolToRemove));
  }, []);

  // Track all symbols with multi-exchange support (fixed slots for hooks)
  const slot0 = SymbolEfficiencyTracker({ symbol: symbols[0] || "BTCUSDT", marketType, exchange });
  const slot1 = SymbolEfficiencyTracker({ symbol: symbols[1] || "ETHUSDT", marketType, exchange });
  const slot2 = SymbolEfficiencyTracker({ symbol: symbols[2] || "SOLUSDT", marketType, exchange });
  const slot3 = SymbolEfficiencyTracker({ symbol: symbols[3] || "BNBUSDT", marketType, exchange });
  const slot4 = SymbolEfficiencyTracker({ symbol: symbols[4] || "XRPUSDT", marketType, exchange });
  const slot5 = SymbolEfficiencyTracker({ symbol: symbols[5] || "ADAUSDT", marketType, exchange });
  const slot6 = SymbolEfficiencyTracker({ symbol: symbols[6] || "DOGEUSDT", marketType, exchange });
  const slot7 = SymbolEfficiencyTracker({ symbol: symbols[7] || "AVAXUSDT", marketType, exchange });
  const slot8 = SymbolEfficiencyTracker({ symbol: symbols[8] || "DOTUSDT", marketType, exchange });
  const slot9 = SymbolEfficiencyTracker({ symbol: symbols[9] || "LINKUSDT", marketType, exchange });

  const allSlots = [slot0, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9];

  const allData = useMemo(() => {
    return allSlots
      .slice(0, symbols.length)
      .filter((d): d is EfficiencyData => d !== null);
  }, [allSlots, symbols.length]);

  const sortedData = useMemo(() => {
    return [...allData]
      .filter(d => !d.error)
      .sort((a, b) => {
        switch (sortBy) {
          case "score":
            return b.score - a.score;
          case "spread":
            return a.spreadPercent - b.spreadPercent;
          case "volume":
            return b.volume24h - a.volume24h;
          default:
            return 0;
        }
      });
  }, [allData, sortBy]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* 🎯 Fully Responsive Header */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-2 py-1.5 flex-shrink-0">
        {/* Title */}
        <span className="font-semibold text-white/90 text-[10px] whitespace-nowrap">
          Market Efficiency
        </span>

        {/* Separator */}
        <span className="text-white/40 text-[10px]">•</span>

        {/* Status */}
        <span className="text-emerald-400 text-[10px] whitespace-nowrap">
          LIVE
        </span>

        {/* Spacer */}
        <div className="flex-1 min-w-[10px]"></div>

        {/* Market Type Toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setMarketType("spot")}
            className={`h-6 px-2 rounded text-[10px] font-medium transition-all whitespace-nowrap ${
              marketType === "spot"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Spot
          </button>
          <button
            onClick={() => setMarketType("futures")}
            className={`h-6 px-2 rounded text-[10px] font-medium transition-all whitespace-nowrap ${
              marketType === "futures"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Futures
          </button>
        </div>

        {/* Exchange Dropdown */}
        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="
              h-6 px-2 rounded
              bg-[#0b1f1f]
              border border-white/10
              text-white text-[10px]
              flex items-center gap-1
              cursor-pointer
              hover:bg-white/5
              transition-all
              whitespace-nowrap
            "
          >
            <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
            <span
              className={`
                text-white/50 text-[9px]
                transition-transform duration-200
                ${exchangeOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

          {exchangeOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute right-0 mt-1 z-50
                w-[100px]
                max-h-[140px]
                overflow-y-auto
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded
                shadow-lg
                animate-in fade-in slide-in-from-top-2 duration-200

                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchange(ex.id as Exchange);
                    setExchangeOpen(false);
                  }}
                  className="
                    w-full px-2 py-1.5
                    text-left text-[10px]
                    bg-transparent cursor-pointer
                    text-white
                    transition-colors
                    hover:bg-emerald-500/10
                    hover:text-emerald-400
                  "
                >
                  {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

{/* 🔥 Sort Options + Add Button - CONTAINER RESPONSIVE */}
<div className="@container px-2 py-1.5 border-y border-white/10 flex-shrink-0">
  <div className="grid grid-cols-2 @[280px]:grid-cols-4 gap-1.5">
    {/* Score Button */}
    <button
      onClick={() => setSortBy("score")}
      className={`
        py-1 rounded text-[10px] font-medium
        border transition-all duration-150
        cursor-pointer
        whitespace-nowrap
        ${
          sortBy === "score"
            ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
            : `
                bg-white/10 text-white border-white/10
                hover:bg-teal-500/15
                hover:border-teal-400/40
                hover:text-teal-400
              `
        }
      `}
    >
      Score
    </button>

    {/* Spread Button */}
    <button
      onClick={() => setSortBy("spread")}
      className={`
        py-1 rounded text-[10px] font-medium
        border transition-all duration-150
        cursor-pointer
        whitespace-nowrap
        ${
          sortBy === "spread"
            ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
            : `
                bg-white/10 text-white border-white/10
                hover:bg-teal-500/15
                hover:border-teal-400/40
                hover:text-teal-400
              `
        }
      `}
    >
      Spread
    </button>

    {/* Volume Button */}
    <button
      onClick={() => setSortBy("volume")}
      className={`
        py-1 rounded text-[10px] font-medium
        border transition-all duration-150
        cursor-pointer
        whitespace-nowrap
        ${
          sortBy === "volume"
            ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
            : `
                bg-white/10 text-white border-white/10
                hover:bg-teal-500/15
                hover:border-teal-400/40
                hover:text-teal-400
              `
        }
      `}
    >
      Volume
    </button>

    {/* Add Button */}
    <button
      onClick={() => setShowAddForm(!showAddForm)}
      disabled={symbols.length >= MAX_SYMBOLS}
      className="py-1 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1 cursor-pointer font-medium text-[10px] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Plus className="w-2.5 h-2.5" />
      Add
    </button>
  </div>
</div>

      {/* Add Symbol Form */}
      {showAddForm && (
        <div className="px-2 py-1.5 border-b border-white/10 bg-white/5 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && addSymbol()}
              placeholder="BTC, ETH, SOL..."
              className="flex-1 min-w-0 px-2 py-1 rounded text-[10px] bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-blue-500/50 transition-colors"
            />
            <button
              onClick={addSymbol}
              className="px-2 py-1 rounded text-[10px] font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewSymbol(""); }}
              className="px-1.5 py-1 rounded text-[10px] bg-white/10 text-white/60 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="text-[9px] text-white/40">
            {symbols.length}/{MAX_SYMBOLS} symbols • USDT added auto
          </div>
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="
          flex-1 min-h-0
          overflow-y-auto
          px-2 pb-2

          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {/* Error State */}
        {allData.length > 0 && allData.every(d => d.error) ? (
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1.5" />
              <div className="text-[10px] text-red-400 mb-1 font-medium">Failed to load</div>
              <div className="text-[9px] text-white/40">
                {exchange.toUpperCase()} error
              </div>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          /* Loading State */
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-1.5"></div>
              <div className="text-[10px] text-white/60">Loading...</div>
              <div className="text-[9px] text-white/40 mt-0.5">
                {exchange.toUpperCase()}
              </div>
            </div>
          </div>
        ) : (
          /* Market Efficiency Cards */
          <div className="space-y-1.5 pt-2">
            {sortedData.map((data) => (
              <div
                key={data.symbol}
                className="p-2 rounded bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-white text-[11px] truncate">
                      {data.symbol.replace("USDT", "")}/USDT
                    </span>
                    {symbols.length > 1 && (
                      <button
                        onClick={() => removeSymbol(data.symbol)}
                        className="p-0.5 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                        title="Remove"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-lg font-bold ${getScoreColor(data.score)}`}>
                      {data.score}
                    </span>
                    <span className="text-[9px] text-white/60 whitespace-nowrap">
                      {getScoreLabel(data.score)}
                    </span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-2">
                  <div className="bg-white/5 rounded px-1.5 py-1 min-w-0">
                    <div className="text-white/50 mb-0.5 truncate">Spread</div>
                    <div className="text-white font-semibold truncate">
                      {data.spreadPercent.toFixed(3)}%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded px-1.5 py-1 min-w-0">
                    <div className="text-white/50 mb-0.5 truncate">Depth</div>
                    <div className="text-white font-semibold truncate">
                      ${(data.depth / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div className="bg-white/5 rounded px-1.5 py-1 min-w-0">
                    <div className="text-white/50 mb-0.5 truncate">Vol 24h</div>
                    <div className="text-white font-semibold truncate">
                      ${(data.volume24h / 1000000000).toFixed(2)}B
                    </div>
                  </div>
                  <div className="bg-white/5 rounded px-1.5 py-1 min-w-0">
                    <div className="text-white/50 mb-0.5 truncate">Volatility</div>
                    <div className="text-white font-semibold truncate">
                      {data.volatility.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreBgColor(data.score)} transition-all`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}