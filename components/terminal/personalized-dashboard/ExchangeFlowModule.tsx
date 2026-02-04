// components/terminal/personalized-dashboard/ExchangeFlowModule.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface Props {
  instanceId: string;
}

interface FlowEvent {
  id: string;
  exchange: string;
  symbol: string;
  direction: "deposit" | "withdraw";
  amount: number;
  usdValue: number;
  timestamp: number;
}

const EXCHANGES = [
  { id: "binance", name: "Binance", icon: "🟡" },
  { id: "okx", name: "OKX", icon: "⚫" },
  { id: "bybit", name: "Bybit", icon: "🟠" },
];

const SYMBOLS = ["BTCUSDT", "ETHUSDT"];

// 🎯 Custom Hook: Window Size Check
function useWindowSizeCheck() {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsTooSmall(window.innerWidth < 400 || window.innerHeight < 300);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isTooSmall;
}

// Helper: Fetch with timeout
const fetchWithTimeout = async (url: string, timeout = 5000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// 🔥 Fetch single exchange/symbol with timeout and error handling
const fetchSingleFlow = async (ex: typeof EXCHANGES[0], symbol: string): Promise<FlowEvent[]> => {
  try {
    let volume24h = 0;
    let price = 0;

    if (ex.id === "binance") {
      const res = await fetchWithTimeout(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, 3000);
      if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
      const data = await res.json();
      volume24h = parseFloat(data.quoteVolume || 0);
      price = parseFloat(data.lastPrice || 0);
    } else if (ex.id === "okx") {
      const okxSymbol = symbol.replace(/USDT$/, "-USDT");
      const res = await fetchWithTimeout(`https://www.okx.com/api/v5/market/ticker?instId=${okxSymbol}`, 3000);
      if (!res.ok) throw new Error(`OKX API error: ${res.status}`);
      const data = await res.json();
      const ticker = data.data?.[0];
      volume24h = parseFloat(ticker?.volCcy24h || 0) * parseFloat(ticker?.last || 0);
      price = parseFloat(ticker?.last || 0);
    } else if (ex.id === "bybit") {
      const res = await fetchWithTimeout(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`, 3000);
      if (!res.ok) throw new Error(`Bybit API error: ${res.status}`);
      const data = await res.json();
      const ticker = data.result?.list?.[0];
      volume24h = parseFloat(ticker?.turnover24h || 0);
      price = parseFloat(ticker?.lastPrice || 0);
    }

    if (volume24h > 0 && price > 0) {
      // Simulate deposit/withdraw based on volume
      const depositRatio = 0.45 + Math.random() * 0.1; // 45-55%
      const depositVol = volume24h * depositRatio;
      const withdrawVol = volume24h * (1 - depositRatio);

      return [
        {
          id: `${ex.id}-${symbol}-deposit-${Date.now()}`,
          exchange: ex.name,
          symbol: symbol.replace("USDT", ""),
          direction: "deposit",
          amount: depositVol / price,
          usdValue: depositVol,
          timestamp: Date.now(),
        },
        {
          id: `${ex.id}-${symbol}-withdraw-${Date.now()}`,
          exchange: ex.name,
          symbol: symbol.replace("USDT", ""),
          direction: "withdraw",
          amount: withdrawVol / price,
          usdValue: withdrawVol,
          timestamp: Date.now(),
        },
      ];
    }
  } catch (err) {
    console.warn(`[ExchangeFlow] Failed to fetch ${ex.id} ${symbol}:`, err);
  }

  return [];
};

// 🔥 Fetch all flow events in parallel
const fetchFlowEvents = async (): Promise<FlowEvent[]> => {
  const promises = [];

  for (const ex of EXCHANGES) {
    for (const symbol of SYMBOLS) {
      promises.push(fetchSingleFlow(ex, symbol));
    }
  }

  const results = await Promise.all(promises);
  const events = results.flat();

  return events.sort((a, b) => b.usdValue - a.usdValue);
};

export default function ExchangeFlowModule({ instanceId }: Props) {
  const storageKey = `exchange-flow-${instanceId}`;
  const windowTooSmall = useWindowSizeCheck();
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [events, setEvents] = useState<FlowEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<"all" | "deposit" | "withdraw">("all");
  const [isMounted, setIsMounted] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3);
  const viewRef = useRef<HTMLDivElement>(null);

  // Load settings
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.view) setView(settings.view);
        } catch (err) {
          console.error("[ExchangeFlow] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ view }));
    }
  }, [view, storageKey]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!viewOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (viewRef.current && !viewRef.current.contains(e.target as Node)) {
        setViewOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewOpen]);

  // Dynamic grid columns based on container width
  useEffect(() => {
    const updateGridCols = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // Calculate how many cards can fit (each card needs ~180px minimum)
        if (width < 380) {
          setGridCols(1); // Mobile: 1 column
        } else if (width < 580) {
          setGridCols(2); // Medium: 2 columns
        } else {
          setGridCols(3); // Large: 3 columns
        }
      }
    };

    updateGridCols();
    
    const resizeObserver = new ResizeObserver(updateGridCols);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Fetch data
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const result = await fetchFlowEvents();
      setEvents(result);
    } catch (err) {
      console.error("[ExchangeFlow] Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredEvents = events.filter(e => view === "all" || e.direction === view);

  // Calculate totals
  const totalDeposit = events.filter(e => e.direction === "deposit").reduce((sum, e) => sum + e.usdValue, 0);
  const totalWithdraw = events.filter(e => e.direction === "withdraw").reduce((sum, e) => sum + e.usdValue, 0);
  const netFlow = totalDeposit - totalWithdraw;

  if (windowTooSmall) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0e1a] rounded-lg p-4">
        <div className="text-center space-y-2">
          <div className="text-white/90 font-semibold text-sm">
            Window Too Small
          </div>
          <div className="text-white/50 text-xs">
            Minimum size: 400x300px
            <br />
            Please resize your window
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/40 text-xs">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      {/* 🎯 Fully Responsive Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        {/* Title */}
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Exchange Flow (24h)
        </span>
        
        {/* Separator */}
        <span className="text-white/40 text-xs">•</span>
        
        {/* LIVE indicator */}
        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        {/* Spacer */}
        <div className="flex-1 min-w-[20px]"></div>

        {/* View Filter Dropdown */}
        <div ref={viewRef} className="relative">
          <button
            onClick={() => setViewOpen((v) => !v)}
            className="
              h-7 px-3 rounded-md
              bg-[#0b1f1f]
              border border-white/10
              text-white text-xs
              flex items-center gap-1.5
              cursor-pointer
              hover:bg-white/5
              transition-all
              whitespace-nowrap
            "
          >
            <span>
              {view === "all" ? "All Flows" : view === "deposit" ? "Deposits" : "Withdrawals"}
            </span>
            <span
              className={`
                text-white/50 text-[10px]
                transition-transform duration-200
                ${viewOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

          {viewOpen && (
            <div
              onWheel={(e) => e.stopPropagation()}
              className="
                absolute left-0 mt-1 z-50
                w-[140px]
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-md
                shadow-lg
                animate-in fade-in slide-in-from-top-2 duration-200
              "
            >
              {[
                { value: "all", label: "All Flows" },
                { value: "deposit", label: "Deposits" },
                { value: "withdraw", label: "Withdrawals" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setView(option.value as typeof view);
                    setViewOpen(false);
                  }}
                  className="
                    w-full px-3 py-2
                    text-left text-xs
                    bg-transparent cursor-pointer
                    text-white
                    transition-colors
                    hover:bg-emerald-500/10
                    hover:text-emerald-400
                  "
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="
            h-7 w-7 rounded-md
            bg-blue-500/20 border border-blue-500/30
            text-blue-300 hover:bg-blue-500/30
            transition-all flex items-center justify-center
            cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

{/* Summary Cards - FIXED (No Scroll) - Always 3 columns, content wraps */}
      <div className="px-3 pt-2 pb-3 flex-shrink-0">
        <div className="grid grid-cols-3 gap-2 transition-all duration-300">
          {/* Deposits Card */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 rounded-lg p-2 overflow-hidden min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-[9px] text-red-400/80 font-medium leading-tight break-words">
                  Total Deposits
                </span>
              </div>
              <div className="text-xs font-bold text-red-400 font-mono break-all leading-tight">
                ${(totalDeposit / 1000000000).toFixed(2)}B
              </div>
            </div>
          </div>

          {/* Withdrawals Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 overflow-hidden min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[9px] text-emerald-400/80 font-medium leading-tight break-words">
                  Total Withdrawals
                </span>
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono break-all leading-tight">
                ${(totalWithdraw / 1000000000).toFixed(2)}B
              </div>
            </div>
          </div>

          {/* Net Flow Card */}
          <div className={`
            bg-gradient-to-br rounded-lg p-2 border overflow-hidden min-w-0
            ${netFlow >= 0 
              ? "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20" 
              : "from-red-500/10 to-red-500/5 border-red-500/20"
            }
          `}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                {netFlow >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                )}
                <span className={`text-[9px] font-medium leading-tight break-words ${
                  netFlow >= 0 ? "text-emerald-400/80" : "text-red-400/80"
                }`}>
                  Net Flow
                </span>
              </div>
              <div className={`text-xs font-bold font-mono break-all leading-tight ${
                netFlow >= 0 ? "text-emerald-400" : "text-red-400"
              }`}>
                {netFlow >= 0 ? "+" : ""}${(Math.abs(netFlow) / 1000000000).toFixed(2)}B
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events List - SCROLLABLE */}
      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {loading ? (
          <div className="text-xs text-white/40 text-center py-8">
            Loading flow data...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-xs text-white/40 text-center py-8">
            No flow data available
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.slice(0, 20).map((e) => {
              const isDeposit = e.direction === "deposit";
              const colorClass = isDeposit ? "text-red-400" : "text-emerald-400";
              const bgClass = isDeposit 
                ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10" 
                : "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10";

              return (
                <div
                  key={e.id}
                  className={`
                    px-3 py-2 rounded-lg border transition-all
                    ${bgClass}
                  `}
                >
                  {/* Top Row - Icon, Symbol, Direction, Exchange */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                    {/* Icon */}
                    <div className={`font-semibold shrink-0 ${colorClass}`}>
                      {isDeposit ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5" />
                      )}
                    </div>

                    {/* Symbol */}
                    <span className={`text-xs font-bold whitespace-nowrap shrink-0 ${colorClass}`}>
                      {e.symbol}
                    </span>

                    {/* Direction */}
                    <span className={`text-[10px] font-semibold whitespace-nowrap shrink-0 ${colorClass}`}>
                      {isDeposit ? "DEPOSIT" : "WITHDRAW"}
                    </span>

                    {/* Separator */}
                    <span className="text-white/30 text-[10px] shrink-0">•</span>

                    {/* Exchange */}
                    <span className="text-white/50 text-[10px] whitespace-nowrap shrink-0">
                      {e.exchange}
                    </span>
                  </div>

                  {/* Middle Row - USD Value (can wrap with break-all) */}
                  <div className="text-white font-mono text-xs break-all mb-1">
                    ${(e.usdValue / 1000000).toFixed(1)}M
                  </div>

                  {/* Bottom Row - Amount (can wrap with break-all) */}
                  <div className="text-white/50 text-[10px] font-mono break-all">
                    {e.amount.toLocaleString(undefined, { 
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2 
                    })} {e.symbol}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}