// components/terminal/personalized-dashboard/ExchangeNetflowModule.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  instanceId: string;
}

interface NetflowData {
  exchange: string;
  inflow: number;
  outflow: number;
  net: number;
  change24h: number;
  connected: boolean;
}

const SYMBOLS = ["BTC", "ETH"];

// 🔥 WebSocket URLs for trade streams
const getTradeStreamUrl = (exchange: string, symbol: string): string => {
  const lowerSymbol = symbol.toLowerCase();
  const pair = `${lowerSymbol}usdt`;

  switch (exchange) {
    case "Binance":
      return `wss://stream.binance.com:9443/ws/${pair}@aggTrade`;
    case "OKX":
      return `wss://ws.okx.com:8443/ws/v5/public`;
    case "Bybit":
      return `wss://stream.bybit.com/v5/public/spot`;
    default:
      return "";
  }
};

export default function ExchangeNetflowModule({ instanceId }: Props) {
  const storageKey = `exchange-netflow-${instanceId}`;
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [symbol, setSymbol] = useState<string>("BTC");
  const [data, setData] = useState<NetflowData[]>([
    { exchange: "Binance", inflow: 0, outflow: 0, net: 0, change24h: 0, connected: false },
    { exchange: "OKX", inflow: 0, outflow: 0, net: 0, change24h: 0, connected: false },
    { exchange: "Bybit", inflow: 0, outflow: 0, net: 0, change24h: 0, connected: false },
  ]);
  const wsRefs = useRef<Map<string, WebSocket>>(new Map());
  const flowAccumulators = useRef<Map<string, { inflow: number; outflow: number }>>(new Map());

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.symbol) setSymbol(settings.symbol);
          if (settings.timeframe) setTimeframe(settings.timeframe);
        } catch (err) {
          console.error("[ExchangeNetflow] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ symbol, timeframe }));
    }
  }, [symbol, timeframe, storageKey]);

  // 🔥 Connect to all exchange WebSockets
  const connectToExchange = useCallback((exchange: string) => {
    const url = getTradeStreamUrl(exchange, symbol);
    if (!url) return;

    // Initialize accumulator
    if (!flowAccumulators.current.has(exchange)) {
      flowAccumulators.current.set(exchange, { inflow: 0, outflow: 0 });
    }

    try {
      const ws = new WebSocket(url);
      wsRefs.current.set(exchange, ws);

      ws.onopen = () => {
        console.log(`[ExchangeNetflow] Connected to ${exchange}`);

        setData(prev => prev.map(d =>
          d.exchange === exchange ? { ...d, connected: true } : d
        ));

        // Subscribe for OKX and Bybit
        if (exchange === "OKX") {
          const okxPair = `${symbol}-USDT`;
          ws.send(JSON.stringify({
            op: "subscribe",
            args: [{ channel: "trades", instId: okxPair }],
          }));
        } else if (exchange === "Bybit") {
          ws.send(JSON.stringify({
            op: "subscribe",
            args: [`publicTrade.${symbol}USDT`],
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          let tradeValue = 0;
          let isBuy = false;

          // Parse trade data based on exchange
          if (exchange === "Binance") {
            // Binance aggTrade: { p: price, q: qty, m: isBuyerMaker }
            if (rawData.e === "aggTrade") {
              const price = parseFloat(rawData.p);
              const qty = parseFloat(rawData.q);
              tradeValue = price * qty;
              isBuy = !rawData.m; // m=true means buyer is maker (sell), m=false means buyer is taker (buy)
            }
          } else if (exchange === "OKX") {
            // OKX trades: { data: [{ px, sz, side }] }
            if (rawData.data?.[0]) {
              const trade = rawData.data[0];
              const price = parseFloat(trade.px || 0);
              const qty = parseFloat(trade.sz || 0);
              tradeValue = price * qty;
              isBuy = trade.side === "buy";
            }
          } else if (exchange === "Bybit") {
            // Bybit publicTrade: { data: [{ p, v, S }] }
            if (rawData.data?.[0]) {
              const trade = rawData.data[0];
              const price = parseFloat(trade.p || 0);
              const qty = parseFloat(trade.v || 0);
              tradeValue = price * qty;
              isBuy = trade.S === "Buy";
            }
          }

          // Update accumulator
          if (tradeValue > 0) {
            const acc = flowAccumulators.current.get(exchange);
            if (acc) {
              if (isBuy) {
                acc.inflow += tradeValue;
              } else {
                acc.outflow += tradeValue;
              }
            }
          }
        } catch (err) {
          // Ignore parse errors for non-trade messages
        }
      };

      ws.onerror = () => {
        setData(prev => prev.map(d =>
          d.exchange === exchange ? { ...d, connected: false } : d
        ));
      };

      ws.onclose = () => {
        setData(prev => prev.map(d =>
          d.exchange === exchange ? { ...d, connected: false } : d
        ));

        // Reconnect after 5 seconds
        setTimeout(() => {
          if (wsRefs.current.get(exchange) === ws) {
            connectToExchange(exchange);
          }
        }, 5000);
      };
    } catch (err) {
      console.error(`[ExchangeNetflow] Failed to connect to ${exchange}:`, err);
    }
  }, [symbol]);

  // Connect to all exchanges
  useEffect(() => {
    // Reset accumulators
    flowAccumulators.current.clear();

    // Close existing connections
    wsRefs.current.forEach(ws => ws.close());
    wsRefs.current.clear();

    // Connect to each exchange
    ["Binance", "OKX", "Bybit"].forEach(exchange => {
      connectToExchange(exchange);
    });

    return () => {
      wsRefs.current.forEach(ws => ws.close());
      wsRefs.current.clear();
    };
  }, [symbol, connectToExchange]);

  // Update UI periodically from accumulators
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setData(prev => prev.map(d => {
        const acc = flowAccumulators.current.get(d.exchange);
        if (acc) {
          const net = acc.inflow - acc.outflow;
          const total = acc.inflow + acc.outflow;
          const change24h = total > 0 ? ((net / total) * 100) : 0;

          return {
            ...d,
            inflow: acc.inflow,
            outflow: acc.outflow,
            net,
            change24h,
          };
        }
        return d;
      }));
    }, 1000); // Update UI every second

    return () => clearInterval(updateInterval);
  }, []);

  const totalNet = data.reduce((sum, d) => sum + d.net, 0);
  const connectedCount = data.filter(d => d.connected).length;

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">💸</div>
          <h3 className="font-semibold">Exchange Netflow</h3>
          {connectedCount > 0 && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE ({connectedCount}/3)
            </span>
          )}
        </div>

        {/* Symbol Selector */}
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="h-7 rounded bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Timeframe */}
      <div className="flex gap-2 p-3 border-b border-white/10">
        {(["24h", "7d", "30d"] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              timeframe === tf
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {tf.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-white/10">
          {data.map((d) => (
            <div
              key={d.exchange}
              className="p-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{d.exchange}</span>
                  {d.connected ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                  )}
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded ${
                    d.change24h >= 0
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {d.change24h >= 0 ? "+" : ""}
                  {d.change24h.toFixed(1)}%
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-400">↓ Inflow</span>
                  <span className="text-white font-medium">
                    ${d.inflow > 1000000
                      ? (d.inflow / 1000000).toFixed(2) + "M"
                      : (d.inflow / 1000).toFixed(1) + "K"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-400">↑ Outflow</span>
                  <span className="text-white font-medium">
                    ${d.outflow > 1000000
                      ? (d.outflow / 1000000).toFixed(2) + "M"
                      : (d.outflow / 1000).toFixed(1) + "K"}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 font-medium">Net Flow</span>
                  <span
                    className={`font-bold ${
                      d.net >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {d.net >= 0 ? "+" : "-"}$
                    {Math.abs(d.net) > 1000000
                      ? (Math.abs(d.net) / 1000000).toFixed(2) + "M"
                      : (Math.abs(d.net) / 1000).toFixed(1) + "K"}
                  </span>
                </div>
              </div>

              {/* Flow Bar */}
              {(d.inflow + d.outflow) > 0 && (
                <div className="mt-3 flex gap-1 h-2">
                  <div
                    className="bg-emerald-500 rounded"
                    style={{
                      width: `${(d.inflow / (d.inflow + d.outflow)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500 rounded"
                    style={{
                      width: `${(d.outflow / (d.inflow + d.outflow)) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total Summary */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-white/60 mb-1">Total Net Flow (Real-time)</div>
        <div className={`text-lg font-bold ${totalNet >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {totalNet >= 0 ? "+" : "-"}$
          {Math.abs(totalNet) > 1000000
            ? (Math.abs(totalNet) / 1000000).toFixed(2) + "M"
            : (Math.abs(totalNet) / 1000).toFixed(1) + "K"}
        </div>
      </div>
    </div>
  );
}
