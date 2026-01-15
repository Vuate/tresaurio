// components/terminal/personalized-dashboard/LivePricesModule.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, X, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance", active: true },
  { id: "okx", name: "OKX", active: true },
  { id: "bybit", name: "Bybit", active: true },
  { id: "coinbase", name: "Coinbase", active: true },
];

const POPULAR_SYMBOLS_BY_EXCHANGE = {
  binance: [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "MATICUSDT",
  ],
  okx: [
    "BTC-USDT",
    "ETH-USDT",
    "SOL-USDT",
    "BNB-USDT",
    "XRP-USDT",
    "ADA-USDT",
    "DOGE-USDT",
    "MATIC-USDT",
  ],
  bybit: [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "MATICUSDT",
  ],
  coinbase: [
    "BTC-USD",
    "ETH-USD",
    "SOL-USD",
    "BNB-USD",
    "XRP-USD",
    "ADA-USD",
    "DOGE-USD",
    "MATIC-USD",
  ],
};

// Mock base prices for non-Binance exchanges
const MOCK_PRICES: Record<string, number> = {
  "BTC-USDT": 99234.56,
  "ETH-USDT": 3456.78,
  "SOL-USDT": 142.89,
  "BNB-USDT": 612.34,
  "XRP-USDT": 2.45,
  "ADA-USDT": 1.08,
  "DOGE-USDT": 0.38,
  "MATIC-USDT": 0.89,
  "BTC-USD": 99234.56,
  "ETH-USD": 3456.78,
  "SOL-USD": 142.89,
  "BNB-USD": 612.34,
  "XRP-USD": 2.45,
  "ADA-USD": 1.08,
  "DOGE-USD": 0.38,
  "MATIC-USD": 0.89,
};

type PriceData = {
  price: number;
  change24h: number;
  lastUpdate: number;
};

export default function LivePricesModule({ instanceId }: Props) {
  const exchangeStorageKey = `live-prices-${instanceId}-exchange`;
  const watchlistStorageKey = `live-prices-${instanceId}-watchlist`;

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
          return ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
        }
      }
    }
    return ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
  });

  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [newSymbol, setNewSymbol] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Save exchange to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(exchangeStorageKey, exchange);
    }
  }, [exchange, exchangeStorageKey]);

  // Save watchlist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(watchlistStorageKey, JSON.stringify(watchlist));
    }
  }, [watchlist, watchlistStorageKey]);

  // 🔥 Binance WebSocket for LIVE data + Mock for others
  useEffect(() => {
    setIsMounted(true);

    if (exchange !== "binance" || watchlist.length === 0) {
      // Mock data for non-Binance exchanges
      if (exchange !== "binance") {
        const mockPrices: Record<string, PriceData> = {};
        watchlist.forEach((symbol) => {
          const basePrice = MOCK_PRICES[symbol] || 100;
          mockPrices[symbol] = {
            price: basePrice,
            change24h: (Math.random() - 0.5) * 10,
            lastUpdate: Date.now(),
          };
        });
        setPrices(mockPrices);

        // Update mock prices periodically
        const interval = setInterval(() => {
          setPrices((prev) => {
            const updated: Record<string, PriceData> = {};
            watchlist.forEach((symbol) => {
              const current = prev[symbol];
              if (current) {
                const changePercent = (Math.random() - 0.5) * 0.02; // ±1%
                updated[symbol] = {
                  price: current.price * (1 + changePercent),
                  change24h: current.change24h + (Math.random() - 0.5) * 0.5,
                  lastUpdate: Date.now(),
                };
              }
            });
            return { ...prev, ...updated };
          });
        }, 2000);

        return () => clearInterval(interval);
      }
      return;
    }

    // 🔥 BINANCE LIVE WebSocket
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isClosed = false;

    const connect = () => {
      if (isClosed) return;

      const streams = watchlist
        .map((symbol) => `${symbol.toLowerCase()}@ticker`)
        .join("/");

      const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log(`[LivePrices] ✅ Connected: ${watchlist.join(", ")}`);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.data) {
              const data = message.data;
              const symbol = data.s; // e.g., "BTCUSDT"
              const price = parseFloat(data.c); // Current price
              const change24h = parseFloat(data.P); // 24h price change percent

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
            console.error("[LivePrices] Parse error:", error);
          }
        };

        ws.onerror = () => {
          // Silently handle errors (HMR causes these)
        };

        ws.onclose = (event) => {
          if (isClosed) return;

          // Only log unexpected closures
          if (event.code !== 1000 && event.code !== 1001) {
            console.log(
              `[LivePrices] ⚠️ Disconnected (${event.code}), reconnecting...`
            );

            // Reconnect after 2 seconds
            reconnectTimeout = setTimeout(() => {
              connect();
            }, 2000);
          }
        };
      } catch (error) {
        console.error("[LivePrices] Connection failed:", error);
      }
    };

    connect();

    return () => {
      isClosed = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close(1000, "Component unmounted");
      }
    };
  }, [watchlist, exchange]);

  const addSymbol = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase().trim();
    if (!upperSymbol) return;
    if (watchlist.includes(upperSymbol)) {
      alert("Symbol already in watchlist");
      return;
    }
    setWatchlist([...watchlist, upperSymbol]);
    setNewSymbol("");
    setShowAddModal(false);
  };

  const removeSymbol = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const popularSymbols =
    POPULAR_SYMBOLS_BY_EXCHANGE[
      exchange as keyof typeof POPULAR_SYMBOLS_BY_EXCHANGE
    ];

  if (!isMounted) {
    return (
      <div className="space-y-3 text-xs h-full flex flex-col items-center justify-center">
        <div className="text-white/40 text-[10px]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">Live Prices</span>
          <span className="text-white/40"> • </span>
          <span
            className={
              exchange === "binance" ? "text-emerald-400" : "text-yellow-400"
            }
          >
            {exchange === "binance" ? "LIVE" : "MOCK"}
          </span>
        </div>

        <div className="flex gap-2">
          {/* Exchange Selector */}
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="h-8 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 px-2 outline-none cursor-pointer hover:bg-white/10"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {/* Add Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="h-8 px-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      {/* Exchange Warning */}
      {exchange !== "binance" && (
        <div className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs">
          ⚠️ {EXCHANGES.find((e) => e.id === exchange)?.name} WebSocket coming
          soon. Showing mock prices.
        </div>
      )}

      {/* Watchlist */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-[10px]">
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
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-sm font-semibold ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{symbol}</div>
                    <div className="text-white/40 text-[10px]">
                      {exchange.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-mono">
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
                        className={`text-[10px] font-semibold ${
                          isPositive ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {change24h.toFixed(2)}%
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">Add Symbol</h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Custom Symbol Input */}
            <div>
              <label className="block text-white/50 mb-2 text-[10px]">
                Custom Symbol
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSymbol(newSymbol)}
                  placeholder="e.g. BTCUSDT"
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
                />
                <button
                  onClick={() => addSymbol(newSymbol)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Popular Symbols */}
            <div>
              <label className="block text-white/50 mb-2 text-[10px]">
                Popular on {EXCHANGES.find((e) => e.id === exchange)?.name}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {popularSymbols.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => addSymbol(symbol)}
                    disabled={watchlist.includes(symbol)}
                    className={`px-3 py-2 rounded text-xs font-semibold transition-colors ${
                      watchlist.includes(symbol)
                        ? "bg-white/5 text-white/30 cursor-not-allowed"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {symbol}
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
