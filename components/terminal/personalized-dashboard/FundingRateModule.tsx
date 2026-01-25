// components/terminal/personalized-dashboard/FundingRateModule.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";
import type { Exchange } from "@/services/WebSocketService";

interface FundingData {
  symbol: string;
  fundingRate: number;
  fundingTime: number;
  markPrice: number;
  indexPrice: number;
  source: "websocket" | "api";
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

// 🔥 WebSocket URLs for each exchange
const getWebSocketUrl = (exchange: Exchange, symbol: string): string => {
  const upperSymbol = symbol.toUpperCase();
  const lowerSymbol = symbol.toLowerCase();

  switch (exchange) {
    case "binance":
      return `wss://fstream.binance.com/ws/${lowerSymbol}@markPrice`;
    case "okx":
      return `wss://ws.okx.com:8443/ws/v5/public`;
    case "bybit":
      return `wss://stream.bybit.com/v5/public/linear`;
    default:
      return "";
  }
};

// 🔥 Parse WebSocket messages for each exchange
const parseMessage = (exchange: Exchange, data: any, symbol: string): Partial<FundingData> | null => {
  try {
    switch (exchange) {
      case "binance": {
        // Binance markPrice stream: { e: "markPriceUpdate", s: "BTCUSDT", p: "...", r: "...", T: ... }
        if (data.e === "markPriceUpdate") {
          return {
            symbol: data.s,
            fundingRate: parseFloat(data.r || "0"),
            fundingTime: data.T || Date.now() + 8 * 60 * 60 * 1000,
            markPrice: parseFloat(data.p || "0"),
            indexPrice: parseFloat(data.i || data.p || "0"),
            source: "websocket",
            exchange: "Binance",
          };
        }
        break;
      }

      case "okx": {
        // OKX funding-rate channel
        if (data.arg?.channel === "funding-rate" && data.data?.[0]) {
          const d = data.data[0];
          return {
            fundingRate: parseFloat(d.fundingRate || "0"),
            fundingTime: parseInt(d.nextFundingTime || Date.now() + 8 * 60 * 60 * 1000),
            source: "websocket",
            exchange: "OKX",
          };
        }
        // OKX mark-price channel
        if (data.arg?.channel === "mark-price" && data.data?.[0]) {
          const d = data.data[0];
          return {
            markPrice: parseFloat(d.markPx || "0"),
            indexPrice: parseFloat(d.markPx || "0"),
            source: "websocket",
            exchange: "OKX",
          };
        }
        break;
      }

      case "bybit": {
        // Bybit tickers stream
        if (data.topic?.includes("tickers") && data.data) {
          const d = data.data;
          return {
            symbol: d.symbol,
            fundingRate: parseFloat(d.fundingRate || "0"),
            fundingTime: Date.now() + 8 * 60 * 60 * 1000, // Bybit has 8h intervals
            markPrice: parseFloat(d.markPrice || "0"),
            indexPrice: parseFloat(d.indexPrice || "0"),
            source: "websocket",
            exchange: "Bybit",
          };
        }
        break;
      }
    }
  } catch (err) {
    console.error("[FundingRate] Parse error:", err);
  }
  return null;
};

export default function FundingRateModule({ instanceId }: Props) {
  const storageKey = `funding-rate-${instanceId}`;
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [data, setData] = useState<FundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

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

  // 🔥 WebSocket connection
  const connectWebSocket = useCallback(() => {
    // Cleanup existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const url = getWebSocketUrl(exchange, selectedSymbol);
    if (!url) return;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`[FundingRate] Connected to ${exchange}`);
        setConnected(true);
        setLoading(false);
        setError(null);

        // Subscribe for OKX and Bybit
        if (exchange === "okx") {
          const okxSymbol = selectedSymbol.replace(/USDT$/, "-USDT-SWAP");
          ws.send(JSON.stringify({
            op: "subscribe",
            args: [
              { channel: "funding-rate", instId: okxSymbol },
              { channel: "mark-price", instId: okxSymbol },
            ],
          }));
        } else if (exchange === "bybit") {
          ws.send(JSON.stringify({
            op: "subscribe",
            args: [`tickers.${selectedSymbol}`],
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          const parsed = parseMessage(exchange, rawData, selectedSymbol);

          if (parsed) {
            setData((prev) => ({
              symbol: selectedSymbol,
              fundingRate: parsed.fundingRate ?? prev?.fundingRate ?? 0,
              fundingTime: parsed.fundingTime ?? prev?.fundingTime ?? Date.now() + 8 * 60 * 60 * 1000,
              markPrice: parsed.markPrice ?? prev?.markPrice ?? 0,
              indexPrice: parsed.indexPrice ?? prev?.indexPrice ?? 0,
              source: "websocket",
              exchange: parsed.exchange ?? prev?.exchange ?? exchange,
            }));
          }
        } catch (err) {
          console.error("[FundingRate] Message parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("[FundingRate] WebSocket error:", err);
        setError("Connection error");
        setConnected(false);
      };

      ws.onclose = () => {
        console.log("[FundingRate] WebSocket closed");
        setConnected(false);
        // Reconnect after 5 seconds
        setTimeout(() => {
          if (wsRef.current === ws) {
            connectWebSocket();
          }
        }, 5000);
      };
    } catch (err) {
      console.error("[FundingRate] Failed to connect:", err);
      setError("Failed to connect");
      setLoading(false);
    }
  }, [exchange, selectedSymbol]);

  useEffect(() => {
    setLoading(true);
    setData(null);
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

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
          {connected && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
          Connecting to {exchange}...
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
