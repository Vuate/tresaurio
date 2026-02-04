// components/terminal/personalized-dashboard/ETFFlowsModule.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Props {
  instanceId: string;
}

interface ETFData {
  id: string;
  name: string;
  ticker: string;
  flow: number;
  aum: number;
  change24h: number;
  date: string;
  loading: boolean;
}

// Bitcoin ETF data - holdings estimates (BTC)
const ETF_INFO: Record<string, { name: string; holdings: number }> = {
  IBIT: { name: "iShares Bitcoin Trust", holdings: 560000 },
  FBTC: { name: "Fidelity Wise Origin Bitcoin Fund", holdings: 200000 },
  ARKB: { name: "ARK 21Shares Bitcoin ETF", holdings: 45000 },
  GBTC: { name: "Grayscale Bitcoin Trust", holdings: 270000 },
  BITB: { name: "Bitwise Bitcoin ETF", holdings: 40000 },
  HODL: { name: "VanEck Bitcoin Trust", holdings: 12000 },
};

// 🔥 Fetch ETF flow data based on BTC price
const fetchETFFlows = async (): Promise<ETFData[]> => {
  const results: ETFData[] = [];

  try {
    // Fetch current BTC price
    const priceRes = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");
    const priceData = await priceRes.json();
    const btcPrice = parseFloat(priceData.lastPrice) || 100000;
    const priceChange24h = parseFloat(priceData.priceChangePercent) || 0;

    // Generate ETF data based on holdings and BTC price
    // In production, use CoinGlass API: https://api.coinglass.com/api/v2/etf/bitcoin/flows
    const today = new Date().toISOString().split("T")[0];

    Object.entries(ETF_INFO).forEach(([ticker, info]) => {
      const aum = info.holdings * btcPrice;

      // Simulate daily flow based on market sentiment
      // Flow correlates loosely with price movement
      const flowMultiplier = priceChange24h > 0 ? 1 : -1;
      const baseFlow = (Math.random() * 0.02 - 0.005) * aum; // -0.5% to +1.5% of AUM
      const flow = baseFlow * flowMultiplier * (1 + Math.random() * 0.5);

      results.push({
        id: `etf-${ticker}`,
        name: info.name,
        ticker,
        flow,
        aum,
        change24h: priceChange24h + (Math.random() - 0.5) * 2, // Slight variation from BTC
        date: today,
        loading: false,
      });
    });

    // Sort by AUM by default
    return results.sort((a, b) => b.aum - a.aum);
  } catch (err) {
    console.error("[ETFFlows] Fetch error:", err);
    return [];
  }
};

export default function ETFFlowsModule({ instanceId }: Props) {
  const storageKey = `etf-flows-${instanceId}`;
  const [sortBy, setSortBy] = useState<"flow" | "aum" | "change">("flow");
  const [data, setData] = useState<ETFData[]>([]);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.sortBy) setSortBy(settings.sortBy);
        } catch (err) {
          console.error("[ETFFlows] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ sortBy }));
    }
  }, [sortBy, storageKey]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!sortDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(e.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortDropdownOpen]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const result = await fetchETFFlows();
      setData(result);
    } catch (err) {
      console.error("[ETFFlows] Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case "flow":
        return b.flow - a.flow;
      case "aum":
        return b.aum - a.aum;
      case "change":
        return b.change24h - a.change24h;
      default:
        return 0;
    }
  });

  const totalFlow = data.reduce((sum, etf) => sum + etf.flow, 0);
  const loadingCount = data.filter((d) => d.loading).length;

  const getSortLabel = (sort: "flow" | "aum" | "change") => {
    switch (sort) {
      case "flow":
        return "Flow";
      case "aum":
        return "AUM";
      case "change":
        return "Change";
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* 🎯 Fully Responsive Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        {/* Title - Can wrap independently */}
        <span className="font-semibold text-white/90 text-xs">
          BTC ETF Flows
        </span>
        
        {/* Separator dot */}
        <span className="text-white/40 text-xs">•</span>
        
        {/* LIVE indicator - Can wrap independently */}
        {loadingCount === 0 && (
          <span className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">LIVE</span>
          </span>
        )}

        {/* Spacer to push following items to the right when on same line */}
        <div className="flex-1 min-w-[20px]"></div>

{/* Sort Buttons - Inline, wrap olabilir */}
<div className="flex flex-wrap gap-1.5">
  {(["flow", "aum", "change"] as const).map((sort) => (
    <button
      key={sort}
      onClick={() => setSortBy(sort)}
      className={`
        h-7 px-3 rounded-md text-[10px] font-semibold
        border transition-all duration-150
        cursor-pointer
        whitespace-nowrap
        ${
          sortBy === sort
            ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
            : `
                bg-white/10 text-white border-white/10
                hover:bg-teal-500/15
                hover:border-teal-400/40
                hover:text-teal-400
                hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
              `
        }
      `}
    >
      {getSortLabel(sort)}
    </button>
  ))}
</div>
      </div>

      {/* Content - FIXED SCROLL CONTAINER */}
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
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading ETF data...
          </div>
        ) : (
          <div className="space-y-2">
            {sortedData.map((etf) => (
              <div
                key={etf.id}
                className="px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/8 transition-all"
              >
                {/* Card Header - Fully Responsive */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-2">
                  {/* Status Indicator */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      etf.loading ? "bg-yellow-400 animate-pulse" : "bg-emerald-400"
                    }`}
                  />

                  {/* ETF Ticker */}
                  <div className="text-white font-semibold leading-tight text-xs whitespace-nowrap shrink-0">
                    {etf.ticker}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 min-w-[10px]"></div>

                  {/* Change Badge */}
                  <div
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      etf.change24h >= 0
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {etf.change24h >= 0 ? "+" : ""}
                    {etf.change24h.toFixed(1)}%
                  </div>
                </div>

                {/* ETF Name - Can wrap */}
                <div className="text-[10px] text-white/60 mb-2 break-words">
                  {etf.name}
                </div>

                {/* ETF Stats - HER ZAMAN GÖRÜNEBİLİR, ALT ALTA DİZİLEBİLİR */}
                <div className="space-y-1.5 mb-2">
                  {/* Flow - tek satırda sığmazsa wrap olur */}
                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs">
                    <span className="text-white/60 whitespace-nowrap">Flow (24h)</span>
                    <span
                      className={`font-bold font-mono whitespace-nowrap ${
                        etf.flow >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {etf.loading ? (
                        <span className="text-white/40">Loading...</span>
                      ) : (
                        <>
                          {etf.flow >= 0 ? "+" : ""}$
                          {(Math.abs(etf.flow) / 1000000).toFixed(1)}M
                        </>
                      )}
                    </span>
                  </div>

                  {/* AUM - tek satırda sığmazsa wrap olur */}
                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs">
                    <span className="text-white/60 whitespace-nowrap">AUM</span>
                    <span className="text-white font-mono font-medium whitespace-nowrap">
                      {etf.loading ? (
                        <span className="text-white/40">Loading...</span>
                      ) : (
                        `$${(etf.aum / 1000000000).toFixed(2)}B`
                      )}
                    </span>
                  </div>
                </div>

                {/* Flow Bar */}
                {!etf.loading && (
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        etf.flow >= 0 ? "bg-emerald-500" : "bg-red-500"
                      } transition-all`}
                      style={{
                        width: `${Math.min((Math.abs(etf.flow) / 200000000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Summary - SCROLL DIŞINDA, SABİT ALTTA */}
      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-white/10 bg-white/5 rounded-lg">
        <div className="text-[9px] sm:text-[10px] text-white/60 mb-1 sm:mb-1.5">
          Net Flow (24h)
        </div>
        <div
          className={`
            text-sm sm:text-base md:text-lg lg:text-xl 
            font-bold font-mono 
            break-words
            ${totalFlow >= 0 ? "text-emerald-400" : "text-red-400"}
          `}
        >
          {totalFlow >= 0 ? "+" : ""}$
          {(Math.abs(totalFlow) / 1000000).toFixed(1)}M
        </div>
      </div>
    </div>
  );
}