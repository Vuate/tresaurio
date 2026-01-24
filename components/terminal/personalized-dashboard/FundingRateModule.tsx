// components/terminal/personalized-dashboard/FundingRateModule.tsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";
import type { Exchange } from "@/services/WebSocketService";

interface FundingData {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  markPrice: number;
  indexPrice: number;
  source: "api" | "mock";
  exchange: string;
}

interface Props {
  instanceId: string;
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

// 🔥 Multi-exchange funding rate fetcher
const fetchFundingRate = async (symbol: string, exchange: Exchange): Promise<FundingData> => {
  const upperSymbol = symbol.toUpperCase();

  switch (exchange) {
    case "binance": {
      const response = await fetch(
        `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${upperSymbol}`
      );
      const data = await response.json();
      return {
        symbol: data.symbol,
        fundingRate: parseFloat(data.lastFundingRate),
        fundingTime: data.nextFundingTime,
        markPrice: parseFloat(data.markPrice),
        indexPrice: parseFloat(data.indexPrice),
        source: "api",
        exchange: "Binance",
      };
    }

    case "okx": {
      // OKX uses BTC-USDT-SWAP format
      const okxSymbol = upperSymbol.replace(/USDT$/, "-USDT-SWAP");
      const [fundingRes, tickerRes] = await Promise.all([
        fetch(`https://www.okx.com/api/v5/public/funding-rate?instId=${okxSymbol}`),
        fetch(`https://www.okx.com/api/v5/market/ticker?instId=${okxSymbol}`)
      ]);
      const fundingData = await fundingRes.json();
      const tickerData = await tickerRes.json();

      const funding = fundingData.data?.[0];
      const ticker = tickerData.data?.[0];

      return {
        symbol: upperSymbol,
        fundingRate: parseFloat(funding?.fundingRate || "0"),
        fundingTime: parseInt(funding?.nextFundingTime || Date.now() + 8 * 60 * 60 * 1000),
        markPrice: parseFloat(ticker?.last || "0"),
        indexPrice: parseFloat(ticker?.last || "0"),
        source: "api",
        exchange: "OKX",
      };
    }

    case "bybit": {
      const [fundingRes, tickerRes] = await Promise.all([
        fetch(`https://api.bybit.com/v5/market/tickers?category=linear&symbol=${upperSymbol}`),
        fetch(`https://api.bybit.com/v5/market/funding/history?category=linear&symbol=${upperSymbol}&limit=1`)
      ]);
      const tickerData = await fundingRes.json();
      const fundingData = await tickerRes.json();

      const ticker = tickerData.result?.list?.[0];
      const funding = fundingData.result?.list?.[0];

      // Calculate next funding time (Bybit has 8h intervals)
      const now = Date.now();
      const nextFunding = Math.ceil(now / (8 * 60 * 60 * 1000)) * (8 * 60 * 60 * 1000);

      return {
        symbol: upperSymbol,
        fundingRate: parseFloat(ticker?.fundingRate || funding?.fundingRate || "0"),
        fundingTime: nextFunding,
        markPrice: parseFloat(ticker?.markPrice || "0"),
        indexPrice: parseFloat(ticker?.indexPrice || "0"),
        source: "api",
        exchange: "Bybit",
      };
    }

    default:
      throw new Error(`Unsupported exchange: ${exchange}`);
  }
};

export default function FundingRateModule({ instanceId }: Props) {
  const storageKey = `funding-rate-${instanceId}`;
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [data, setData] = useState<FundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.symbol) setSelectedSymbol(settings.symbol);
          if (settings.exchange) setExchange(settings.exchange);
        } catch (err) {
          console.error("[FundingRate] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ symbol: selectedSymbol, exchange }));
    }
  }, [selectedSymbol, exchange, storageKey]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFundingRate(selectedSymbol, exchange);

        if (!mounted) return;

        setData(result);
        setError(null);
      } catch (err) {
        console.error(`[FundingRate] Error (${exchange}):`, err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to fetch");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedSymbol, exchange]);

  const timeUntilFunding = data
    ? Math.max(0, data.fundingTime - Date.now())
    : 0;
  const hours = Math.floor(timeUntilFunding / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeUntilFunding % (1000 * 60 * 60)) / (1000 * 60)
  );

  const fundingRatePercent = data ? data.fundingRate * 100 : 0;
  const annualizedRate = fundingRatePercent * 3 * 365;

  return (
    <div className="space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-white/60 text-xs flex items-center gap-2">
          <span className="font-semibold text-white/90">Funding Rate</span>
          {data && (
            <span className="text-[9px] text-emerald-400">
              LIVE
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {/* Exchange Selector */}
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Symbol Selector */}
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            {SYMBOLS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && !data ? (
        <div className="text-center py-8 text-white/40 text-[10px]">
          Loading funding rate...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-400/40 rounded p-3">
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span className="font-semibold">Connection Error</span>
          </div>
          <div className="text-red-300/80 text-[10px] mt-1">{error}</div>
        </div>
      ) : data ? (
        <>
          {/* Current Funding Rate */}
          <div className="bg-white/5 border border-white/10 rounded p-3">
            <div className="text-white/40 text-[10px] mb-1">
              Current Funding Rate
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  fundingRatePercent >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {fundingRatePercent >= 0 ? "+" : ""}
                {fundingRatePercent.toFixed(4)}%
              </span>
              {fundingRatePercent !== 0 && (
                <span className="text-white/40 text-[10px]">
                  ({annualizedRate >= 0 ? "+" : ""}
                  {annualizedRate.toFixed(2)}% APR)
                </span>
              )}
            </div>
          </div>

          {/* Time Until Next Funding */}
          <div className="bg-white/5 border border-white/10 rounded p-3">
            <div className="flex items-center gap-2 text-white/40 text-[10px] mb-2">
              <Clock className="w-3 h-3" />
              <span>Next Funding In</span>
            </div>
            <div className="text-white text-xl font-bold">
              {hours}h {minutes}m
            </div>
          </div>

          {/* Mark vs Index Price */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">Mark Price</div>
              <div className="text-white font-semibold">
                $
                {data.markPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-2">
              <div className="text-white/40 text-[10px] mb-1">Index Price</div>
              <div className="text-white font-semibold">
                $
                {data.indexPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* Funding Interpretation */}
          <div className="bg-white/5 border border-white/10 rounded p-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-white/50">Market Sentiment</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  fundingRatePercent > 0.01
                    ? "text-emerald-400"
                    : fundingRatePercent < -0.01
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {fundingRatePercent > 0.01 ? (
                  <>
                    <TrendingUp className="w-3 h-3" />
                    Bullish (Longs Pay)
                  </>
                ) : fundingRatePercent < -0.01 ? (
                  <>
                    <TrendingDown className="w-3 h-3" />
                    Bearish (Shorts Pay)
                  </>
                ) : (
                  "Neutral"
                )}
              </span>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
