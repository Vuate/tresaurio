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

//  Multi-exchange WebSocket URLs for trade streams
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
  const contentRef = useRef<HTMLDivElement>(null);
  const [exchange, setExchange] = useState<Exchange>("binance");
  const [minValue, setMinValue] = useState(MIN_TRADE_VALUE);
  const [data, setData] = useState<WhaleTransfer[]>([]);
  const [connected, setConnected] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [minValueOpen, setMinValueOpen] = useState(false);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const minValueRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exchangeRef.current && !exchangeRef.current.contains(e.target as Node)) {
        setExchangeOpen(false);
      }
      if (minValueRef.current && !minValueRef.current.contains(e.target as Node)) {
        setMinValueOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // WebSocket connection for real-time whale alerts
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

  const minValueOptions = [
    { value: 50000, label: "$50K+" },
    { value: 100000, label: "$100K+" },
    { value: 500000, label: "$500K+" },
    { value: 1000000, label: "$1M+" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Whale Alerts
        </span>
        
        <span className="text-white/40 text-xs">•</span>
        
        <span className={`text-xs whitespace-nowrap ${connected ? "text-emerald-400" : "text-red-400"}`}>
          {connected ? "LIVE" : "OFFLINE"}
        </span>

        <div className="flex-1 min-w-[20px]"></div>

        <div className="flex flex-wrap items-center gap-2">
          <div ref={exchangeRef} className="relative">
            <button
              onClick={() => setExchangeOpen((v) => !v)}
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
              <span>{EXCHANGES.find(e => e.id === exchange)?.name}</span>
              <span
                className={`
                  text-white/50 text-[10px]
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
                  absolute left-0 mt-1 z-50
                  w-[120px]
                  bg-[#0b1f1f]
                  border border-emerald-500/20
                  rounded-md
                  shadow-lg
                  animate-in fade-in slide-in-from-top-2 duration-200
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
                      w-full px-3 py-2
                      text-left text-xs
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

          <div ref={minValueRef} className="relative">
            <button
              onClick={() => setMinValueOpen((v) => !v)}
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
              <span>{minValueOptions.find(o => o.value === minValue)?.label}</span>
              <span
                className={`
                  text-white/50 text-[10px]
                  transition-transform duration-200
                  ${minValueOpen ? "rotate-180" : ""}
                `}
              >
                ▾
              </span>
            </button>

            {minValueOpen && (
              <div
                onWheel={(e) => e.stopPropagation()}
                className="
                  absolute right-0 mt-1 z-50
                  w-[100px]
                  bg-[#0b1f1f]
                  border border-emerald-500/20
                  rounded-md
                  shadow-lg
                  animate-in fade-in slide-in-from-top-2 duration-200
                "
              >
                {minValueOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setMinValue(option.value);
                      setMinValueOpen(false);
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
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
        {data.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-xs">
            {connected ? "Waiting for whale trades..." : "Connecting..."}
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((t) => {
              const isIn = t.direction === "in";

              return (
                <div
                  key={t.id}
                  className={`
                    px-3 py-2 rounded-lg border transition-all
                    animate-in fade-in slide-in-from-top-2 duration-300
                    ${isIn 
                      ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" 
                      : "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                    }
                  `}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                    <span className={`text-xs font-bold whitespace-nowrap ${isIn ? "text-emerald-400" : "text-red-400"}`}>
                      {t.symbol}
                    </span>
                    <span className={`text-[10px] font-semibold whitespace-nowrap ${isIn ? "text-emerald-400" : "text-red-400"}`}>
                      {isIn ? "BUY" : "SELL"}
                    </span>
                    <span className="text-white/30 text-[10px]">•</span>
                    <span className="text-[10px] text-white/40 whitespace-nowrap">{formatTime(t.timestamp)}</span>
                    <span className="text-white/30 text-[10px]">•</span>
                    <span className="text-[10px] text-white/50 whitespace-nowrap">{t.exchange}</span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <div className="text-xs font-mono text-white break-all">
                      {t.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {t.symbol}
                    </div>
                    <div className="text-[10px] text-white/50 break-all">
                      ${t.usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}