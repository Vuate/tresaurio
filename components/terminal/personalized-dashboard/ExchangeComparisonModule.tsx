"use client";

import { useEffect, useState, useRef } from "react";
import { AlertTriangle } from "lucide-react";


interface ExchangePrice {
  exchange: string;
  price: number;
  diff: number; // difference from average
}

interface Props {
  instanceId: string;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

//  Fetch prices from all exchanges
const fetchAllPrices = async (symbol: string): Promise<ExchangePrice[]> => {
  const results: ExchangePrice[] = [];
  const upperSymbol = symbol.toUpperCase();

  // Fetch from all exchanges in parallel
  const promises = [
    // Binance
    fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${upperSymbol}`)
      .then(r => r.json())
      .then(d => ({ exchange: "Binance", price: parseFloat(d.price) }))
      .catch(() => null),

    // OKX
    fetch(`https://www.okx.com/api/v5/market/ticker?instId=${upperSymbol.replace(/USDT$/, "-USDT")}`)
      .then(r => r.json())
      .then(d => ({ exchange: "OKX", price: parseFloat(d.data?.[0]?.last || "0") }))
      .catch(() => null),

    // Bybit
    fetch(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${upperSymbol}`)
      .then(r => r.json())
      .then(d => ({ exchange: "Bybit", price: parseFloat(d.result?.list?.[0]?.lastPrice || "0") }))
      .catch(() => null),

    // Coinbase (uses USD instead of USDT)
    fetch(`https://api.exchange.coinbase.com/products/${upperSymbol.replace(/USDT$/, "-USD")}/ticker`)
      .then(r => r.json())
      .then(d => ({ exchange: "Coinbase", price: parseFloat(d.price || "0") }))
      .catch(() => null),
  ];

  const responses = await Promise.all(promises);

  // Filter valid responses
  const validPrices = responses.filter(r => r && r.price > 0) as { exchange: string; price: number }[];

  if (validPrices.length === 0) return [];

  // Calculate average price
  const avgPrice = validPrices.reduce((sum, p) => sum + p.price, 0) / validPrices.length;

  // Calculate difference from average for each exchange
  for (const p of validPrices) {
    results.push({
      exchange: p.exchange,
      price: p.price,
      diff: ((p.price - avgPrice) / avgPrice) * 100,
    });
  }

  // Sort by price (highest first)
  return results.sort((a, b) => b.price - a.price);
};

export default function ExchangeComparisonModule({ instanceId }: Props) {
  const storageKey = `exchange-comparison-${instanceId}`;
  const contentRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [data, setData] = useState<ExchangePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [symbolOpen, setSymbolOpen] = useState(false);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.symbol) setSymbol(settings.symbol);
        } catch (err) {
          console.error("[ExchangeComparison] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ symbol }));
    }
  }, [symbol, storageKey]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!symbolOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (symbolRef.current && !symbolRef.current.contains(e.target as Node)) {
        setSymbolOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [symbolOpen]);

  useEffect(() => {
    let alive = true;

    const fetchPrices = async () => {
      try {
        setErr(null);
        const result = await fetchAllPrices(symbol);

        if (alive && result.length > 0) {
          setData(result);
          setLoading(false);
        } else if (alive) {
          setErr("No price data available");
          setLoading(false);
        }
      } catch (e) {
        console.warn("Exchange comparison error:", e);
        if (alive) {
          setErr("Failed to fetch prices");
          setLoading(false);
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 300000); // Update every 5 minutes

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [symbol]);

  // Calculate spread (highest - lowest)
  const spread = data.length >= 2
    ? ((data[0].price - data[data.length - 1].price) / data[data.length - 1].price) * 100
    : 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Price Comparison
        </span>
        
        <span className="text-white/40 text-xs">•</span>
        
        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        <div className="flex-1 min-w-[20px]"></div>

        <div ref={symbolRef} className="relative">
          <button
            onClick={() => setSymbolOpen((v) => !v)}
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
            <span>{symbol.replace("USDT", "")}</span>
            <span
              className={`
                text-white/50 text-[10px]
                transition-transform duration-200
                ${symbolOpen ? "rotate-180" : ""}
              `}
            >
              ▾
            </span>
          </button>

{symbolOpen && (() => {
  const buttonRect = symbolRef.current?.getBoundingClientRect();
  const isRightSide = buttonRect ? buttonRect.right > window.innerWidth / 2 : false;

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        marginTop: '0.25rem',
        zIndex: 50,
        width: '90px',
        ...(isRightSide ? { right: 0 } : { left: 0 })
      }}
      className="
        bg-[#0b1f1f]
        border border-emerald-500/20
        rounded-md
        shadow-lg
        animate-in fade-in slide-in-from-top-2 duration-200
      "
    >
      {SYMBOLS.map((s) => (
        <button
          key={s}
          onClick={() => {
            setSymbol(s);
            setSymbolOpen(false);
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
          {s.replace("USDT", "")}
        </button>
      ))}
    </div>
  );
})()}

          
        </div>
      </div>

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
        {err && (
          <div className="text-[10px] text-yellow-400/80 mb-3 px-2 py-1.5 rounded bg-yellow-400/10 border border-yellow-400/20">
            {err}
          </div>
        )}

        {loading && data.length === 0 ? (
          <div className="text-white/40 text-center py-8 text-xs">Loading prices...</div>
        ) : (
          <div className="space-y-2">
            {data.map((item, idx) => {
              const isBest = idx === 0;
              const isWorst = idx === data.length - 1;

              return (
                <div
                  key={item.exchange}
                  className={`
                    px-3 py-2 rounded-lg border transition-all
                    ${isBest 
                      ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" 
                      : isWorst
                      ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`
                        w-2 h-2 rounded-full shrink-0
                        ${isBest ? "bg-emerald-400" : isWorst ? "bg-red-400" : "bg-white/30"}
                      `}
                    />
                    <span className="text-white/80 text-xs font-medium">
                      {item.exchange}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="font-semibold text-white font-mono text-sm break-all">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-medium ${item.diff >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {item.diff >= 0 ? "+" : ""}{item.diff.toFixed(3)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {data.length >= 2 && (
        <div className="px-3 pb-3 pt-2 border-t border-white/10 flex-shrink-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 px-2">
            <span className="text-white/50 text-xs whitespace-nowrap">Max Spread</span>
            <span className={`font-bold text-sm whitespace-nowrap ${spread > 0.1 ? "text-yellow-400" : "text-emerald-400"}`}>
              {spread.toFixed(4)}%
            </span>
          </div>
          {spread > 0.05 && (
            <div className="px-2 py-1.5 rounded bg-yellow-400/10 border border-yellow-400/20">
              <div className="text-[10px] text-yellow-400 font-medium">
<AlertTriangle className="w-3 h-3 inline mr-1" /> Arbitrage opportunity detected
              </div>
            </div>
          )}
        </div>
      )}




    </div>
  );
}