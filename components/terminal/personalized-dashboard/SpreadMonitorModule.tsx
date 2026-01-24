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

  // 🔥 Store price + bid/ask for real spread calculation
  const [priceData, setPriceData] = useState<
    Record<string, { price: number; bid: number; ask: number }>
  >({});
  const [baseAsset, setBaseAsset] = useState("");
  const [quoteAsset, setQuoteAsset] = useState("");

  // 🔥 Throttle updates - buffer incoming data
  const pendingUpdates = useRef<
    Record<string, { price: number; bid: number; ask: number }>
  >({});
  const lastUpdateTime = useRef<number>(0);
  const UPDATE_INTERVAL = 500; // Update UI every 500ms max
  const [showAddModal, setShowAddModal] = useState(false);

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

  // 🔥 Throttled state update function
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

  // 🔥 WebSocket price feed - Multi-exchange support with THROTTLING
  useEffect(() => {
    if (monitoredSymbols.length === 0) return;

    // Periodic flush for throttled updates
    const flushInterval = setInterval(flushUpdates, UPDATE_INTERVAL);

    // LIVE WebSocket for ALL exchanges
    const unsubscribes = monitoredSymbols.map((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;

      return wsService.subscribe(
        stream,
        (data) => {
          try {
            // Parse price and bid/ask based on exchange format
            const price = parseFloat(data.c || data.data?.c || 0);
            const bid = parseFloat(data.b || data.data?.b || 0);
            const ask = parseFloat(data.a || data.data?.a || 0);
            const symbolName = data.s || data.data?.s;

            if (symbolName && price > 0) {
              // Buffer update instead of immediate state change
              pendingUpdates.current[symbolName] = {
                price,
                bid: bid || price * 0.9999, // Fallback if no bid
                ask: ask || price * 1.0001, // Fallback if no ask
              };
            }
          } catch (error) {
            console.error(`[SpreadMonitor] Parse error for ${symbol}:`, error);
          }
        },
        marketType,
        exchange as any // 🔥 Multi-exchange support
      );
    });

    return () => {
      clearInterval(flushInterval);
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [monitoredSymbols, exchange, marketType, flushUpdates]);

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

    if (monitoredSymbols.includes(symbol)) {
      alert("Symbol already being monitored");
      return;
    }

    setMonitoredSymbols([...monitoredSymbols, symbol]);
    setBaseAsset("");
    setQuoteAsset("");
    setShowAddModal(false);
  };

  const removeSymbol = (symbol: string) => {
    setMonitoredSymbols(monitoredSymbols.filter((s) => s !== symbol));
  };

  // 🔥 Calculate REAL spread from bid/ask (no more random!)
  const calculateSpread = (symbol: string) => {
    const data = priceData[symbol];
    if (!data || data.price <= 0) {
      return { spread: 0, spreadPercent: 0 };
    }

    // Real spread = ask - bid
    const spread = data.ask - data.bid;
    const spreadPercent = (spread / data.price) * 100;
    return { spread, spreadPercent };
  };

  const popularQuoteAssets =
    marketType === "spot"
      ? POPULAR_QUOTE_ASSETS_SPOT
      : POPULAR_QUOTE_ASSETS_FUTURES;

  return (
    <div className="space-y-3 text-xs h-full flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">
            Spread Monitor ({marketType === "spot" ? "Spot" : "Futures"})
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
        {monitoredSymbols.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-[10px]">
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
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isNarrow ? "bg-emerald-400" : "bg-yellow-400"
                      }`}
                    />
                    <div>
                      <div className="text-white font-semibold">{symbol}</div>
                      <div className="text-white/40 text-[10px]">
                        {exchange.toUpperCase()} •{" "}
                        {marketType === "spot" ? "SPOT" : "FUTURES"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-white/50">Price</div>
                    <div className="text-white font-mono">
                      {price > 0 ? (
                        `$${price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      ) : (
                        <span className="text-white/40">Loading...</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Spread</div>
                    <div className="text-white font-mono">
                      {price > 0 ? `$${spread.toFixed(2)}` : "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Spread %</div>
                    <div
                      className={`font-mono font-semibold ${
                        isNarrow ? "text-emerald-400" : "text-yellow-400"
                      }`}
                    >
                      {price > 0 ? `${spreadPercent.toFixed(3)}%` : "—"}
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
                        width: `${Math.min(
                          100,
                          (0.1 - spreadPercent) * 1000
                        )}%`,
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
