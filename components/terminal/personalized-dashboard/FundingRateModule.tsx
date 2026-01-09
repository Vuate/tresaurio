// components/terminal/personalized-dashboard/FundingRateModule.tsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";

interface FundingData {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  markPrice: number;
  indexPrice: number;
  source: "api" | "mock";
}

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

export default function FundingRateModule() {
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [data, setData] = useState<FundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFunding = async () => {
      try {
        const response = await fetch(
          `/api/markets/binance/funding?symbol=${selectedSymbol}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();

        if (!mounted) return;

        if (json.ok) {
          setData({
            symbol: json.symbol,
            fundingRate: json.fundingRate,
            fundingTime: json.fundingTime,
            markPrice: json.markPrice,
            indexPrice: json.indexPrice,
            source: json.source || "api",
          });
          setError(null);
        } else {
          throw new Error(json.error || "Invalid response");
        }
      } catch (err) {
        console.error("[FundingRate] Error:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to fetch");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchFunding();
    const interval = setInterval(fetchFunding, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [selectedSymbol]);

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
            <span
              className={`text-[9px] ${
                data.source === "api" ? "text-emerald-400" : "text-yellow-400"
              }`}
            >
              {data.source === "api" ? "LIVE" : "MOCK"}
            </span>
          )}
        </div>

        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
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
