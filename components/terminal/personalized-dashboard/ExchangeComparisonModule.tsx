// components/terminal/personalized-dashboard/ExchangeComparisonModule.tsx
"use client";

import { useEffect, useState } from "react";

interface ExchangePrice {
  exchange: string;
  price: number;
  diff: number; // difference from average
}

interface Props {
  instanceId: string;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

// 🔥 Fetch prices from all exchanges
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
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [data, setData] = useState<ExchangePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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
    const interval = setInterval(fetchPrices, 5000); // Update every 5s

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
    <div className="space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60">Price Comparison</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>

        {/* Symbol Selector */}
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="h-7 rounded bg-white/5 border border-white/10 text-[11px] text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s.replace("USDT", "")}
            </option>
          ))}
        </select>
      </div>

      {err && <div className="text-[10px] text-yellow-400/80">{err}</div>}

      {loading && data.length === 0 ? (
        <div className="text-white/40 text-center py-4">Loading prices...</div>
      ) : (
        <>
          {/* Exchange Prices */}
          <div className="space-y-2">
            {data.map((item, idx) => (
              <div key={item.exchange} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${idx === 0 ? "bg-emerald-400" : idx === data.length - 1 ? "bg-red-400" : "bg-white/30"}`} />
                  <span className="text-white/60">{item.exchange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white font-mono">
                    ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-[10px] ${item.diff >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {item.diff >= 0 ? "+" : ""}{item.diff.toFixed(3)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Spread Summary */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-white/40">Max Spread</span>
              <span className={`font-bold ${spread > 0.1 ? "text-yellow-400" : "text-emerald-400"}`}>
                {spread.toFixed(4)}%
              </span>
            </div>
            {spread > 0.05 && (
              <div className="mt-1 text-[10px] text-yellow-400/80">
                Arbitrage opportunity detected
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
