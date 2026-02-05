import { useState, useEffect, useMemo, useRef } from "react";
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
  const { data: klines, loading: klinesLoading } = useKlines({
    symbol,
    interval,
    exchange,
    limit: 50,
    refreshInterval: 60000,
  });

  const { data: ticker, loading: tickerLoading } = useTicker({
    symbol,
    marketType: "spot",
    exchange,
  });

  const loading = klinesLoading || tickerLoading;

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
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Close exchange dropdown on outside click
  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeRef.current &&
        !exchangeRef.current.contains(e.target as Node)
      ) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  // Track all symbols
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
    <div ref={containerRef} className="h-full flex flex-col space-y-2 sm:space-y-3 text-xs overflow-visible">
      <div className="relative z-50 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="text-[10px] sm:text-xs text-white/60">
          <span className="font-semibold text-white/90">
            <span className="hidden xs:inline">RSI Heatmap</span>
            <span className="xs:hidden">RSI</span>
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>

        <div className="flex gap-1.5 sm:gap-2">
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

            {exchangeOpen && (
              <div
                onWheel={(e) => e.stopPropagation()}
                className="
                  absolute right-0 mt-1 z-[999]
                  w-[120px] sm:w-[140px]
                  max-h-[200px] sm:max-h-[88px]
                  overflow-y-auto
                  bg-[#0b1f1f]
                  border border-emerald-500/20
                  rounded-lg
                  shadow-xl
                  origin-top-right
                  animate-in fade-in slide-in-from-top-2 duration-200

                  [&::-webkit-scrollbar]:w-1.5
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
                      w-full px-2.5 sm:px-3 py-1.5 sm:py-2
                      text-left text-[10px] sm:text-xs
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
      </div>

      <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
        {(["1h", "4h", "1d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`
              flex-1 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold
              border transition-all duration-150
              cursor-pointer
              ${
                timeframe === tf
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
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      <div
        className="
          flex-1 min-h-0
          overflow-y-auto overflow-x-hidden
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
        <div className="space-y-1.5 sm:space-y-2">
          {allData.map((data) => (
            <div
              key={data.symbol}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="font-semibold text-white text-[10px] sm:text-xs truncate">
                  {data.symbol.replace("USDT", "")}
                </div>
                <div
                  className={`text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ml-2 ${
                    data.change24h >= 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {data.change24h >= 0 ? "+" : ""}
                  {data.change24h.toFixed(1)}%
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
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
                <div className="text-xs sm:text-sm font-bold text-white w-8 sm:w-10 text-right flex-shrink-0">
                  {data.loading ? "..." : data.rsi?.toFixed(0) || "N/A"}
                </div>
              </div>

              <div className="flex justify-between items-center text-[9px] sm:text-[10px]">
                <span className="text-white/60 truncate">{getRSILabel(data.rsi)}</span>
                <span className="text-white/60 flex-shrink-0 ml-2">
                  $
                  {data.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: data.price < 1 ? 6 : 2,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 p-2 sm:p-3 border-t border-white/10 bg-white/5 rounded-lg">
        <div className="text-[9px] sm:text-[10px] text-white/60 mb-1.5 sm:mb-2">
          RSI Scale
        </div>
        <div className="flex gap-0.5 sm:gap-1 mb-1">
          <div className="flex-1 h-1.5 sm:h-2 bg-green-500 rounded" />
          <div className="flex-1 h-1.5 sm:h-2 bg-emerald-500 rounded" />
          <div className="flex-1 h-1.5 sm:h-2 bg-yellow-500 rounded" />
          <div className="flex-1 h-1.5 sm:h-2 bg-orange-500 rounded" />
          <div className="flex-1 h-1.5 sm:h-2 bg-red-500 rounded" />
        </div>
        <div className="flex justify-between text-[9px] sm:text-[10px] text-white/40">
          <span>0</span>
          <span>30</span>
          <span>70</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}