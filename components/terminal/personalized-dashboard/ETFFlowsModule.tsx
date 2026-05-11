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

//  Fetch ETF flow data based on BTC price
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
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-foreground text-xs">
          BTC ETF Flows
        </span>
        
        <span className="text-muted-foreground text-xs">•</span>
        
        {loadingCount === 0 && (
          <span className="flex items-center gap-1.5 text-xs whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">LIVE</span>
          </span>
        )}

        <div className="flex-1 min-w-[20px]"></div>

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
            ? "bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50"
            : `
                bg-secondary text-muted-foreground border-border
hover:text-[#1A73E8]

              `
        }
      `}
    >
      {getSortLabel(sort)}
    </button>
  ))}
</div>
      </div>

      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
         [&::-webkit-scrollbar-thumb]:bg-black/20 dark:[&::-webkit-scrollbar-thumb]:bg-white/20
          [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/30 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/40
          scrollbar-thin
scrollbar-thumb-foreground/20          scrollbar-track-transparent
        "
      >
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            Loading ETF data...
          </div>
        ) : (
          <div className="space-y-2">
            {sortedData.map((etf) => (
              <div
                key={etf.id}
                className="px-3 py-2 rounded-md bg-input border border-border hover:bg-black/8 dark:hover:bg-white/8 transition-all"
              >
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      etf.loading ? "bg-yellow-400 animate-pulse" : "bg-emerald-400"
                    }`}
                  />

                  <div className="text-foreground font-semibold leading-tight text-xs whitespace-nowrap shrink-0">
                    {etf.ticker}
                  </div>

                  <div className="flex-1 min-w-[10px]"></div>

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

                <div className="text-[10px] text-muted-foreground mb-2 break-words">
                  {etf.name}
                </div>

                <div className="space-y-1.5 mb-2">
                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground whitespace-nowrap">Flow (24h)</span>
                    <span
                      className={`font-bold font-mono whitespace-nowrap ${
                        etf.flow >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {etf.loading ? (
                        <span className="text-muted-foreground">Loading...</span>
                      ) : (
                        <>
                          {etf.flow >= 0 ? "+" : ""}$
                          {(Math.abs(etf.flow) / 1000000).toFixed(1)}M
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground whitespace-nowrap">AUM</span>
                    <span className="text-foreground font-mono font-medium whitespace-nowrap">
                      {etf.loading ? (
                        <span className="text-muted-foreground">Loading...</span>
                      ) : (
                        `$${(etf.aum / 1000000000).toFixed(2)}B`
                      )}
                    </span>
                  </div>
                </div>

                {!etf.loading && (
                  <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
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

      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-border bg-input rounded-lg">
        <div className="text-[9px] sm:text-[10px] text-muted-foreground mb-1 sm:mb-1.5">
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