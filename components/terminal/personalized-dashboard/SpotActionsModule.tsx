"use client";

import { useState, useRef, useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";

interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
  { id: "coinbase", name: "Coinbase" },
];

const QUICK_PRESETS = [
  { symbol: "BTCUSDT", name: "BTC", suggestedPrice: "45000" },
  { symbol: "ETHUSDT", name: "ETH", suggestedPrice: "2500" },
  { symbol: "SOLUSDT", name: "SOL", suggestedPrice: "100" },
  { symbol: "BNBUSDT", name: "BNB", suggestedPrice: "300" },
  { symbol: "XRPUSDT", name: "XRP", suggestedPrice: "0.50" },
  { symbol: "ADAUSDT", name: "ADA", suggestedPrice: "0.35" },
];

export default function SpotActionsModule({ instanceId }: Props) {
  const { addSpotPosition } = usePortfolioStore();

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState("binance");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const exchangeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close exchange dropdown on outside click
  useEffect(() => {
    if (!exchangeOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (exchangeRef.current && !exchangeRef.current.contains(e.target as Node)) {
        setExchangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exchangeOpen]);

  const handleSubmit = () => {
    if (!quantity || !price) {
      alert("Please fill all fields");
      return;
    }

    const qty = parseFloat(quantity);
    const entryPrice = parseFloat(price);

    if (isNaN(qty) || isNaN(entryPrice) || qty <= 0 || entryPrice <= 0) {
      alert("Invalid quantity or price");
      return;
    }

    // Parse symbol
    const baseAsset = symbol.replace("USDT", "");
    const quoteAsset = "USDT";

    addSpotPosition({
      exchange,
      baseAsset,
      quoteAsset,
      pair: `${baseAsset}/${quoteAsset}`,
      formattedPair: symbol,
      symbol,
      quantity: qty,
      entryPrice,
      currentPrice: entryPrice,
      totalCost: qty * entryPrice,
      entryDate: new Date().toISOString(),
    });

    // Reset form
    setQuantity("");
    setPrice("");
  };

  const totalCost = quantity && price ? (parseFloat(quantity) * parseFloat(price)).toFixed(2) : "0.00";

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
<span className="font-semibold text-foreground text-xs whitespace-nowrap flex items-center gap-1.5">
  <Coins className="w-3.5 h-3.5 text-muted-foreground" />
  Spot Actions
</span>


        <span className="text-muted-foreground text-xs">•</span>

        <span
          className={`text-xs font-semibold whitespace-nowrap ${
            action === "buy" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {action === "buy" ? "BUY MODE" : "SELL MODE"}
        </span>

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
        <div className="space-y-3">
          {/* Action Toggle - Fully Responsive */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAction("buy")}
              className={`
                py-2.5 rounded-md font-semibold text-xs
                transition-all duration-150
                cursor-pointer
                flex items-center justify-center gap-1.5
                ${
                  action === "buy"
                    ? "bg-emerald-500 text-foreground shadow-lg shadow-emerald-500/20"
                    : "bg-secondary text-muted-foreground hover:bg-black/15 dark:hover:bg-white/15 border border-border"
                }
              `}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>BUY</span>
            </button>
            <button
              onClick={() => setAction("sell")}
              className={`
                py-2.5 rounded-md font-semibold text-xs
                transition-all duration-150
                cursor-pointer
                flex items-center justify-center gap-1.5
                ${
                  action === "sell"
                    ? "bg-red-500 text-foreground shadow-lg shadow-red-500/20"
                    : "bg-secondary text-muted-foreground hover:bg-black/15 dark:hover:bg-white/15 border border-border"
                }
              `}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>SELL</span>
            </button>
          </div>

          <div>
            <label className="block text-muted-foreground mb-1.5 font-medium text-[10px]">
              Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTCUSDT"
              className="w-full bg-input border border-border rounded-md px-2.5 py-2 text-foreground text-xs outline-none focus:border-blue-500/50 transition-colors placeholder-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block text-muted-foreground mb-1.5 font-medium text-[10px]">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.5"
                step="0.001"
                className="w-full bg-input border border-border rounded-md px-2.5 py-2 text-foreground text-xs outline-none focus:border-blue-500/50 transition-colors placeholder-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-1.5 font-medium text-[10px]">
                Price (USDT)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
                step="0.01"
                className="w-full bg-input border border-border rounded-md px-2.5 py-2 text-foreground text-xs outline-none focus:border-blue-500/50 transition-colors placeholder-muted-foreground"
              />
            </div>
          </div>

          {quantity && price && (
            <div className="bg-input border border-border rounded-md p-3">
              <div className="text-muted-foreground text-[10px] mb-1 font-medium">Total Cost</div>
              <div
                className={`text-xl font-bold break-words ${
                  action === "buy" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                ${totalCost}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!quantity || !price}
            className={`
              w-full py-2.5 rounded-md font-semibold text-xs
              transition-all
              cursor-pointer
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                action === "buy"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-foreground shadow-lg shadow-emerald-500/20"
                  : "bg-red-500 hover:bg-red-600 text-foreground shadow-lg shadow-red-500/20"
              }
            `}
          >
            {action === "buy" ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>Add Buy Position</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4" />
                <span>Add Sell Position</span>
              </>
            )}
          </button>

          <div className="pt-3 border-t border-border">
            <div className="text-muted-foreground text-[10px] mb-2 font-medium">Quick Presets</div>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_PRESETS.map((preset) => (
                <button
                  key={preset.symbol}
                  onClick={() => {
                    setSymbol(preset.symbol);
                    setPrice(preset.suggestedPrice);
                  }}
                  className={`
                    py-2 px-2 rounded-md text-[10px] font-semibold
                    border transition-all duration-150
                    cursor-pointer
                    whitespace-nowrap
                  bg-secondary text-foreground border-border
                  hover:text-[#1A73E8]

                  `}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info Message */}
          <div className="text-center pt-2">
            <div className="text-muted-foreground text-[10px] break-words">
              This will add a position to your portfolio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}