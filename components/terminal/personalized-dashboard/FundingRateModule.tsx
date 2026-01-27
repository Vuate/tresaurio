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
const getWebSocketUrl = (exchange: Exchange): string => {
  switch (exchange) {
    case "binance":
      return `wss://fstream.binance.com/ws`;
    case "okx":
      return `wss://ws.okx.com:8443/ws/v5/public`;
    case "bybit":
      return `wss://stream.bybit.com/v5/public/linear`;
    default:
      return "";
  }
};

// 🔥 Format symbol for each exchange
const formatSymbol = (symbol: string, exchange: Exchange): string => {
  const upper = symbol.toUpperCase();
  switch (exchange) {
    case "binance":
    case "bybit":
      return upper; // BTCUSDT
    case "okx":
      // BTCUSDT -> BTC-USDT-SWAP
      return upper.replace(/^([A-Z]+)(USDT|USDC|USD)$/, "$1-$2") + "-SWAP";
    default:
      return upper;
  }
};

// 🔥 Build subscribe message for each exchange
const buildSubscribeMessage = (exchange: Exchange, symbol: string): any => {
  const formattedSymbol = formatSymbol(symbol, exchange);
  const lowerSymbol = symbol.toLowerCase();

  switch (exchange) {
    case "binance":
      return {
        method: "SUBSCRIBE",
        params: [`${lowerSymbol}@markPrice`],
        id: Date.now(),
      };
    case "okx":
      return {
        op: "subscribe",
        args: [
          { channel: "funding-rate", instId: formattedSymbol },
          { channel: "mark-price", instId: formattedSymbol },
        ],
      };
    case "bybit":
      return {
        op: "subscribe",
        args: [`tickers.${formattedSymbol}`],
      };
    default:
      return null;
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
            fundingTime: parseInt(d.nextFundingTime) || Date.now() + 8 * 60 * 60 * 1000,
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

    const url = getWebSocketUrl(exchange);
    if (!url) return;

    console.log(`🔌 [FundingRate] Connecting to ${exchange.toUpperCase()}...`);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);

      // 🔥 Send subscribe message for all exchanges
      const subscribeMsg = buildSubscribeMessage(exchange, selectedSymbol);
      if (subscribeMsg) {
        ws.send(JSON.stringify(subscribeMsg));
        console.log(`📤 [FundingRate] Sent subscribe:`, subscribeMsg);
      }
    };

    ws.onmessage = (e) => {
      try {
        const raw = JSON.parse(e.data);

        // 🔥 Handle ping/pong for exchanges
        if (exchange === "bybit" && raw.op === "ping") {
          ws.send(JSON.stringify({ op: "pong" }));
          return;
        }
        if (exchange === "okx" && raw.event === "ping") {
          ws.send(JSON.stringify({ event: "pong" }));
          return;
        }

        // Skip subscription confirmations
        if (raw.event === "subscribe" || raw.op === "subscribe" || raw.success === true) {
          console.log(`✅ [FundingRate] Subscription confirmed for ${exchange}`);
          return;
        }

        const parsed = parseMessage(exchange, raw, selectedSymbol);

        if (parsed) {
          setLoading(false);

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
    <div className="relative space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-white/70">
          <span className="font-semibold text-white">Funding Rate</span>
          {connected ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              LIVE
            </span>
          ) : loading ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 animate-pulse">
              CONNECTING
            </span>
          ) : null}
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="h-7 rounded-md bg-[#0b1f1f] border border-white/10 px-2 text-white text-xs outline-none cursor-pointer hover:border-white/20 transition-colors"
            style={{ colorScheme: "dark" }}
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id} className="bg-[#0b1f1f] text-white">
                {ex.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="h-7 rounded-md bg-[#0b1f1f] border border-white/10 px-2 text-white text-xs outline-none cursor-pointer hover:border-white/20 transition-colors"
            style={{ colorScheme: "dark" }}
          >
            {symbols.map((s) => (
              <option key={s} value={s} className="bg-[#0b1f1f] text-white">
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="h-7 px-2 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-white/40">
          <div className="w-5 h-5 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin mb-2" />
          <span className="text-[11px]">Connecting to {exchange.toUpperCase()}...</span>
        </div>
      )}

      {!loading && !data && (
        <div className="flex flex-col items-center justify-center py-8 text-white/40">
          <AlertCircle className="w-5 h-5 mb-2 text-yellow-400/60" />
          <span className="text-[11px]">No data from {exchange.toUpperCase()}</span>
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
        <div
          className="absolute inset-0 z-50 flex flex-col bg-[#0a0e1a] rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-semibold text-white">Add Symbol</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <input
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const symbol = newSymbol.trim().toUpperCase();
                  if (!symbol || symbols.includes(symbol)) return;
                  setSymbols((p) => [...p, symbol]);
                  setSelectedSymbol(symbol);
                  setNewSymbol("");
                  setShowAddModal(false);
                }
              }}
              placeholder="Enter symbol (e.g. BTCUSDT)"
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-blue-500/50"
            />

            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_SYMBOLS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSymbols((p) => p.includes(s) ? p : [...p, s]);
                    setSelectedSymbol(s);
                    setShowAddModal(false);
                  }}
                  className={`text-[10px] rounded px-2 py-1.5 transition-colors ${
                    symbols.includes(s)
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 hover:bg-white/10 text-white/70"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-white/10">
            <button
              onClick={() => {
                const symbol = newSymbol.trim().toUpperCase();
                if (!symbol || symbols.includes(symbol)) return;
                setSymbols((p) => [...p, symbol]);
                setSelectedSymbol(symbol);
                setNewSymbol("");
                setShowAddModal(false);
              }}
              disabled={!newSymbol.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 text-white py-2 rounded-md font-semibold text-xs transition-colors"
            >
              Add Custom Symbol
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
