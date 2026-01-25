
// components/terminal/personalized-dashboard/OrderBookModule.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { wsService } from "@/services/WebSocketService";
import { Plus } from "lucide-react";

interface Props {
  instanceId: string;
  marketType?: "spot" | "futures";
}

type SideRow = { price: number; qty: number; total: number };

const EXCHANGES = [
  { id: "binance", name: "Binance", active: true },
  { id: "okx", name: "OKX", active: true },
  { id: "bybit", name: "Bybit", active: true },
  { id: "coinbase", name: "Coinbase", active: true },
];

const POPULAR_BASE_ASSETS = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "ADA",
  "DOGE",
  "MATIC",
  "AVAX",
  "DOT",
  "LINK",
  "UNI",
];

const POPULAR_QUOTE_ASSETS_SPOT = ["USDT", "USDC", "BTC", "ETH", "BNB", "BUSD"];
const POPULAR_QUOTE_ASSETS_FUTURES = ["USDT", "USD"];

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


export default function OrderBookModule({
  instanceId,
  marketType = "spot",
}: Props) {
  const exchangeStorageKey = `orderbook-${marketType}-${instanceId}-exchange`;
  const symbolStorageKey = `orderbook-${marketType}-${instanceId}-symbol`;

  const [exchange, setExchange] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(exchangeStorageKey) || "binance";
    }
    return "binance";
  });

  const [symbol, setSymbol] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(symbolStorageKey);
      if (saved) return saved;
    }
    return "BTCUSDT";
  });

  const [orderBookData, setOrderBookData] = useState<{
    bids: SideRow[];
    asks: SideRow[];
    mid: number | null;
    source: "api" | "mock";
  }>({
    bids: [],
    asks: [],
    mid: null,
    source: "mock",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [baseAsset, setBaseAsset] = useState("");
  const [quoteAsset, setQuoteAsset] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(exchangeStorageKey, exchange);
    }
  }, [exchange, exchangeStorageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(symbolStorageKey, symbol);
    }
  }, [symbol, symbolStorageKey]);

  useEffect(() => {
    let mounted = true;

    // 🔥 Binance uses @depth20 for partial book depth (20 levels)
    const stream = `${symbol.toLowerCase()}@depth20`;

    // 🔥 Multi-exchange support - All exchanges now supported via WebSocketService
    const unsubscribe = wsService.subscribe(
      stream,
      (data) => {
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

            setOrderBookData({ bids, asks, mid, source: "api" });
          }
        } catch (error) {
          console.error("[OrderBook] Parse error:", error);
        }
      },
      marketType,
      exchange as any // 🔥 Pass exchange parameter for multi-exchange support
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [symbol, exchange, marketType]);

  const addSymbol = (base: string, quote: string) => {
    const baseUpper = base.toUpperCase().trim();
    const quoteUpper = quote.toUpperCase().trim();

    if (!baseUpper || !quoteUpper) {
      alert("Please enter both Base Asset and Quote Asset");
      return;
    }

    let newSymbol = "";
    if (exchange === "okx" || exchange === "coinbase") {
      newSymbol = `${baseUpper}-${quoteUpper}`;
    } else {
      newSymbol = `${baseUpper}${quoteUpper}`;
    }

    setSymbol(newSymbol);
    setBaseAsset("");
    setQuoteAsset("");
    setShowAddModal(false);
  };

  const { bids, asks, mid, source } = orderBookData;

  const bestBid = bids[0]?.price ?? null;
  const bestAsk = asks[0]?.price ?? null;

  const spread = useMemo(() => {
    if (
      !Number.isFinite(bestBid as number) ||
      !Number.isFinite(bestAsk as number)
    )
      return null;
    const value = (bestAsk as number) - (bestBid as number);
    const midCalc = ((bestAsk as number) + (bestBid as number)) / 2;
    const pct = midCalc ? (value / midCalc) * 100 : 0;
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

  const popularQuoteAssets =
    marketType === "spot"
      ? POPULAR_QUOTE_ASSETS_SPOT
      : POPULAR_QUOTE_ASSETS_FUTURES;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">
            Order Book ({marketType === "spot" ? "Spot" : "Futures"})
          </span>{" "}
          <span className="text-white/40">•</span>{" "}
          <span className="text-white/70">{symbol}</span>{" "}
          <span className="text-white/40">•</span>{" "}
          <span
            className={
              source === "api" ? "text-emerald-400" : "text-yellow-400"
            }
          >
            {source === "api" ? "LIVE" : "MOCK"}
          </span>
        </div>

        <div className="flex gap-2">
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="h-8 rounded-lg bg-[#0b1f1f] border border-white/10 text-xs text-white px-2 outline-none cursor-pointer hover:bg-[#0f2a2a] transition-colors"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="h-8 px-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
        <div>
          <div className="text-red-400 mb-1">SELL (Asks)</div>
          <div className="grid grid-cols-[1.2fr_1fr] sm:grid-cols-[1.2fr_1fr_1fr] text-white/40">
            <div>Price</div>
            <div className="text-right">Qty</div>
            <div className="text-right hidden sm:block">Total</div>
          </div>
        </div>

        <div>
          <div className="text-emerald-400 mb-1 text-right">BUY (Bids)</div>
          <div className="grid grid-cols-[1.2fr_1fr] sm:grid-cols-[1.2fr_1fr_1fr] text-white/40">
            <div>Price</div>
            <div className="text-right">Qty</div>
            <div className="text-right hidden sm:block">Total</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
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
                  <div className="relative grid grid-cols-[1.2fr_1fr] sm:grid-cols-[1.2fr_1fr_1fr] text-[11px] px-2 py-1">
                    <div className="text-red-300 whitespace-nowrap overflow-hidden text-ellipsis">
                      {fmt.price(r.price)}
                    </div>
                    <div className="text-right text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">
                      {fmt.qty(r.qty)}
                    </div>
                    <div className="text-right text-white/60 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:block">
                      {fmt.total(r.total)}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="space-y-1">
          {bids.slice(0, 12).map((r, idx) => {
            const pct = Math.min((r.total / maxBidTotal) * 100, 100);
            return (
              <div
                key={`b-${idx}`}
                className="relative overflow-hidden rounded-md"
              >
                <span>
                  {EXCHANGES.find(e => e.id === exchange)?.name}
                </span>

                <span
                  className={`
                    text-white/50
                    transition-transform duration-200
                    ${exchangeOpen ? "rotate-180" : ""}
                  `}
                >
                  ▾
                </span>
              </button>

              {exchangeOpen && (
                <div
                  className="absolute inset-0 bg-emerald-500/10"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative grid grid-cols-[1.2fr_1fr] sm:grid-cols-[1.2fr_1fr_1fr] text-[11px] px-2 py-1">
                  <div className="text-emerald-300 whitespace-nowrap overflow-hidden text-ellipsis">
                    {fmt.price(r.price)}
                  </div>
                  <div className="text-right text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">
                    {fmt.qty(r.qty)}
                  </div>
                  <div className="text-right text-white/60 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:block">
                    {fmt.total(r.total)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-2 border-y border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-white/40">Mid</div>
          <div className="text-sm font-semibold text-teal-300">
            {mid ? fmt.price(mid) : "—"}
          </div>
        </div>

            <div className="text-right text-white/60 whitespace-nowrap overflow-hidden text-ellipsis hidden sm:block">
              {fmt.total(r.total)}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-white/40">
            <span>Buy</span>
            <span>Sell</span>
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
      </div>

      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">
              Add Pair ({marketType === "spot" ? "Spot" : "Futures"})
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div className="space-y-3">
              <label className="block text-white/50 mb-2 text-[10px]">
                Add Custom Pair
              </label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={baseAsset}
                    onChange={(e) => setBaseAsset(e.target.value.toUpperCase())}
                    placeholder="Base (e.g. BTC)"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="text-white/40 font-bold">/</div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={quoteAsset}
                    onChange={(e) =>
                      setQuoteAsset(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && addSymbol(baseAsset, quoteAsset)
                    }
                    placeholder="Quote (e.g. USDT)"
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none focus:border-blue-500/50"
                  />
                </div>
                <button
                  onClick={() => addSymbol(baseAsset, quoteAsset)}
                  disabled={!baseAsset || !quoteAsset}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white rounded text-xs font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-white/40 text-[10px]">
                💡 Example: BTC / USDT ={" "}
                {exchange === "okx" || exchange === "coinbase"
                  ? "BTC-USDT"
                  : "BTCUSDT"}
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-2 text-[10px]">
                Popular Base Assets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {POPULAR_BASE_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setBaseAsset(asset)}
                    className={`px-3 py-2 rounded text-xs font-semibold transition-colors ${
                      baseAsset === asset
                        ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/50 mb-2 text-[10px]">
                Popular Quote Assets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {popularQuoteAssets.map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setQuoteAsset(asset)}
                    className={`px-3 py-2 rounded text-xs font-semibold transition-colors ${
                      quoteAsset === asset
                        ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
