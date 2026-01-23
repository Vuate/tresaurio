// components/terminal/personalized-dashboard/LivePricesModule.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, X, TrendingUp, TrendingDown } from "lucide-react";
import { wsService } from "@/services/WebSocketService"; // 🔥 EKLENDI

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

export default function LivePricesModule({
  instanceId,
  marketType = "spot",
}: Props) {
  const exchangeStorageKey = `live-prices-${marketType}-${instanceId}-exchange`;
  const watchlistStorageKey = `live-prices-${marketType}-${instanceId}-watchlist`;

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

  // 🔥 wsService kullanarak WebSocket bağlantısı - Multi-exchange support
  useEffect(() => {
    setIsMounted(true);

    if (watchlist.length === 0) {
      return;
    }

    // 🔥 wsService ile her symbol için ayrı subscription (ALL exchanges supported)
    const unsubscribes = watchlist.map((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;

      return wsService.subscribe(
        stream,
        (data) => {
          try {
            // Normalized ticker response format (handled by WebSocketService)
            const symbolData = data.s || data.data?.s;
            const price = parseFloat(data.c || data.data?.c || 0);
            const change24h = parseFloat(data.P || data.data?.P || 0);

            if (symbolData && price > 0) {
              setPrices((prev) => ({
                ...prev,
                [symbolData]: {
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
        exchange as any // 🔥 Pass exchange parameter for multi-exchange support
      );
    });

    // Cleanup: tüm subscriptions'ları kaldır
    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [watchlist, exchange, marketType]);

  const addSymbol = (base: string, quote: string) => {
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

    setWatchlist([...watchlist, symbol]);
    setPrices((prev) => ({
      ...prev,
      [symbol]: { price: 0, change24h: 0, lastUpdate: Date.now() },
    }));

    setBaseAsset("");
    setQuoteAsset("");
    setShowAddModal(false);
  };

  const removeSymbol = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const popularQuoteAssets =
    marketType === "spot"
      ? POPULAR_QUOTE_ASSETS_SPOT
      : POPULAR_QUOTE_ASSETS_FUTURES;

  if (!isMounted) {
    return (
      <div className="space-y-3 text-xs h-full flex flex-col items-center justify-center">
        <div className="text-white/40 text-[10px]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs h-full flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">
            Live Prices ({marketType === "spot" ? "Spot" : "Futures"})
          </span>
          <span className="text-white/40"> • </span>
          <span className="text-emerald-400">LIVE</span>
        </div>

        <div className="flex gap-2">
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

          <button
            onClick={() => setShowAddModal(true)}
            className="h-8 px-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

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
                      {exchange.toUpperCase()} •{" "}
                      {marketType === "spot" ? "SPOT" : "FUTURES"}
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

      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">
              Add Symbol ({marketType === "spot" ? "Spot" : "Futures"})
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
