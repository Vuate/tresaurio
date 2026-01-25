// components/terminal/personalized-dashboard/SpreadMonitorModule.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { usePriceStore } from "@/store/priceStore";
import { TrendingUp, TrendingDown, Plus, X } from "lucide-react";

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
  binance: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT"],
  okx: ["BTC-USDT", "ETH-USDT", "SOL-USDT", "BNB-USDT", "XRP-USDT", "ADA-USDT"],
  bybit: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT"],
  coinbase: ["BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD", "ADA-USD"],
};

export default function SpreadMonitorModule({ instanceId }: Props) {
  const exchangeStorageKey = `spread-monitor-${instanceId}-exchange`;
  const symbolsStorageKey = `spread-monitor-${instanceId}-symbols`;

  const prices = usePriceStore((s) => s.prices);

  // Exchange state
  const [exchange, setExchange] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(exchangeStorageKey) || "binance";
    }
    return "binance";
  });

  // Monitored symbols state
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

  const [newSymbol, setNewSymbol] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
const exchangeRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (
      exchangeRef.current &&
      !exchangeRef.current.contains(e.target as Node)
    ) {
      setExchangeOpen(false);
    }
  }

  document.addEventListener("pointerdown", handleClickOutside);
  return () =>
    document.removeEventListener("pointerdown", handleClickOutside);
}, []);


  // Save exchange to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(exchangeStorageKey, exchange);
    }
  }, [exchange, exchangeStorageKey]);

  // Save symbols to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(symbolsStorageKey, JSON.stringify(monitoredSymbols));
    }
  }, [monitoredSymbols, symbolsStorageKey]);

  const addSymbol = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase().trim();
    if (!upperSymbol) return;
    if (monitoredSymbols.includes(upperSymbol)) {
      alert("Symbol already being monitored");
      return;
    }
    setMonitoredSymbols([...monitoredSymbols, upperSymbol]);
    setNewSymbol("");
    setShowAddModal(false);
  };

  const removeSymbol = (symbol: string) => {
    setMonitoredSymbols(monitoredSymbols.filter((s) => s !== symbol));
  };

  // Mock spread calculation
  const calculateSpread = (symbol: string) => {
    const price = prices[symbol] || 100000;
    const spread = price * (0.0001 + Math.random() * 0.0005); // 0.01% - 0.06%
    const spreadPercent = (spread / price) * 100;
    return { spread, spreadPercent };
  };

  const popularSymbols =
    POPULAR_SYMBOLS_BY_EXCHANGE[
      exchange as keyof typeof POPULAR_SYMBOLS_BY_EXCHANGE
    ];

  return (
<div className="space-y-3 text-xs h-full flex flex-col">
       {/* Header */}
      <div className="relative z-50 shrink-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/60">
          <span className="font-semibold text-white/90">Spread Monitor</span>
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

          <div ref={exchangeRef} className="relative">
<button
  onClick={() => setExchangeOpen(v => !v)}
  className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white flex items-center gap-2 cursor-pointer hover:bg-white/10"
>
  <span>
    {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
  </span>

  <span
    className={`
      text-white/50
      transition-transform
      duration-200
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
      absolute z-50 mt-1
      right-0
      w-[140px]
      bg-[#0b1f1f]
      border border-emerald-500/20
      rounded-none

      max-h-[min(72px,30vh)]
      overflow-y-auto
      overflow-x-hidden

      [&::-webkit-scrollbar]:w-1.5
      [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-track]:bg-transparent
    "
  >
      {EXCHANGES.map(ex => (
        <button
          key={ex.id}
          onClick={() => {
            setExchange(ex.id);
            setExchangeOpen(false);
          }}
    className="
      w-full px-3 py-2
      text-left text-xs
      cursor-pointer
      bg-transparent
      text-white
      transition-colors
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
            className="h-8 px-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
         </div>

               {/* Exchange Warning */}
      {exchange !== "binance" && (
        <div className= "px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs">
          ⚠️ {EXCHANGES.find((e) => e.id === exchange)?.name} WebSocket coming
          soon. Showing mock spreads.
        </div>
      )}



      {/* Spread List */}
<div
  className={`
    flex-1 min-h-0
    px-3
    space-y-2
    ${exchangeOpen ? "overflow-hidden pointer-events-none" : "overflow-y-auto"}

    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-track]:bg-transparent
  `}
>
         {monitoredSymbols.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-[10px]">
            No symbols being monitored. Click "Add" to add some.
          </div>
        ) : (
          monitoredSymbols.map((symbol) => {
            const price = prices[symbol] || 0;
            const { spread, spreadPercent } = calculateSpread(symbol);
            const isNarrow = spreadPercent < 0.03; // <0.03% = narrow spread

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
                        {exchange.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSymbol(symbol)}
                    className="text-white/40 hover:text-red-400 transition-all cursor-pointer hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-white/50">Price</div>
                    <div className="text-white font-mono">
                      $
                      {price > 0
                        ? price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Spread</div>
                    <div className="text-white font-mono">
                      ${spread.toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/50">Spread %</div>
                    <div
                      className={`font-mono font-semibold ${
                        isNarrow ? "text-emerald-400" : "text-yellow-400"
                      }`}
                    >
                      {spreadPercent.toFixed(3)}%
                    </div>
                  </div>
                </div>

                {/* Spread Quality Indicator */}
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

      {/* Add Modal */}
    {showAddModal && (
      <div className="
        absolute
        left-0 right-0 bottom-0
        top-[41px]
        bg-[#0a0e1a]
        z-50
        flex flex-col
        rounded-lg
        rounded-t-none
        overflow-hidden
      ">      
   <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
            <h3 className="text-white font-semibold text-sm">
              Add Symbol to Monitor
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-white/50 hover:text-white text-xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

<div
  className="
    flex-1 min-h-0 overflow-y-auto p-3 space-y-3

    [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-teal-400/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

    scrollbar-thin
    scrollbar-thumb-teal-400/40
    scrollbar-track-transparent
  "
>
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
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold cursor-pointer"
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
    disabled={monitoredSymbols.includes(symbol)}
    className={`
      px-3 py-2 rounded text-xs font-semibold
      border transition-all duration-150
      ${
        monitoredSymbols.includes(symbol)
          ? "bg-white/5 text-white/30 border-white/5 cursor-not-allowed"
          : `
              bg-white/10
              cursor-pointer
              text-white
              border-white/10

              hover:bg-teal-500/15
              hover:border-teal-400/40
              hover:text-teal-300
              hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
            `
      }
    `}
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
