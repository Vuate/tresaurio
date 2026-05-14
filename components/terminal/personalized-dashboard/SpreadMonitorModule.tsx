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
  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
    <span className="font-semibold text-foreground text-xs">
      Spread Monitor ({marketType === "spot" ? "Spot" : "Futures"})
    </span>
    
    <span className="text-muted-foreground text-xs">•</span>
    
    <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

    <div className="flex-1 min-w-[20px]"></div>

    <div ref={exchangeRef} className="relative">
      <button
        onClick={() => setExchangeOpen((v) => !v)}
        className="
          h-7 px-3 rounded-md
      bg-card
          border border-border
          text-foreground text-xs
          flex items-center gap-1.5
          cursor-pointer
          transition-all
          whitespace-nowrap
        "
      >
        <span>{EXCHANGES.find((e) => e.id === exchange)?.name}</span>
        <span
          className={`
            text-muted-foreground text-[10px]
            transition-transform duration-200
            ${exchangeOpen ? "rotate-180" : ""}
          `}
        >
          ▾
        </span>
      </button>

      {exchangeOpen && (() => {
        const buttonRect = exchangeRef.current?.getBoundingClientRect();
        const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;

        return (
          <div
            onWheel={(e) => e.stopPropagation()}
            className={`
              absolute mt-1 z-50
              w-[120px]
              max-h-[160px]
              overflow-y-auto
              bg-secondary border border-border
              rounded-md
              shadow-lg
              animate-in fade-in slide-in-from-top-2 duration-200

              [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-track]:bg-transparent

              ${shouldOpenLeft ? 'right-0' : 'left-0'}
            `}
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
                  text-foreground
                  transition-colors
         hover:text-[#1A73E8]/65
                "
              >
                {ex.name}
              </button>
            ))}
          </div>
        );
      })()}
    </div>

    <button
      onClick={() => setShowAddModal(true)}
      className="h-7 px-3 rounded-md bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/50 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 hover:bg-blue-500/25 dark:hover:bg-blue-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
    >
      <Plus className="w-3 h-3" />
      Add
    </button>
  </div>


      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40          [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/50 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/60
          scrollbar-thin
scrollbar-thumb-foreground/40          scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
        "
      >
        <div className="space-y-2">
          {monitoredSymbols.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs">
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
                  className="px-3 py-2 rounded-md bg-input border border-border hover:bg-black/8 dark:hover:bg-white/8 transition-all"
                >
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isNarrow ? "bg-emerald-400" : "bg-yellow-400"
                      }`}
                    />

                    <div className="text-foreground font-semibold leading-tight text-xs whitespace-nowrap shrink-0">
                      {symbol}
                    </div>

                    <div className="text-muted-foreground leading-tight text-[10px] whitespace-nowrap shrink-0">
                      {exchange.toUpperCase()}
                    </div>

                    <div className="text-muted-foreground leading-tight text-[10px] shrink-0">
                      •
                    </div>

                    <div className="text-muted-foreground leading-tight text-[10px] whitespace-nowrap shrink-0">
                      {marketType === "spot" ? "SPOT" : "FUTURES"}
                    </div>

                    <div className="flex-1 min-w-[10px]"></div>

                    <button
                      onClick={() => removeSymbol(symbol)}
                      className="text-muted-foreground hover:text-red-400 transition-all cursor-pointer hover:scale-110 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-[10px]">
                    <div className="shrink-0">
                      <div className="text-muted-foreground whitespace-nowrap">Price</div>
                      <div className="text-foreground font-mono text-xs whitespace-nowrap">
                        {price > 0 ? (
                          `$${price.toLocaleString(undefined, {
                            minimumFractionDigits: getDecimals(price).price,
                            maximumFractionDigits: getDecimals(price).price,
                          })}`
                        ) : (
                          <span className="text-muted-foreground">Loading...</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div className="text-muted-foreground whitespace-nowrap">Spread</div>
                      <div className="text-foreground font-mono text-xs whitespace-nowrap">
                        {price > 0 ? `$${spread.toFixed(getDecimals(price).spread)}` : "—"}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div className="text-muted-foreground whitespace-nowrap">Spread %</div>
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
                    <div className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
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

      {showAddModal && (
        <div 
          className="
            fixed inset-0
            bg-background z-[100]
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 border-b border-border bg-input flex-shrink-0">
            <span className="text-foreground font-semibold text-xs whitespace-nowrap">
              Add Symbol ({marketType === "spot" ? "Spot" : "Futures"})
            </span>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-muted-foreground hover:text-foreground leading-none cursor-pointer transition-colors text-xl ml-auto"
            >
              ×
            </button>
          </div>

          <div
            className="
              flex-1 min-h-0 overflow-y-auto p-3

              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
 [&::-webkit-scrollbar-thumb]:bg-black/40 dark:[&::-webkit-scrollbar-thumb]:bg-white/40              [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb:hover]:bg-black/50 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/60
              scrollbar-thin
scrollbar-thumb-foreground/40              scrollbar-track-transparent [scrollbar-color:rgba(0,0,0,0.5)_transparent] dark:[scrollbar-color:rgba(255,255,255,0.5)_transparent]
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {/* Custom Pair Input */}
              <div className="space-y-2">
                <label className="block text-muted-foreground font-medium text-[10px]">
                  Add Custom Pair
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={baseAsset}
                      onChange={(e) => setBaseAsset(e.target.value.toUpperCase())}
                      placeholder="Base (e.g. BTC)"
                      className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <div className="text-muted-foreground font-bold text-xs shrink-0">/</div>
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={quoteAsset}
                      onChange={(e) => setQuoteAsset(e.target.value.toUpperCase())}
                      onKeyDown={(e) =>
                        e.key === "Enter" && addSymbol(baseAsset, quoteAsset)
                      }
                      placeholder="Quote (e.g. USDT)"
                      className="w-full bg-input border border-border rounded-md px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => addSymbol(baseAsset, quoteAsset)}
                    disabled={!baseAsset || !quoteAsset}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground rounded-md font-semibold transition-all cursor-pointer text-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-muted-foreground text-[10px]">
                  💡 Example: BTC / USDT ={" "}
                  {exchange === "okx" || exchange === "coinbase"
                    ? "BTC-USDT"
                    : "BTCUSDT"}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-2 font-medium text-[10px]">
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
                            ? "bg-blue-500/20 dark:bg-blue-500/30 text-blue-600 dark:text-blue-300 border-blue-500/40 dark:border-blue-500/50"
                            : `
                    bg-secondary text-muted-foreground border-border
                hover:text-[#1A73E8]

                              `
                        }
                      `}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-2 font-medium text-[10px]">
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
                            ? "bg-emerald-500/15 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 dark:border-emerald-500/50"
                            : `
                    bg-secondary text-muted-foreground border-border
                    hover:text-[#1A73E8]

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