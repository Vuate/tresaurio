"use client";

import { useEffect, useMemo, useState } from "react";

type SideRow = { price: number; qty: number; total: number };
type DepthState = {
  symbol: string;
  bids: SideRow[];
  asks: SideRow[];
  mid: number | null;
  source: "api" | "mock";
};

function buildSide(raw: [string, string][], isAsks: boolean): SideRow[] {
  const rows = raw
    .map(([p, q]) => ({ price: Number(p), qty: Number(q) }))
    .filter((r) => Number.isFinite(r.price) && Number.isFinite(r.qty))
    .sort((a, b) => (isAsks ? a.price - b.price : b.price - a.price));

  let running = 0;
  return rows.map((r) => {
    running += r.qty;
    return { ...r, total: running };
  });
}

function mockDepth(symbol: string): DepthState {
  const mid = 100000 + Math.random() * 5000; // fake mid
  const mk = (isAsks: boolean) =>
    Array.from({ length: 12 }).map((_, i) => {
      const step = (i + 1) * (5 + Math.random() * 10);
      const price = isAsks ? mid + step : mid - step;
      const qty = 0.05 + Math.random() * 0.6;
      return [price.toFixed(2), qty.toFixed(6)] as [string, string];
    });

  const bids = buildSide(mk(false), false);
  const asks = buildSide(mk(true), true);

  return { symbol, bids, asks, mid, source: "mock" };
}

export default function OrderBookModule() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [state, setState] = useState<DepthState>(() => mockDepth("BTCUSDT"));
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const tick = async () => {
      try {
        setErr(null);

        const res = await fetch(
          `/api/markets/binance/depth?symbol=${encodeURIComponent(
            symbol
          )}&limit=20`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("UPSTREAM");

        const json = await res.json();
        if (!json?.ok) throw new Error(json?.error || "BAD_RESPONSE");

        const bids = buildSide(json.bids || [], false);
        const asks = buildSide(json.asks || [], true);

        const bestBid = bids[0]?.price;
        const bestAsk = asks[0]?.price;
        const mid =
          Number.isFinite(bestBid) && Number.isFinite(bestAsk)
            ? (bestBid + bestAsk) / 2
            : null;

        if (!alive) return;
        setState({ symbol, bids, asks, mid, source: "api" });
      } catch (e) {
        // API patlarsa mock’a düş
        if (!alive) return;
        setErr("Live feed unavailable (mock mode)");
        setState(mockDepth(symbol));
      }
    };

    tick();
    const id = setInterval(tick, 1500);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [symbol]);

  const maxTotal = useMemo(() => {
    const b = state.bids.at(-1)?.total || 0;
    const a = state.asks.at(-1)?.total || 0;
    return Math.max(b, a, 1);
  }, [state]);

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">Order Book</span>{" "}
          <span className="text-white/40">•</span>{" "}
          <span className="text-white/70">{state.symbol}</span>{" "}
          <span className="text-white/40">•</span>{" "}
          <span className="text-white/50">
            {state.source === "api" ? "LIVE" : "MOCK"}
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

      {err && <div className="text-[11px] text-yellow-300/80">{err}</div>}

      {/* Column titles */}
      <div className="grid grid-cols-3 text-[11px] text-white/40 font-semibold">
        <div>Price</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks */}
      <div className="space-y-1">
        {state.asks
          .slice(0, 10)
          .reverse()
          .map((r, idx) => {
            const pct = Math.min((r.total / maxTotal) * 100, 100);
            return (
              <div key={`a-${idx}`} className="relative">
                <div
                  className="absolute inset-0 rounded-md bg-red-500/10"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative grid grid-cols-3 text-[11px] px-2 py-1 rounded-md">
                  <div className="text-red-300">{r.price.toFixed(2)}</div>
                  <div className="text-right text-white/70">
                    {r.qty.toFixed(6)}
                  </div>
                  <div className="text-right text-white/60">
                    {r.total.toFixed(6)}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Mid */}
      <div className="py-2 border-y border-white/10 flex items-center justify-between">
        <div className="text-[11px] text-white/40">Mid</div>
        <div className="text-sm font-semibold text-teal-300">
          {state.mid ? state.mid.toFixed(2) : "—"}
        </div>
      </div>

      {/* Bids */}
      <div className="space-y-1">
        {state.bids.slice(0, 10).map((r, idx) => {
          const pct = Math.min((r.total / maxTotal) * 100, 100);
          return (
            <div key={`b-${idx}`} className="relative">
              <div
                className="absolute inset-0 rounded-md bg-emerald-500/10"
                style={{ width: `${pct}%` }}
              />
              <div className="relative grid grid-cols-3 text-[11px] px-2 py-1 rounded-md">
                <div className="text-emerald-300">{r.price.toFixed(2)}</div>
                <div className="text-right text-white/70">
                  {r.qty.toFixed(6)}
                </div>
                <div className="text-right text-white/60">
                  {r.total.toFixed(6)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
