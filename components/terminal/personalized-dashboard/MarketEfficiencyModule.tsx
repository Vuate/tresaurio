// components/terminal/personalized-dashboard/MarketEfficiencyModule.tsx

import { useState, useMemo, useEffect, useRef } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
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

const TRACKED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

// ✅ BACKEND UNCHANGED
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
  
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.marketType) setMarketType(settings.marketType);
          if (settings.sortBy) setSortBy(settings.sortBy);
          if (settings.exchange) setExchange(settings.exchange);
        } catch (err) {
          console.error("[MarketEfficiency] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ marketType, sortBy, exchange }));
    }
  }, [marketType, sortBy, exchange, storageKey]);

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

  const btcData = SymbolEfficiencyTracker({ symbol: "BTCUSDT", marketType, exchange });
  const ethData = SymbolEfficiencyTracker({ symbol: "ETHUSDT", marketType, exchange });
  const solData = SymbolEfficiencyTracker({ symbol: "SOLUSDT", marketType, exchange });
  const bnbData = SymbolEfficiencyTracker({ symbol: "BNBUSDT", marketType, exchange });
  const xrpData = SymbolEfficiencyTracker({ symbol: "XRPUSDT", marketType, exchange });
  const adaData = SymbolEfficiencyTracker({ symbol: "ADAUSDT", marketType, exchange });

  const allData = useMemo(() => {
    return [btcData, ethData, solData, bnbData, xrpData, adaData].filter(
      (d): d is EfficiencyData => d !== null
    );
  }, [btcData, ethData, solData, bnbData, xrpData, adaData]);

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

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Market Efficiency
        </span>

        <span className="text-white/40 text-xs">•</span>

        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        <div className="flex-1 min-w-[20px]"></div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setMarketType("spot")}
            className={`h-7 px-3 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              marketType === "spot"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Spot
          </button>
          <button
            onClick={() => setMarketType("futures")}
            className={`h-7 px-3 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              marketType === "futures"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            Futures
          </button>
        </div>

        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="h-7 px-3 rounded-md bg-[#0b1f1f] border border-white/10 text-white text-xs flex items-center gap-1.5 cursor-pointer hover:bg-white/5 transition-all whitespace-nowrap"
          >
            <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
            <span
              className={`text-white/50 text-[10px] transition-transform duration-200 ${
                exchangeOpen ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>

          {exchangeOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="absolute right-0 mt-1 z-50 w-[120px] max-h-[160px] overflow-y-auto bg-[#0b1f1f] border border-emerald-500/20 rounded-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-emerald-500/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
            >
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchange(ex.id as Exchange);
                    setExchangeOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs bg-transparent cursor-pointer text-white transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-1.5 px-3 pb-2 flex-shrink-0">
        {(["score", "spread", "volume"] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
              sortBy === sort
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      <div
        ref={contentRef}
        className="flex-1 min-h-0 px-3 pb-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-teal-400/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70 scrollbar-thin scrollbar-thumb-teal-400/40 scrollbar-track-transparent"
      >
        {allData.length > 0 && allData.every(d => d.error) ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-xs text-red-400 mb-2">Failed to load market data</div>
              <div className="text-[10px] text-white/40">
                {exchange.toUpperCase()} connection error
              </div>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <div className="text-xs text-white/60">Loading market data...</div>
              <div className="text-[10px] text-white/40 mt-1">
                Connecting to {exchange.toUpperCase()}...
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedData.map((data) => (
              <div
                key={data.symbol}
                className="bg-white/5 rounded-md p-2 border border-white/10 hover:bg-white/8 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-white text-xs leading-tight truncate">
                    {data.symbol.replace("USDT", "")}/USDT
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-base font-bold leading-none ${getScoreColor(data.score)}`}>
                      {data.score}
                    </span>
                    <span className="text-[9px] text-white/60 whitespace-nowrap leading-tight">
                      {getScoreLabel(data.score)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] mb-1 leading-tight">
                  <div className="flex items-center gap-0.5">
                    <span className="text-white/50">Spread:</span>
                    <span className="text-white font-medium">
                      {data.spreadPercent.toFixed(3)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-white/50">Depth:</span>
                    <span className="text-white font-medium">
                      ${(data.depth / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-white/50">Volume:</span>
                    <span className="text-white font-medium">
                      ${(data.volume24h / 1000000000).toFixed(2)}B
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-white/50">Volatility:</span>
                    <span className="text-white font-medium">
                      {data.volatility.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      data.score >= 90
                        ? "bg-emerald-500"
                        : data.score >= 70
                          ? "bg-blue-500"
                          : data.score >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    } transition-all`}
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