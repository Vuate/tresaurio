// components/terminal/personalized-dashboard/OrderBookModule.tsx
"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { wsService, type Exchange, type ConnectionStatus } from "@/services/WebSocketService";
import { Plus, RefreshCw, AlertCircle, X } from "lucide-react";

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
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  
  const maxRetries = 3;
  const timeoutMs = 30000;

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
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        exchangeRef.current &&
        !exchangeRef.current.contains(e.target as Node)
      ) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  // 🔒 Modal açıkken arka plan scroll'unu kilitle
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        contentRef.current.style.overflow = 'hidden';
        contentRef.current.scrollTop = scrollTop;
      }
    }

    return () => {
      document.body.style.overflow = '';
      if (contentRef.current) {
        contentRef.current.style.overflow = '';
      }
    };
  }, [showAddModal]);

  // Retry handler
  const handleRetry = useCallback(() => {
    const stream = `${symbol.toLowerCase()}@depth20`;
    console.log(`🔄 [OrderBook] Manual retry for ${exchange}:${symbol}`);
    setIsRetrying(true);
    setError(null);
    retryCountRef.current = 0;
    setOrderBookData({ bids: [], asks: [], mid: null, source: "mock" });
    wsService.forceReconnect(stream, marketType, exchange as Exchange);
    setTimeout(() => setIsRetrying(false), 1000);
  }, [symbol, exchange, marketType]);

  useEffect(() => {
    let mounted = true;

    setOrderBookData({ bids: [], asks: [], mid: null, source: "mock" });
    setError(null);
    setStatus("connecting");
    retryCountRef.current = 0;

    const stream = `${symbol.toLowerCase()}@depth20`;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (mounted && orderBookData.bids.length === 0 && orderBookData.asks.length === 0) {
        retryCountRef.current++;
        if (retryCountRef.current >= maxRetries) {
          setError(`Connection timeout for ${(exchange as string).toUpperCase()}. No data received.`);
        } else {
          console.log(`⏱️ [OrderBook] Timeout, retrying (${retryCountRef.current}/${maxRetries})...`);
          wsService.forceReconnect(stream, marketType, exchange as Exchange);
        }
      }
    }, timeoutMs);

    const unsubscribe = wsService.subscribe(
      stream,
      (data) => {
        if (!mounted) return;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

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
            setError(null);
            retryCountRef.current = 0;
          }
        } catch (err) {
          console.error("[OrderBook] Parse error:", err);
          setError("Failed to parse order book data");
        }
      },
      marketType,
      exchange as Exchange
    );

    const statusInterval = setInterval(() => {
      const currentStatus = wsService.getStatus(stream, marketType, exchange as Exchange);
      setStatus(currentStatus);
    }, 1000);

    return () => {
      mounted = false;
      unsubscribe();
      clearInterval(statusInterval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [symbol, exchange, marketType]);

  const addSymbol = useCallback((base: string, quote: string) => {
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
  }, [exchange]);

  const { bids, asks, mid } = orderBookData;

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

  const getDecimals = useMemo(() => {
    const midPrice = mid || bestBid || bestAsk || 0;

    let priceDecimals = 2;
    if (midPrice >= 10000) priceDecimals = 2;
    else if (midPrice >= 100) priceDecimals = 2;
    else if (midPrice >= 1) priceDecimals = 4;
    else if (midPrice >= 0.01) priceDecimals = 6;
    else if (midPrice >= 0.0001) priceDecimals = 8;
    else priceDecimals = 10;

    let qtyDecimals = 4;
    if (midPrice >= 10000) qtyDecimals = 5;
    else if (midPrice >= 100) qtyDecimals = 4;
    else if (midPrice >= 1) qtyDecimals = 2;
    else qtyDecimals = 0;

    return { priceDecimals, qtyDecimals };
  }, [mid, bestBid, bestAsk]);

  const fmt = useMemo(
    () => ({
      price: (v: number) =>
        v.toLocaleString(undefined, {
          minimumFractionDigits: getDecimals.priceDecimals,
          maximumFractionDigits: getDecimals.priceDecimals,
        }),
      qty: (v: number) => v.toFixed(getDecimals.qtyDecimals),
      total: (v: number) =>
        v >= 1000 ? `${(v / 1000).toFixed(2)}k` : v.toFixed(getDecimals.qtyDecimals),
    }),
    [getDecimals]
  );

  const popularQuoteAssets =
    marketType === "spot"
      ? POPULAR_QUOTE_ASSETS_SPOT
      : POPULAR_QUOTE_ASSETS_FUTURES;

  return (
    <div className={`h-full flex flex-col relative ${showAddModal ? 'overflow-hidden' : ''}`}>
      {/* 🎯 Fully Responsive Header - SpreadMonitor Style */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        {/* Title */}
        <span className="font-semibold text-white/90 text-xs">
          Order Book ({marketType === "spot" ? "Spot" : "Futures"})
        </span>
        
        {/* Separator */}
        <span className="text-white/40 text-xs">•</span>
        
        {/* Symbol */}
        <span className="text-white/70 text-xs whitespace-nowrap">{symbol}</span>
        
        {/* Separator */}
        <span className="text-white/40 text-xs">•</span>
        
        {/* Status */}
        <span
          className={`text-xs whitespace-nowrap ${
            status === "connected"
              ? "text-emerald-400"
              : status === "fallback"
                ? "text-orange-400"
                : status === "error"
                  ? "text-red-400"
                  : "text-yellow-400"
          }`}
        >
          {status === "connected"
            ? "LIVE"
            : status === "fallback"
              ? "REST"
              : status === "error"
                ? "ERROR"
                : "CONNECTING"}
        </span>

        {/* Spacer */}
        <div className="flex-1 min-w-[20px]"></div>

        {/* Retry Button */}
        {(error || status === "error") && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="h-7 px-2 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-all flex items-center cursor-pointer disabled:opacity-50 shrink-0"
            title="Retry connection"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
          </button>
        )}

        {/* Exchange Dropdown */}
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
            <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
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
                absolute right-0 mt-1 z-50
                w-[120px]
                max-h-[160px]
                overflow-y-auto
                bg-[#0b1f1f]
                border border-emerald-500/20
                rounded-md
                shadow-lg
                animate-in fade-in slide-in-from-top-2 duration-200

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-track]:bg-transparent
              "
            >
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchange(ex.id);
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

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="h-7 px-3 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto
          space-y-3

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
        {/* Error State */}
        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="ml-auto px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-[10px] font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {!error && bids.length === 0 && asks.length === 0 && (
          <div className="px-3 py-8 rounded-lg bg-white/5 border border-white/10">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <div className="text-xs text-white/60">
                Connecting to {(exchange as string).toUpperCase()}...
              </div>
            </div>
          </div>
        )}

        {/* Order Book Grid */}
        {bids.length > 0 && asks.length > 0 && (
          <>
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

              <div className="flex items-center justify-between text-[11px]">
                <div className="text-white/40">Spread</div>
                <div className="text-white/70">
                  {spread
                    ? `${spread.value.toFixed(getDecimals.priceDecimals)} (${spread.pct.toFixed(4)}%)`
                    : "—"}
                </div>
              </div>

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
          </>
        )}
      </div>

      {/* 🔧 Modal - Full Screen SpreadMonitor Style */}
      {showAddModal && (
        <div 
          className="
            fixed inset-0
            bg-[#0a0e1a] z-[100]
            flex flex-col overflow-hidden
            animate-in fade-in slide-in-from-bottom-4 duration-200
          "
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-white/10 bg-white/5 flex-shrink-0">
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              Add Pair ({marketType === "spot" ? "Spot" : "Futures"})
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white leading-none cursor-pointer transition-colors text-xl ml-auto"
            >
              ×
            </button>
          </div>

          {/* Modal Content */}
          <div
            className="
              flex-1 min-h-0 overflow-y-auto p-3

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-teal-400/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

              scrollbar-thin
              scrollbar-thumb-teal-400/40
              scrollbar-track-transparent
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {/* Custom Pair Input */}
              <div className="space-y-2">
                <label className="block text-white/50 font-medium text-[10px]">
                  Add Custom Pair
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={baseAsset}
                      onChange={(e) => setBaseAsset(e.target.value.toUpperCase())}
                      placeholder="Base (e.g. BTC)"
                      className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div className="text-white/40 font-bold text-xs shrink-0">/</div>
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={quoteAsset}
                      onChange={(e) => setQuoteAsset(e.target.value.toUpperCase())}
                      onKeyDown={(e) =>
                        e.key === "Enter" && addSymbol(baseAsset, quoteAsset)
                      }
                      placeholder="Quote (e.g. USDT)"
                      className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => addSymbol(baseAsset, quoteAsset)}
                    disabled={!baseAsset || !quoteAsset}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white rounded-md font-semibold transition-all cursor-pointer text-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-white/40 text-[10px]">
                  💡 Example: BTC / USDT ={" "}
                  {exchange === "okx" || exchange === "coinbase"
                    ? "BTC-USDT"
                    : "BTCUSDT"}
                </div>
              </div>

              {/* Popular Base Assets */}
              <div>
                <label className="block text-white/50 mb-2 font-medium text-[10px]">
                  Popular Base Assets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_BASE_ASSETS.map((asset) => (
                    <button
                      key={asset}
                      onClick={() => setBaseAsset(asset)}
                      className={`
                        px-2 py-1.5 rounded-md font-semibold text-[10px]
                        border transition-all duration-150
                        cursor-pointer
                        whitespace-nowrap
                        ${
                          baseAsset === asset
                            ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                            : `
                                bg-white/10 text-white border-white/10
                                hover:bg-teal-500/15
                                hover:border-teal-400/40
                                hover:text-teal-400
                                hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
                              `
                        }
                      `}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Quote Assets */}
              <div>
                <label className="block text-white/50 mb-2 font-medium text-[10px]">
                  Popular Quote Assets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {popularQuoteAssets.map((asset) => (
                    <button
                      key={asset}
                      onClick={() => setQuoteAsset(asset)}
                      className={`
                        px-2 py-1.5 rounded-md font-semibold text-[10px]
                        border transition-all duration-150
                        cursor-pointer
                        whitespace-nowrap
                        ${
                          quoteAsset === asset
                            ? "bg-emerald-500/30 text-emerald-300 border-emerald-500/50"
                            : `
                                bg-white/10 text-white border-white/10
                                hover:bg-teal-500/15
                                hover:border-teal-400/40
                                hover:text-teal-400
                                hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
                              `
                        }
                      `}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}