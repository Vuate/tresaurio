// components/terminal/personalized-dashboard/WhaleAlertsModule.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import type { WhaleTransfer } from "@/lib/personalized-dashboard/types";
import type { Exchange } from "@/services/WebSocketService";

interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

const TRACKED_SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt"];
const MIN_TRADE_VALUE = 100000; // $100k minimum for whale alert
const MAX_ALERTS = 20;

// 🔥 Multi-exchange WebSocket URLs for trade streams
const getTradeStreamUrl = (exchange: Exchange, symbols: string[]): string => {
  switch (exchange) {
    case "binance":
      const streams = symbols.map(s => `${s}@aggTrade`).join("/");
      return `wss://stream.binance.com:9443/stream?streams=${streams}`;
    case "okx":
      return `wss://ws.okx.com:8443/ws/v5/public`;
    case "bybit":
      return `wss://stream.bybit.com/v5/public/spot`;
    default:
      return "";
  }
};

export default function WhaleAlertsModule({ instanceId }: Props) {
  const storageKey = `whale-alerts-${instanceId}`;
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [minValue, setMinValue] = useState(MIN_TRADE_VALUE);
  const [data, setData] = useState<WhaleTransfer[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const idCounter = useRef(0);

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.exchange) setExchange(settings.exchange);
          if (settings.minValue) setMinValue(settings.minValue);
        } catch (err) {
          console.error("[WhaleAlerts] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ exchange, minValue }));
    }
  }, [exchange, minValue, storageKey]);

  // 🔥 WebSocket connection for real-time whale alerts
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const url = getTradeStreamUrl(exchange, TRACKED_SYMBOLS);
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`[WhaleAlerts] Connected to ${exchange}`);
      setConnected(true);

      // OKX and Bybit need subscription messages
      if (exchange === "okx") {
        const subMsg = {
          op: "subscribe",
          args: TRACKED_SYMBOLS.map(s => ({
            channel: "trades",
            instId: s.toUpperCase().replace(/USDT$/, "-USDT")
          }))
        };
        ws.send(JSON.stringify(subMsg));
      } else if (exchange === "bybit") {
        const subMsg = {
          op: "subscribe",
          args: TRACKED_SYMBOLS.map(s => `publicTrade.${s.toUpperCase()}`)
        };
        ws.send(JSON.stringify(subMsg));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        let trade: { symbol: string; price: number; qty: number; isBuy: boolean; time: number } | null = null;

        // Parse exchange-specific message format
        if (exchange === "binance" && msg.data) {
          const d = msg.data;
          trade = {
            symbol: d.s,
            price: parseFloat(d.p),
            qty: parseFloat(d.q),
            isBuy: !d.m, // m = true means seller is maker
            time: d.T
          };
        } else if (exchange === "okx" && msg.data?.[0]) {
          const d = msg.data[0];
          trade = {
            symbol: d.instId.replace("-", ""),
            price: parseFloat(d.px),
            qty: parseFloat(d.sz),
            isBuy: d.side === "buy",
            time: parseInt(d.ts)
          };
        } else if (exchange === "bybit" && msg.data?.[0]) {
          const d = msg.data[0];
          trade = {
            symbol: d.s,
            price: parseFloat(d.p),
            qty: parseFloat(d.v),
            isBuy: d.S === "Buy",
            time: d.T
          };
        }

        if (trade) {
          const usdValue = trade.price * trade.qty;

          // Only show trades above minimum value (whale trades)
          if (usdValue >= minValue) {
            const baseSymbol = trade.symbol.replace(/USDT$/i, "").toUpperCase();
            const newAlert: WhaleTransfer = {
              id: `whale-${Date.now()}-${idCounter.current++}`,
              symbol: baseSymbol,
              amount: trade.qty,
              usdValue: usdValue,
              direction: trade.isBuy ? "in" : "out",
              exchange: EXCHANGES.find(e => e.id === exchange)?.name || exchange,
              timestamp: trade.time,
            };

            setData(prev => [newAlert, ...prev].slice(0, MAX_ALERTS));
          }
        }
      } catch (err) {
        // Ignore parse errors for ping/pong messages
      }
    };

    ws.onerror = (err) => {
      console.error(`[WhaleAlerts] WebSocket error:`, err);
      setConnected(false);
    };

    ws.onclose = () => {
      console.log(`[WhaleAlerts] WebSocket closed`);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [exchange, minValue]);

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="space-y-3">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">Whale Alerts</span>
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${connected ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        <div className="flex gap-2">
          {/* Exchange Selector */}
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Exchange)}
            className="h-7 rounded bg-white/5 border border-white/10 text-[11px] text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Min Value Selector */}
          <select
            value={minValue}
            onChange={(e) => setMinValue(Number(e.target.value))}
            className="h-7 rounded bg-white/5 border border-white/10 text-[11px] text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            <option value={50000}>$50K+</option>
            <option value={100000}>$100K+</option>
            <option value={500000}>$500K+</option>
            <option value={1000000}>$1M+</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs">
            {connected ? "Waiting for whale trades..." : "Connecting..."}
          </div>
        ) : (
          data.map((t) => {
            const isIn = t.direction === "in";

            return (
              <div
                key={t.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-sm font-semibold ${
                        isIn ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {t.symbol} {isIn ? "BUY" : "SELL"}
                    </div>
                    <span className="text-[10px] text-white/30">{formatTime(t.timestamp)}</span>
                  </div>

                  <div className="text-[11px] text-white/40">{t.exchange}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-mono text-white">
                    {t.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {t.symbol}
                  </div>
                  <div className="text-[11px] text-white/50">
                    ${t.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
