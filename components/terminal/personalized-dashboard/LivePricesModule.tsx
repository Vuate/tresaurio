// components/terminal/personalized-dashboard/LivePricesModule.tsx
"use client";

import { useEffect, useState } from "react";
import { usePriceStore } from "@/store/priceStore";
import { wsService } from "@/services/WebSocketService";
import { Plus, X } from "lucide-react";

type PriceRow = {
  symbol: string;
  price: number;
};

interface Props {
  instanceId: string;
}

// 🔥 DEFAULT SYMBOLS
const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

export default function LivePricesModule({ instanceId }: Props) {
  const storageKey = `live-prices-${instanceId}-watchlist`;

  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");

  // 🔥 INSTANCE-SPECIFIC SYMBOLS (localStorage)
  const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : DEFAULT_SYMBOLS;
    }
    return DEFAULT_SYMBOLS;
  });

  // Save to localStorage when customSymbols changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(customSymbols));
    }
  }, [customSymbols, storageKey]);

  const updatePrice = usePriceStore((s) => s.updatePrice);

  useEffect(() => {
    let mounted = true;
    const unsubscribers: (() => void)[] = [];

    // Subscribe to custom symbols via WebSocket
    customSymbols.forEach((symbol) => {
      const stream = `${symbol.toLowerCase()}@ticker`;

      const unsubscribe = wsService.subscribe(stream, (data) => {
        if (!mounted) return;

        if (data.e === "24hrTicker") {
          const price = parseFloat(data.c);

          // Update local state
          setPrices((prev) => {
            const existing = prev.find((p) => p.symbol === symbol);
            if (existing) {
              return prev.map((p) =>
                p.symbol === symbol ? { ...p, price } : p
              );
            } else {
              return [...prev, { symbol, price }];
            }
          });

          // Update global price store
          updatePrice(symbol, price);

          setLoading(false);
          setError(null);
        }
      });

      unsubscribers.push(unsubscribe);
    });

    // Cleanup
    return () => {
      mounted = false;
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [customSymbols, updatePrice]);

  // 🔥 Add symbol
  const addSymbol = () => {
    const formatted = newSymbol.toUpperCase().trim();

    if (!formatted) {
      alert("Please enter a symbol");
      return;
    }

    // Add USDT if not present
    const symbol = formatted.includes("USDT") ? formatted : `${formatted}USDT`;

    if (customSymbols.includes(symbol)) {
      alert("Symbol already in watchlist");
      return;
    }

    setCustomSymbols([...customSymbols, symbol]);
    setNewSymbol("");
    setShowAddModal(false);
  };

  // 🔥 Remove symbol
  const removeSymbol = (symbol: string) => {
    if (customSymbols.length <= 1) {
      alert("Must have at least 1 symbol");
      return;
    }

    setCustomSymbols(customSymbols.filter((s) => s !== symbol));
  };

  // Filter prices by search query
  const filteredPrices = prices.filter((p) =>
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- UI STATES ---------------- */

  if (loading) {
    return (
      <div className="text-white/50 text-sm text-center py-4">
        Loading live prices…
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-sm">{error}</div>;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="relative space-y-2 h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0e1a] pb-2 z-10">
        {/* Search & Add Button */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 placeholder:text-white/30"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] text-white/40">
          <span>{filteredPrices.length} symbols</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">LIVE</span>
          </div>
        </div>
      </div>

      {/* Price List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filteredPrices.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-[10px]">
            No symbols found
          </div>
        ) : (
          filteredPrices.map((p) => (
            <div
              key={p.symbol}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeSymbol(p.symbol)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                  title="Remove from watchlist"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="text-sm font-semibold text-white">
                  {p.symbol.replace("USDT", "")}
                </div>
              </div>

              <div className="font-mono text-sm text-teal-400">
                $
                {p.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Symbol Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#0a0e1a] z-50 flex flex-col rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">Add Symbol</h3>
            <button
              onClick={() => {
                setShowAddModal(false);
                setNewSymbol("");
              }}
              className="text-white/50 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3 space-y-3">
            <div>
              <label className="block text-white/50 mb-1.5 text-[10px] font-semibold">
                Symbol Name
              </label>
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSymbol();
                }}
                placeholder="BTC, ETH, SOL..."
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none focus:border-emerald-500/50 placeholder:text-white/30"
                autoFocus
              />
              <div className="text-[9px] text-white/40 mt-1.5">
                Automatically adds USDT (e.g., BTC → BTCUSDT)
              </div>
            </div>

            {/* Popular Symbols */}
            <div>
              <div className="text-white/50 mb-2 text-[10px] font-semibold">
                Popular Symbols
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "BTC",
                  "ETH",
                  "BNB",
                  "SOL",
                  "XRP",
                  "ADA",
                  "DOGE",
                  "AVAX",
                  "DOT",
                  "MATIC",
                  "LINK",
                  "UNI",
                ].map((sym) => {
                  const fullSymbol = `${sym}USDT`;
                  const isAdded = customSymbols.includes(fullSymbol);

                  return (
                    <button
                      key={sym}
                      onClick={() => {
                        if (!isAdded) {
                          setCustomSymbols([...customSymbols, fullSymbol]);
                          setShowAddModal(false);
                        }
                      }}
                      disabled={isAdded}
                      className={`py-2 rounded text-xs font-semibold transition-colors ${
                        isAdded
                          ? "bg-white/5 text-white/30 cursor-not-allowed"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10">
            <button
              onClick={addSymbol}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded font-semibold text-xs transition-colors"
            >
              Add to Watchlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
