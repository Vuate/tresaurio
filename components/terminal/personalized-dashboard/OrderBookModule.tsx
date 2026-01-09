// components/terminal/personalized-dashboard/OrderBookModule.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useOrderBookStore } from "@/store/orderBookStore";
import { wsService } from "@/services/WebSocketService";

type SideRow = { price: number; qty: number; total: number };

function buildSide(raw: [string, string][], isAsks: boolean): SideRow[] {
  const rows = raw
    .map(([p, q]) => ({ price: Number(p), qty: Number(q) }))
    .filter(
      (r) => Number.isFinite(r.price) && Number.isFinite(r.qty) && r.qty > 0
    )
    .sort((a, b) => (isAsks ? a.price - b.price : b.price - a.price));

  let running = 0;
  return rows.map((r) => {
    running += r.qty;
    return { ...r, total: running };
  });
}

function mockDepth(symbol: string) {
  const mid = 100000 + Math.random() * 5000;
  const mk = (isAsks: boolean) =>
    Array.from({ length: 20 }).map((_, i) => {
      const step = (i + 1) * (5 + Math.random() * 12);
      const price = isAsks ? mid + step : mid - step;
      const qty = 0.05 + Math.random() * 0.8;
      return [price.toFixed(2), qty.toFixed(6)] as [string, string];
    });

  const bids = buildSide(mk(false), false);
  const asks = buildSide(mk(true), true);

  return { symbol, bids, asks, mid, source: "mock" as const };
}

export default function OrderBookModule() {
  // 👇 STORE'DAN AL
  const { symbol, bids, asks, mid, source, setOrderBook, setSymbol } =
    useOrderBookStore();

  useEffect(() => {
    let mounted = true;

    // 🔥 WebSocket stream (depth20@100ms = 100ms updates!)
    const stream = `${symbol.toLowerCase()}@depth20@100ms`;

    const unsubscribe = wsService.subscribe(stream, (data) => {
      if (!mounted) return;

      try {
        if (data.bids && data.asks) {
          const bids = buildSide(data.bids, false);
          const asks = buildSide(data.asks, true);

          const bestBid = bids[0]?.price;
          const bestAsk = asks[0]?.price;

          const mid =
            Number.isFinite(bestBid) && Number.isFinite(bestAsk)
              ? (bestBid + bestAsk) / 2
              : null;

          // 👇 STORE'A YAZ
          setOrderBook({ symbol, bids, asks, mid, source: "api" });
        }
      } catch (error) {
        console.error("[OrderBook] Parse error:", error);
        // Fallback to mock
        const mockData = mockDepth(symbol);
        setOrderBook(mockData);
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [symbol, setOrderBook]);

  const bestBid = bids[0]?.price ?? null;
  const bestAsk = asks[0]?.price ?? null;

  const spread = useMemo(() => {
    if (
      !Number.isFinite(bestBid as number) ||
      !Number.isFinite(bestAsk as number)
    )
      return null;
    const value = (bestAsk as number) - (bestBid as number);
    const mid = ((bestAsk as number) + (bestBid as number)) / 2;
    const pct = mid ? (value / mid) * 100 : 0;
    return { value, pct };
  }, [bestAsk, bestBid]);

  const maxAskTotal = useMemo(() => asks.at(-1)?.total || 1, [asks]);
  const maxBidTotal = useMemo(() => bids.at(-1)?.total || 1, [bids]);

  const balance = useMemo(() => {
    const bidTotal = bids.at(-1)?.total || 0;
    const askTotal = asks.at(-1)?.total || 0;
    const sum = bidTotal + askTotal || 1;

    return {
      bidPct: (bidTotal / sum) * 100,
      askPct: (askTotal / sum) * 100,
    };
  }, [bids, asks]);

  const fmt = useMemo(
    () => ({
      price: (v: number) =>
        v.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      qty: (v: number) => v.toFixed(6),
      total: (v: number) =>
        v >= 1000 ? `${(v / 1000).toFixed(2)}k` : v.toFixed(6),
    }),
    []
  );

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">Order Book</span>{" "}
          <span className="text-white/40">•</span>{" "}
          <span className="text-white/70">{symbol}</span>{" "}
          <span className="text-white/40">•</span>{" "}
          <span
            className={`${
              source === "api" ? "text-emerald-400" : "text-white/50"
            }`}
          >
            {source === "api" ? "LIVE" : "MOCK"}
          </span>
        </div>

        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="h-8 rounded-lg bg-white/5 border border-white/10
            text-xs text-white/80 px-2 outline-none"
        >
          <option value="BTCUSDT">BTCUSDT</option>
          <option value="ETHUSDT">ETHUSDT</option>
          <option value="SOLUSDT">SOLUSDT</option>
          <option value="BNBUSDT">BNBUSDT</option>
        </select>
      </div>

      {/* Column titles */}
      <div className="grid grid-cols-3 text-[11px] text-white/40 font-semibold">
        <div>Price</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks */}
      <div className="space-y-1">
        {asks
          .slice(0, 12)
          .reverse()
          .map((r, idx) => {
            const pct = Math.min((r.total / maxAskTotal) * 100, 100);
            return (
              <div
                key={`a-${idx}`}
                className="relative overflow-hidden rounded-md"
              >
                <div
                  className="absolute inset-0 bg-red-500/10"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative grid grid-cols-3 text-[11px] px-2 py-1">
                  <div className="text-red-300">{fmt.price(r.price)}</div>
                  <div className="text-right text-white/70">
                    {fmt.qty(r.qty)}
                  </div>
                  <div className="text-right text-white/60">
                    {fmt.total(r.total)}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Mid + Spread */}
      <div className="py-2 border-y border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-white/40">Mid</div>
          <div className="text-sm font-semibold text-teal-300">
            {mid ? fmt.price(mid) : "—"}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <div className="text-white/40">Spread</div>
          <div className="text-white/70">
            {spread
              ? `${spread.value.toFixed(2)} (${spread.pct.toFixed(3)}%)`
              : "—"}
          </div>
        </div>

        {/* Buy/Sell balance */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-white/40">
            <span>Buy</span>
            <span>Sell</span>
          </div>

          <div className="h-2 w-full rounded bg-white/10 overflow-hidden flex">
            <div
              className="bg-emerald-500"
              style={{ width: `${balance.bidPct}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${balance.askPct}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-white/60">
            <span>{balance.bidPct.toFixed(1)}%</span>
            <span>{balance.askPct.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Bids */}
      <div className="space-y-1">
        {bids.slice(0, 12).map((r, idx) => {
          const pct = Math.min((r.total / maxBidTotal) * 100, 100);
          return (
            <div
              key={`b-${idx}`}
              className="relative overflow-hidden rounded-md"
            >
              <div
                className="absolute inset-0 bg-emerald-500/10"
                style={{ width: `${pct}%` }}
              />
              <div className="relative grid grid-cols-3 text-[11px] px-2 py-1">
                <div className="text-emerald-300">{fmt.price(r.price)}</div>
                <div className="text-right text-white/70">{fmt.qty(r.qty)}</div>
                <div className="text-right text-white/60">
                  {fmt.total(r.total)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
