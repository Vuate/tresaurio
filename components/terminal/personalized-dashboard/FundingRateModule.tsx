// components/terminal/personalized-dashboard/FundingRateModule.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
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

const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

const POPULAR_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "MATICUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LINKUSDT",
  "UNIUSDT",
  "ATOMUSDT",
  "LTCUSDT",
  "NEARUSDT",
];

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

// 🔥 WebSocket URLs
const getWebSocketUrl = (exchange: Exchange, symbol: string): string => {
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

// 🔥 Parse WS messages
const parseMessage = (
  exchange: Exchange,
  data: any,
  symbol: string,
): Partial<FundingData> | null => {
  try {
    switch (exchange) {
      case "binance":
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

      case "okx":
        if (data.arg?.channel === "funding-rate" && data.data?.[0]) {
          const d = data.data[0];
          return {
            fundingRate: parseFloat(d.fundingRate || "0"),
            fundingTime: parseInt(d.nextFundingTime),
            source: "websocket",
            exchange: "OKX",
          };
        }
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

      case "bybit":
        if (data.topic?.includes("tickers") && data.data) {
          const d = data.data;
          return {
            symbol: d.symbol,
            fundingRate: parseFloat(d.fundingRate || "0"),
            fundingTime: Date.now() + 8 * 60 * 60 * 1000,
            markPrice: parseFloat(d.markPrice || "0"),
            indexPrice: parseFloat(d.indexPrice || "0"),
            source: "websocket",
            exchange: "Bybit",
          };
        }
        break;
    }
  } catch (err) {
    console.error("[FundingRate] Parse error:", err);
  }
  return null;
};

export default function FundingRateModule({ instanceId }: Props) {
  const storageKey = `funding-rate-${instanceId}`;
  const symbolsStorageKey = `funding-rate-symbols-${instanceId}`;

  const [symbols, setSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(symbolsStorageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_SYMBOLS;
  });

  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [data, setData] = useState<FundingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    localStorage.setItem(symbolsStorageKey, JSON.stringify(symbols));
  }, [symbols, symbolsStorageKey]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const s = JSON.parse(saved);
      if (s.symbol) setSelectedSymbol(s.symbol);
      if (s.exchange) setExchange(s.exchange);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ symbol: selectedSymbol, exchange }),
    );
  }, [selectedSymbol, exchange, storageKey]);

  // 🔥 WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const url = getWebSocketUrl(exchange, selectedSymbol);
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
      // ❗ loading burada KAPANMIYOR
    };

    ws.onmessage = (e) => {
      try {
        const raw = JSON.parse(e.data);
        const parsed = parseMessage(exchange, raw, selectedSymbol);

        if (parsed) {
          setLoading(false); // ✅ ilk veri gelince kapanır

          setData((prev) => ({
            symbol: selectedSymbol,
            fundingRate: parsed.fundingRate ?? prev?.fundingRate ?? 0,
            fundingTime:
              parsed.fundingTime ??
              prev?.fundingTime ??
              Date.now() + 8 * 60 * 60 * 1000,
            markPrice: parsed.markPrice ?? prev?.markPrice ?? 0,
            indexPrice: parsed.indexPrice ?? prev?.indexPrice ?? 0,
            source: "websocket",
            exchange: parsed.exchange ?? exchange,
          }));
        }
      } catch (err) {
        console.error("[FundingRate] Message parse error:", err);
      }
    };

    ws.onerror = () => {
      // ❗ fatal değil
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      setTimeout(connectWebSocket, 5000);
    };
  }, [exchange, selectedSymbol]);

  useEffect(() => {
    setLoading(true);
    setData(null);
    connectWebSocket();
    return () => wsRef.current?.close();
  }, [connectWebSocket]);

  const timeUntilFunding = data
    ? Math.max(0, data.fundingTime - Date.now())
    : 0;
  const hours = Math.floor(timeUntilFunding / 3_600_000);
  const minutes = Math.floor((timeUntilFunding % 3_600_000) / 60_000);
  const fundingRatePercent = data ? data.fundingRate * 100 : 0;
  const annualizedRate = fundingRatePercent * 3 * 365;

  return (
    <div className="space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/70">
          <span className="font-semibold">Funding Rate</span>
          {connected && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              LIVE
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="h-8 rounded bg-white/5 border border-white/10 px-2"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="h-8 rounded bg-white/5 border border-white/10 px-2"
          >
            {symbols.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="h-8 px-2 rounded bg-blue-500/20 border border-blue-500/30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-6 text-white/40">
          Connecting to {exchange}...
        </div>
      )}

      {!loading && !error && !data && (
        <div className="text-center py-6 text-white/40">
          Waiting for data from {exchange}...
        </div>
      )}

      {data && (
        <>
          {/* Current Funding Rate */}
          <div className="bg-white/5 border border-white/10 rounded p-3">
            <div className="text-white/40 mb-1">Current Funding Rate</div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  fundingRatePercent >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {fundingRatePercent >= 0 ? "+" : ""}
                {fundingRatePercent.toFixed(4)}%
              </span>
              <span className="text-white/40 text-[10px]">
                ({annualizedRate.toFixed(2)}% APR)
              </span>
            </div>
          </div>

          {/* Next Funding */}
          <div className="bg-white/5 border border-white/10 rounded p-3">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Clock className="w-3 h-3" />
              Next Funding In
            </div>
            <div className="text-xl font-bold">
              {hours}h {minutes}m
            </div>
          </div>

          {/* Sentiment */}
          <div className="bg-white/5 border border-white/10 rounded p-2 flex justify-between">
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
                  <TrendingUp className="w-3 h-3" /> Bullish
                </>
              ) : fundingRatePercent < -0.01 ? (
                <>
                  <TrendingDown className="w-3 h-3" /> Bearish
                </>
              ) : (
                "Neutral"
              )}
            </span>
          </div>
        </>
      )}

      {/* 🔥 Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-lg bg-[#0b0f1a] border border-white/10 p-4">
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold">Add Funding Symbol</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="BTCUSDT"
              className="w-full mb-3 px-3 py-2 rounded bg-black/40 border border-white/10"
            />

            <div className="grid grid-cols-3 gap-2 mb-3">
              {POPULAR_SYMBOLS.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewSymbol(s)}
                  className="text-xs bg-white/5 hover:bg-white/10 rounded px-2 py-1"
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const symbol = newSymbol.trim().toUpperCase();
                if (!symbol || symbols.includes(symbol)) return;
                setSymbols((p) => [...p, symbol]);
                setSelectedSymbol(symbol);
                setNewSymbol("");
                setShowAddModal(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-black py-2 rounded font-semibold"
            >
              Add Symbol
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
