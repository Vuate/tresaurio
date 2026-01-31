// components/terminal/personalized-dashboard/SpreadMonitorModule.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { wsService } from "@/services/WebSocketService";
import { Plus, X } from "lucide-react";

interface Props {
  instanceId: string;
  marketType?: "spot" | "futures";
}

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

export default function SpreadMonitorModule({
  instanceId,
  marketType = "spot",
}: Props) {
  const exchangeStorageKey = `spread-monitor-${marketType}-${instanceId}-exchange`;
  const symbolsStorageKey = `spread-monitor-${marketType}-${instanceId}-symbols`;

  const [exchange, setExchange] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(exchangeStorageKey) || "binance";
    }
    return "binance";
  });

  const [monitoredSymbols, setMonitoredSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(symbolsStorageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ["BTCUSDT", "ETHUSDT"];
        }
      }
    }
    return ["BTCUSDT", "ETHUSDT"];
  });

  const [priceData, setPriceData] = useState<
    Record<string, { price: number; bid: number; ask: number }>
  >({});
  const [baseAsset, setBaseAsset] = useState("");
  const [quoteAsset, setQuoteAsset] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const pendingUpdates = useRef<
    Record<string, { price: number; bid: number; ask: number }>
  >({});
  const lastUpdateTime = useRef<number>(0);
  const UPDATE_INTERVAL = 500;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(exchangeStorageKey, exchange);
    }
  }, [exchange, exchangeStorageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(symbolsStorageKey, JSON.stringify(monitoredSymbols));
    }
  }, [monitoredSymbols, symbolsStorageKey]);

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
      // Ana sayfanın scroll'unu kilitle
      document.body.style.overflow = 'hidden';
      
      // Component'in kendi scroll'unu da kilitle
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        contentRef.current.style.overflow = 'hidden';
        contentRef.current.scrollTop = scrollTop;
      }
    }

    return () => {
      // Modal kapanınca geri aç
      document.body.style.overflow = '';
      if (contentRef.current) {
        contentRef.current.style.overflow = '';
      }
    };
  }, [showAddModal]);

  const flushUpdates = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateTime.current >= UPDATE_INTERVAL) {
      const updates = { ...pendingUpdates.current };
      if (Object.keys(updates).length > 0) {
        setPriceData((prev) => ({ ...prev, ...updates }));
        pendingUpdates.current = {};
        lastUpdateTime.current = now;
      }
    }
  }, []);

  useEffect(() => {
    if (monitoredSymbols.length === 0) return;

    const flushInterval = setInterval(flushUpdates, UPDATE_INTERVAL);

    const unsubscribes = monitoredSymbols.map((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;

      return wsService.subscribe(
        stream,
        (data) => {
          try {
            const price = parseFloat(data.c || data.data?.c || 0);
            const bid = parseFloat(data.b || data.data?.b || 0);
            const ask = parseFloat(data.a || data.data?.a || 0);
            const symbolName = data.s || data.data?.s;

            if (symbolName && price > 0) {
              pendingUpdates.current[symbolName] = {
                price,
                bid: bid || price * 0.9999,
                ask: ask || price * 1.0001,
              };
            }
          } catch (error) {
            console.error(`[SpreadMonitor] Parse error for ${symbol}:`, error);
          }
        },
        marketType,
        exchange as any
      );
    });

    return () => {
      clearInterval(flushInterval);
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [monitoredSymbols, exchange, marketType, flushUpdates]);

  const addSymbol = useCallback((base: string, quote: string) => {
    const baseUpper = base.toUpperCase().trim();
    const quoteUpper = quote.toUpperCase().trim();

    if (!baseUpper || !quoteUpper) {
      alert("Please enter both Base Asset and Quote Asset");
      return;
    }

    let symbol = "";
    if (exchange === "okx" || exchange === "coinbase") {
      symbol = `${baseUpper}-${quoteUpper}`;
    } else {
      symbol = `${baseUpper}${quoteUpper}`;
    }

    if (monitoredSymbols.includes(symbol)) {
      alert("Symbol already being monitored");
      return;
    }

    setMonitoredSymbols([...monitoredSymbols, symbol]);
    setBaseAsset("");
    setQuoteAsset("");
    setShowAddModal(false);
  }, [exchange, monitoredSymbols]);

  const removeSymbol = useCallback((symbol: string) => {
    setMonitoredSymbols(monitoredSymbols.filter((s) => s !== symbol));
  }, [monitoredSymbols]);

  const calculateSpread = (symbol: string) => {
    const data = priceData[symbol];
    if (!data || data.price <= 0) {
      return { spread: 0, spreadPercent: 0 };
    }

    const spread = data.ask - data.bid;
    const spreadPercent = (spread / data.price) * 100;
    return { spread, spreadPercent };
  };

  const getDecimals = (price: number) => {
    if (price >= 10000) return { price: 2, spread: 2 };
    if (price >= 100) return { price: 2, spread: 4 };
    if (price >= 1) return { price: 4, spread: 6 };
    if (price >= 0.01) return { price: 6, spread: 8 };
    if (price >= 0.0001) return { price: 8, spread: 10 };
    return { price: 10, spread: 12 };
  };

  const popularQuoteAssets =
    marketType === "spot"
      ? POPULAR_QUOTE_ASSETS_SPOT
      : POPULAR_QUOTE_ASSETS_FUTURES;

  return (
    <div className={`h-full flex flex-col relative ${showAddModal ? 'overflow-hidden' : ''}`}>
      {/* 🎯 Fully Responsive Header - Every element wraps independently */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        {/* Title - Can wrap independently */}
        <span className="font-semibold text-white/90 text-xs">
          Spread Monitor ({marketType === "spot" ? "Spot" : "Futures"})
        </span>
        
        {/* Separator dot */}
        <span className="text-white/40 text-xs">•</span>
        
        {/* LIVE indicator - Can wrap independently */}
        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        {/* Spacer to push following items to the right when on same line */}
        <div className="flex-1 min-w-[20px]"></div>

        {/* Exchange Selector - Can wrap independently */}
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

        {/* Add Button - Can wrap independently */}
        <button
          onClick={() => setShowAddModal(true)}
          className="h-7 px-3 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Monitor List */}
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
        <div className="space-y-2">
          {monitoredSymbols.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">
              No symbols being monitored. Click "Add" to add some.
            </div>
          ) : (
            monitoredSymbols.map((symbol) => {
              const data = priceData[symbol];
              const price = data?.price || 0;
              const { spread, spreadPercent } = calculateSpread(symbol);
              const isNarrow = spreadPercent < 0.03;

              return (
                <div
                  key={symbol}
                  className="px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/8 transition-all"
                >
                  {/* Card Header - Fully Responsive */}
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-2">
                    {/* Status Indicator - Can wrap independently */}
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isNarrow ? "bg-emerald-400" : "bg-yellow-400"
                      }`}
                    />

                    {/* Symbol Name - Can wrap independently */}
                    <div className="text-white font-semibold leading-tight text-xs whitespace-nowrap shrink-0">
                      {symbol}
                    </div>

                    {/* Exchange Name - Can wrap independently */}
                    <div className="text-white/40 leading-tight text-[10px] whitespace-nowrap shrink-0">
                      {exchange.toUpperCase()}
                    </div>

                    {/* Separator dot - Can wrap independently */}
                    <div className="text-white/40 leading-tight text-[10px] shrink-0">
                      •
                    </div>

                    {/* Market Type - Can wrap independently */}
                    <div className="text-white/40 leading-tight text-[10px] whitespace-nowrap shrink-0">
                      {marketType === "spot" ? "SPOT" : "FUTURES"}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 min-w-[10px]"></div>

                    {/* Delete Button - Can wrap independently */}
                    <button
                      onClick={() => removeSymbol(symbol)}
                      className="text-white/40 hover:text-red-400 transition-all cursor-pointer hover:scale-110 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-[10px]">
                    {/* Price Column - Can wrap independently */}
                    <div className="shrink-0">
                      <div className="text-white/50 whitespace-nowrap">Price</div>
                      <div className="text-white font-mono text-xs whitespace-nowrap">
                        {price > 0 ? (
                          `$${price.toLocaleString(undefined, {
                            minimumFractionDigits: getDecimals(price).price,
                            maximumFractionDigits: getDecimals(price).price,
                          })}`
                        ) : (
                          <span className="text-white/40">Loading...</span>
                        )}
                      </div>
                    </div>

                    {/* Spread Column - Can wrap independently */}
                    <div className="shrink-0">
                      <div className="text-white/50 whitespace-nowrap">Spread</div>
                      <div className="text-white font-mono text-xs whitespace-nowrap">
                        {price > 0 ? `$${spread.toFixed(getDecimals(price).spread)}` : "—"}
                      </div>
                    </div>

                    {/* Spread % Column - Can wrap independently */}
                    <div className="shrink-0">
                      <div className="text-white/50 whitespace-nowrap">Spread %</div>
                      <div
                        className={`font-mono font-semibold text-xs whitespace-nowrap ${
                          isNarrow ? "text-emerald-400" : "text-yellow-400"
                        }`}
                      >
                        {price > 0 ? `${spreadPercent.toFixed(4)}%` : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isNarrow ? "bg-emerald-400" : "bg-yellow-400"
                        }`}
                        style={{
                          width: `${Math.min(100, (0.1 - spreadPercent) * 1000)}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-[9px] font-semibold ${
                        isNarrow ? "text-emerald-400" : "text-yellow-400"
                      }`}
                    >
                      {isNarrow ? "Narrow" : "Wide"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🔧 Modal - TRULY FULL SCREEN */}
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
          {/* Modal Header - Fully responsive pattern */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-white/10 bg-white/5 flex-shrink-0">
            <span className="text-white font-semibold text-xs whitespace-nowrap">
              Add Symbol ({marketType === "spot" ? "Spot" : "Futures"})
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