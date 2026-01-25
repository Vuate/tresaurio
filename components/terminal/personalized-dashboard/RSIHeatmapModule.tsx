// components/terminal/personalized-dashboard/RSIHeatmapModule.tsx

import { useState, useEffect, useMemo } from "react";
import { useKlines, useTicker } from "@/hooks";
import { calculateRSI } from "@/lib/utils/technicalIndicators";
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

interface RSIData {
  symbol: string;
  rsi: number | null;
  price: number;
  change24h: number;
  loading: boolean;
}

const TRACKED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "LINKUSDT",
];

// Component to track RSI for a single symbol
function SymbolRSITracker({
  symbol,
  interval,
  exchange,
}: {
  symbol: string;
  interval: "1h" | "4h" | "1d";
  exchange: Exchange;
}) {
  // Get klines data with multi-exchange support
  const { data: klines, loading: klinesLoading } = useKlines({
    symbol,
    interval,
    exchange, // 🔥 Multi-exchange support
    limit: 50, // Need at least 14 + 1 for RSI calculation
    refreshInterval: 60000, // Refresh every minute
  });

  // Get ticker data for price and 24h change with multi-exchange support
  const { data: ticker, loading: tickerLoading } = useTicker({
    symbol,
    marketType: "spot",
    exchange, // 🔥 Multi-exchange support
  });

  const loading = klinesLoading || tickerLoading;

  // Calculate RSI
  const rsi = useMemo(() => {
    if (!klines || klines.length < 15) {
      return null;
    }

    const closes = klines.map((k) => k.close);
    return calculateRSI(closes, 14);
  }, [klines]);

  return {
    symbol,
    rsi,
    price: ticker?.lastPrice || 0,
    change24h: ticker?.priceChangePercent || 0,
    loading,
  };
}

export default function RSIHeatmapModule({ instanceId }: Props) {
  const storageKey = `rsi-heatmap-${instanceId}`;
  const [timeframe, setTimeframe] = useState<"1h" | "4h" | "1d">("4h");
  const [exchange, setExchange] = useState<Exchange>("binance");

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.timeframe) setTimeframe(settings.timeframe);
          if (settings.exchange) setExchange(settings.exchange);
        } catch (err) {
          console.error("[RSIHeatmap] Failed to load settings:", err);
        }
      }
    }
  }, [instanceId, storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ timeframe, exchange }));
    }
  }, [timeframe, exchange, storageKey]);

  // Track all symbols with multi-exchange support
  const btcData = SymbolRSITracker({ symbol: "BTCUSDT", interval: timeframe, exchange });
  const ethData = SymbolRSITracker({ symbol: "ETHUSDT", interval: timeframe, exchange });
  const bnbData = SymbolRSITracker({ symbol: "BNBUSDT", interval: timeframe, exchange });
  const solData = SymbolRSITracker({ symbol: "SOLUSDT", interval: timeframe, exchange });
  const xrpData = SymbolRSITracker({ symbol: "XRPUSDT", interval: timeframe, exchange });
  const adaData = SymbolRSITracker({ symbol: "ADAUSDT", interval: timeframe, exchange });
  const dogeData = SymbolRSITracker({ symbol: "DOGEUSDT", interval: timeframe, exchange });
  const maticData = SymbolRSITracker({ symbol: "MATICUSDT", interval: timeframe, exchange });
  const linkData = SymbolRSITracker({ symbol: "LINKUSDT", interval: timeframe, exchange });

  const allData = useMemo(() => {
    return [btcData, ethData, bnbData, solData, xrpData, adaData, dogeData, maticData, linkData];
  }, [btcData, ethData, bnbData, solData, xrpData, adaData, dogeData, maticData, linkData]);

  const getRSIColor = (rsi: number | null) => {
    if (rsi === null) return "bg-white/10";
    if (rsi >= 70) return "bg-red-500";
    if (rsi >= 60) return "bg-orange-500";
    if (rsi >= 40) return "bg-yellow-500";
    if (rsi >= 30) return "bg-emerald-500";
    return "bg-green-500";
  };

  const getRSILabel = (rsi: number | null) => {
    if (rsi === null) return "Loading...";
    if (rsi >= 70) return "Overbought";
    if (rsi >= 30) return "Neutral";
    return "Oversold";
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🌡️</div>
          <h3 className="font-semibold">RSI Heatmap</h3>
        </div>

        {/* Exchange Selector */}
        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value as Exchange)}
          className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-white/80 border border-white/10 outline-none cursor-pointer hover:bg-white/10"
        >
          {EXCHANGES.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        {(["1h", "4h", "1d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              timeframe === tf
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-2">
          {allData.map((data) => (
            <div
              key={data.symbol}
              className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-white">
                  {data.symbol.replace("USDT", "")}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded ${
                    data.change24h >= 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {data.change24h >= 0 ? "+" : ""}
                  {data.change24h.toFixed(1)}%
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    {data.loading ? (
                      <div className="h-full bg-white/20 animate-pulse" />
                    ) : (
                      <div
                        className={`h-full ${getRSIColor(data.rsi)} transition-all`}
                        style={{ width: `${data.rsi || 0}%` }}
                      />
                    )}
                  </div>
                </div>
                <div className="text-sm font-bold text-white w-12 text-right">
                  {data.loading ? "..." : data.rsi?.toFixed(0) || "N/A"}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-white/60">{getRSILabel(data.rsi)}</span>
                <span className="text-white/60">
                  ${data.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-white/60 mb-2">RSI Scale</div>
        <div className="flex gap-1">
          <div className="flex-1 h-2 bg-green-500 rounded" />
          <div className="flex-1 h-2 bg-emerald-500 rounded" />
          <div className="flex-1 h-2 bg-yellow-500 rounded" />
          <div className="flex-1 h-2 bg-orange-500 rounded" />
          <div className="flex-1 h-2 bg-red-500 rounded" />
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>0</span>
          <span>30</span>
          <span>70</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
