"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Plus, X, TrendingUp, TrendingDown } from "lucide-react";
import { wsService } from "@/services/WebSocketService";

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

type PriceData = {
  price: number;
  change24h: number;
  lastUpdate: number;
};

// 🎯 Custom Hook: Window Size Check
function useWindowSizeCheck() {
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsTooSmall(window.innerWidth < 400 || window.innerHeight < 300);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return isTooSmall;
}

export default function LivePricesModule({
  instanceId,
  marketType = "spot",
}: Props) {
  const exchangeStorageKey = `live-prices-${marketType}-${instanceId}-exchange`;
  const watchlistStorageKey = `live-prices-${marketType}-${instanceId}-watchlist`;

  const windowTooSmall = useWindowSizeCheck();

  const [exchange, setExchange] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(exchangeStorageKey) || "binance";
    }
    return "binance";
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(watchlistStorageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return marketType === "spot"
            ? ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
            : ["BTCUSDT"];
        }
      }
    }
    return marketType === "spot"
      ? ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
      : ["BTCUSDT"];
  });

  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [baseAsset, setBaseAsset] = useState("");
  const [quoteAsset, setQuoteAsset] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'left' | 'right'>('right');
  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(exchangeStorageKey, exchange);
    }
  }, [exchange, exchangeStorageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(watchlistStorageKey, JSON.stringify(watchlist));
    }
  }, [watchlist, watchlistStorageKey]);

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

  useEffect(() => {
    setIsMounted(true);

    if (watchlist.length === 0) {
      return;
    }

    const unsubscribes = watchlist.map((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;

      return wsService.subscribe(
        stream,
        (data) => {
          try {
            const price = parseFloat(data.c || data.data?.c || 0);
            const change24h = parseFloat(data.P || data.data?.P || 0);

            if (price > 0) {
              setPrices((prev) => ({
                ...prev,
                [symbol]: {
                  price,
                  change24h,
                  lastUpdate: Date.now(),
                },
              }));
            }
          } catch (error) {
            console.error(`[LivePrices] Parse error for ${symbol}:`, error);
          }
        },
        marketType,
        exchange as any
      );
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [watchlist, exchange, marketType]);

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

    if (watchlist.includes(symbol)) {
      alert("Symbol already in watchlist");
      return;
    }

    setWatchlist((prev) => [...prev, symbol]);
    setPrices((prev) => ({
      ...prev,
      [symbol]: { price: 0, change24h: 0, lastUpdate: Date.now() },
    }));

    setBaseAsset("");
    setQuoteAsset("");
    setShowAddModal(false);
  }, [exchange, watchlist]);

  const removeSymbol = useCallback((symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  }, []);

  const popularQuoteAssets =
    marketType === "spot"
      ? POPULAR_QUOTE_ASSETS_SPOT
      : POPULAR_QUOTE_ASSETS_FUTURES;

  if (windowTooSmall) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0a0e1a] rounded-lg p-4">
        <div className="text-center space-y-2">
          <div className="text-white/90 font-semibold text-sm">
            Window Too Small
          </div>
          <div className="text-white/50 text-xs">
            Minimum size: 400x300px
            <br />
            Please resize your window
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/40 text-xs">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col relative ${showAddModal ? 'overflow-hidden' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          Live Prices ({marketType === "spot" ? "Spot" : "Futures"})
        </span>
        
        <span className="text-white/40 text-xs">•</span>
        
        <span className="text-emerald-400 text-xs whitespace-nowrap">LIVE</span>

        <div className="flex-1 min-w-[20px]"></div>

        <div ref={exchangeRef} className="relative">
          <button
onClick={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const dropdownWidth = 120;
  
  // Sağda yeterli alan var mı kontrol et
  const spaceOnRight = windowWidth - rect.right;
  
  // Eğer sağda dropdown için yeterli alan VARSA
  // sol taraftan aç (çünkü widget solda demektir)
  if (spaceOnRight >= dropdownWidth) {
    setDropdownPosition('left');
  } else {
    // Sağda yeterli alan yoksa sağdan aç (widget sağda demektir)
    setDropdownPosition('right');
  }
  
  setExchangeOpen((v) => !v);
}}
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
              className={`
                absolute ${dropdownPosition === 'right' ? 'right-0' : 'left-0'} mt-1 z-50
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

        <button
          onClick={() => setShowAddModal(true)}
          className="h-7 px-3 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-1 cursor-pointer font-medium text-xs whitespace-nowrap"
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
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        <div className="space-y-2">
          {watchlist.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-xs">
              No symbols in watchlist. Click "Add" to add some.
            </div>
          ) : (
            watchlist.map((symbol) => {
              const priceData = prices[symbol];
              const price = priceData?.price || 0;
              const change24h = priceData?.change24h || 0;
              const isPositive = change24h >= 0;

              return (
                <div
                  key={symbol}
                  className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/8 transition-all"
                >
                  <div
                    className={`font-semibold shrink-0 ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="text-white font-semibold leading-tight text-xs whitespace-nowrap shrink-0">
                    {symbol}
                  </div>

                  <div className="text-white/40 leading-tight text-[10px] whitespace-nowrap shrink-0">
                    {exchange.toUpperCase()}
                  </div>

                  <div className="text-white/40 leading-tight text-[10px] shrink-0">
                    •
                  </div>

                  <div className="text-white/40 leading-tight text-[10px] whitespace-nowrap shrink-0">
                    {marketType === "spot" ? "SPOT" : "FUTURES"}
                  </div>

                  <div className="flex-1 min-w-[10px]"></div>

                  <div className="text-white font-mono leading-tight text-xs whitespace-nowrap shrink-0">
                    {price > 0 ? (
                      `$${price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: price < 1 ? 6 : 2,
                      })}`
                    ) : (
                      <span className="text-white/40">Loading...</span>
                    )}
                  </div>

                  {price > 0 && (
                    <div
                      className={`font-semibold leading-tight text-[10px] whitespace-nowrap shrink-0 ${
                        isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {change24h.toFixed(2)}%
                    </div>
                  )}

                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="
                      text-white/40
                      hover:text-red-400
                      transition-all
                      cursor-pointer
                      hover:scale-110
                      shrink-0
                    "
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
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