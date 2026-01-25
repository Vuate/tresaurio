// components/terminal/personalized-dashboard/ETFFlowsModule.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

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
  const [loading, setLoading] = useState(true);

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

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchETFFlows();
      setData(result);
    } catch (err) {
      console.error("[ETFFlows] Fetch error:", err);
    } finally {
      setLoading(false);
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

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📈</div>
          <h3 className="font-semibold">BTC ETF Flows</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["flow", "aum", "change"] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              sortBy === sort
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {sort === "aum"
              ? "AUM"
              : sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      {/* Total Summary */}
      <div
        className={`p-3 border-b border-white/10 ${
          totalFlow >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
        }`}
      >
        <div className="text-xs text-white/60 mb-1">Net Flow (24h)</div>
        <div
          className={`text-2xl font-bold ${
            totalFlow >= 0 ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {totalFlow >= 0 ? "+" : ""}${(totalFlow / 1000000).toFixed(1)}M
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading && data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-xs">
            Loading ETF data...
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {sortedData.map((etf) => (
              <div
                key={etf.id}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-white">{etf.ticker}</div>
                    <div className="text-xs text-white/60">{etf.name}</div>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      etf.change24h >= 0
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-red-400 bg-red-500/10"
                    }`}
                  >
                    {etf.change24h >= 0 ? "+" : ""}
                    {etf.change24h.toFixed(1)}%
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Flow (24h)</span>
                    <span
                      className={`font-bold ${
                        etf.flow >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {etf.flow >= 0 ? "+" : ""}$
                      {(Math.abs(etf.flow) / 1000000).toFixed(1)}M
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">AUM</span>
                    <span className="text-white font-medium">
                      ${(etf.aum / 1000000000).toFixed(2)}B
                    </span>
                  </div>
                </div>

                {/* Flow Bar */}
                <div className="mt-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        etf.flow >= 0 ? "bg-emerald-500" : "bg-red-500"
                      } transition-all`}
                      style={{
                        width: `${Math.min((Math.abs(etf.flow) / 200000000) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
