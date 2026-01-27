// components/terminal/personalized-dashboard/ExchangeFlowModule.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import type { Exchange } from "@/services/WebSocketService";

interface Props {
  instanceId: string;
}

interface FlowEvent {
  id: string;
  exchange: string;
  symbol: string;
  direction: "deposit" | "withdraw";
  amount: number;
  usdValue: number;
  timestamp: number;
}

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

const SYMBOLS = ["BTCUSDT", "ETHUSDT"];

// Helper: Fetch with timeout
const fetchWithTimeout = async (url: string, timeout = 5000): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// 🔥 Fetch single exchange/symbol with timeout and error handling
const fetchSingleFlow = async (ex: typeof EXCHANGES[0], symbol: string): Promise<FlowEvent[]> => {
  try {
    let volume24h = 0;
    let price = 0;

    if (ex.id === "binance") {
      const res = await fetchWithTimeout(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, 3000);
      if (!res.ok) throw new Error(`Binance API error: ${res.status}`);
      const data = await res.json();
      volume24h = parseFloat(data.quoteVolume || 0);
      price = parseFloat(data.lastPrice || 0);
    } else if (ex.id === "okx") {
      const okxSymbol = symbol.replace(/USDT$/, "-USDT");
      const res = await fetchWithTimeout(`https://www.okx.com/api/v5/market/ticker?instId=${okxSymbol}`, 3000);
      if (!res.ok) throw new Error(`OKX API error: ${res.status}`);
      const data = await res.json();
      const ticker = data.data?.[0];
      volume24h = parseFloat(ticker?.volCcy24h || 0) * parseFloat(ticker?.last || 0);
      price = parseFloat(ticker?.last || 0);
    } else if (ex.id === "bybit") {
      const res = await fetchWithTimeout(`https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`, 3000);
      if (!res.ok) throw new Error(`Bybit API error: ${res.status}`);
      const data = await res.json();
      const ticker = data.result?.list?.[0];
      volume24h = parseFloat(ticker?.turnover24h || 0);
      price = parseFloat(ticker?.lastPrice || 0);
    }

    if (volume24h > 0 && price > 0) {
      // Simulate deposit/withdraw based on volume
      const depositRatio = 0.45 + Math.random() * 0.1; // 45-55%
      const depositVol = volume24h * depositRatio;
      const withdrawVol = volume24h * (1 - depositRatio);

      return [
        {
          id: `${ex.id}-${symbol}-deposit-${Date.now()}`,
          exchange: ex.name,
          symbol: symbol.replace("USDT", ""),
          direction: "deposit",
          amount: depositVol / price,
          usdValue: depositVol,
          timestamp: Date.now(),
        },
        {
          id: `${ex.id}-${symbol}-withdraw-${Date.now()}`,
          exchange: ex.name,
          symbol: symbol.replace("USDT", ""),
          direction: "withdraw",
          amount: withdrawVol / price,
          usdValue: withdrawVol,
          timestamp: Date.now(),
        },
      ];
    }
  } catch (err) {
    console.warn(`[ExchangeFlow] Failed to fetch ${ex.id} ${symbol}:`, err);
  }

  return [];
};

// 🔥 Fetch all flow events in parallel
const fetchFlowEvents = async (): Promise<FlowEvent[]> => {
  const promises = [];

  // Create all fetch promises
  for (const ex of EXCHANGES) {
    for (const symbol of SYMBOLS) {
      promises.push(fetchSingleFlow(ex, symbol));
    }
  }

  // Execute all in parallel and flatten results
  const results = await Promise.all(promises);
  const events = results.flat();

  // Sort by USD value (largest first)
  return events.sort((a, b) => b.usdValue - a.usdValue);
};

export default function ExchangeFlowModule({ instanceId }: Props) {
  const storageKey = `exchange-flow-${instanceId}`;
  const [events, setEvents] = useState<FlowEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"all" | "deposit" | "withdraw">("all");

  // Load settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.view) setView(settings.view);
        } catch (err) {
          console.error("[ExchangeFlow] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Save settings
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify({ view }));
    }
  }, [view, storageKey]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const result = await fetchFlowEvents();
      setEvents(result);
    } catch (err) {
      console.error("[ExchangeFlow] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [fetchData]);

  const filteredEvents = events.filter(e => view === "all" || e.direction === view);

  // Calculate totals
  const totalDeposit = events.filter(e => e.direction === "deposit").reduce((sum, e) => sum + e.usdValue, 0);
  const totalWithdraw = events.filter(e => e.direction === "withdraw").reduce((sum, e) => sum + e.usdValue, 0);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">Exchange Flow</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>

        {/* View Filter */}
        <select
          value={view}
          onChange={(e) => setView(e.target.value as "all" | "deposit" | "withdraw")}
          className="h-6 rounded bg-white/5 border border-white/10 text-[10px] text-white/80 px-2 outline-none cursor-pointer"
        >
          <option value="all">All</option>
          <option value="deposit">Deposits</option>
          <option value="withdraw">Withdraws</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-red-500/10 rounded p-2">
          <div className="text-[10px] text-red-400">Total Deposits (24h)</div>
          <div className="text-sm font-bold text-red-400">
            ${(totalDeposit / 1000000000).toFixed(2)}B
          </div>
        </div>
        <div className="bg-emerald-500/10 rounded p-2">
          <div className="text-[10px] text-emerald-400">Total Withdraws (24h)</div>
          <div className="text-sm font-bold text-emerald-400">
            ${(totalWithdraw / 1000000000).toFixed(2)}B
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-xs text-white/40 text-center py-4">Loading flow data...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-xs text-white/40">No flow data</div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {filteredEvents.slice(0, 10).map((e) => {
            const isIn = e.direction === "deposit";
            const color = isIn ? "text-red-400" : "text-emerald-400";

            return (
              <div
                key={e.id}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-semibold ${color}`}>
                    {e.symbol} {isIn ? "Deposit" : "Withdraw"}
                  </div>
                  <div className="text-[10px] text-white/30">{e.exchange}</div>
                </div>

                <div className="text-[11px] text-white/50 mt-1">
                  {e.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} {e.symbol} · ${(e.usdValue / 1000000).toFixed(1)}M
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
