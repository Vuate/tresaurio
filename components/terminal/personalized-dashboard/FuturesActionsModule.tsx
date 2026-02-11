"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface Props {
  instanceId: string;
}

const EXCHANGES = [
  { id: "binance", name: "Binance" },
  { id: "okx", name: "OKX" },
  { id: "bybit", name: "Bybit" },
];

const QUICK_LEVERAGE_PRESETS = [
  { value: 5, label: "5x" },
  { value: 10, label: "10x" },
  { value: 20, label: "20x" },
  { value: 50, label: "50x" },
  { value: 75, label: "75x" },
  { value: 100, label: "100x" },
];

const QUICK_SYMBOL_PRESETS = [
  { symbol: "BTCUSDT", name: "BTC", leverage: 10 },
  { symbol: "ETHUSDT", name: "ETH", leverage: 20 },
  { symbol: "SOLUSDT", name: "SOL", leverage: 50 },
  { symbol: "BNBUSDT", name: "BNB", leverage: 25 },
  { symbol: "XRPUSDT", name: "XRP", leverage: 30 },
  { symbol: "ADAUSDT", name: "ADA", leverage: 40 },
];

export default function FuturesActionsModule({ instanceId }: Props) {
  const { addFuturesPosition } = usePortfolioStore();

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState("binance");
  const [side, setSide] = useState<"long" | "short">("long");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(10);
  const [leverageInput, setLeverageInput] = useState("10");
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

  // Calculate liquidation price
  const liquidationPrice = useMemo(() => {
    if (!price || !quantity) return 0;

    const entryPrice = parseFloat(price);
    if (isNaN(entryPrice) || entryPrice <= 0) return 0;

    if (side === "long") {
      return entryPrice * (1 - 1 / leverage);
    } else {
      return entryPrice * (1 + 1 / leverage);
    }
  }, [price, leverage, side]);

  // Calculate margin required
  const marginRequired = useMemo(() => {
    if (!price || !quantity) return 0;

    const entryPrice = parseFloat(price);
    const qty = parseFloat(quantity);

    if (isNaN(entryPrice) || isNaN(qty)) return 0;

    return (entryPrice * qty) / leverage;
  }, [price, quantity, leverage]);

  // Calculate position size
  const positionSize = useMemo(() => {
    if (!price || !quantity) return 0;

    const entryPrice = parseFloat(price);
    const qty = parseFloat(quantity);

    if (isNaN(entryPrice) || isNaN(qty)) return 0;

    return entryPrice * qty;
  }, [price, quantity]);

  const handleLeverageSliderChange = (value: number) => {
    setLeverage(value);
    setLeverageInput(value.toString());
  };

  const handleLeverageInputChange = (value: string) => {
    setLeverageInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 125) {
      setLeverage(numValue);
    }
  };

  const handleLeverageInputBlur = () => {
    const numValue = parseInt(leverageInput);
    if (isNaN(numValue) || numValue < 1) {
      setLeverage(1);
      setLeverageInput("1");
    } else if (numValue > 125) {
      setLeverage(125);
      setLeverageInput("125");
    }
  };

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

    const baseAsset = symbol.replace("USDT", "");
    const quoteAsset = "USDT";

    addFuturesPosition({
      exchange,
      baseAsset,
      quoteAsset,
      pair: `${baseAsset}/${quoteAsset}`,
      formattedPair: symbol,
      symbol,
      side,
      quantity: qty,
      entryPrice,
      markPrice: entryPrice,
      leverage,
      liquidationPrice,
      totalCost: marginRequired,
      entryDate: new Date().toISOString(),
      fundingRate: 0.0001,
    });

    setQuantity("");
    setPrice("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs whitespace-nowrap">
          ⚡ Futures Actions
        </span>
        <span className="text-white/40 text-xs">•</span>
        <span
          className={`text-xs font-semibold whitespace-nowrap ${
            side === "long" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {side === "long" ? "LONG MODE" : "SHORT MODE"}
        </span>
        <div className="flex-1 min-w-[20px]"></div>

        {/* Exchange Dropdown - Dynamic positioning */}
        <div ref={exchangeRef} className="relative">
          <button
            onClick={() => setExchangeOpen((v) => !v)}
            className="
              h-7 px-3 rounded-lg
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
                  bg-[#0b1f1f]
                  border border-emerald-500/20
                  rounded-lg
                  shadow-lg
                  animate-in fade-in slide-in-from-top-2 duration-200

                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
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
            );
          })()}
        </div>
      </div>

      {/* Content - Scrollable */}
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
        <div className="space-y-3">
          {/* Side Toggle - Compact, no overflow */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide("long")}
              className={`
                py-2 rounded-lg font-semibold text-xs
                transition-all duration-150
                cursor-pointer
                flex items-center justify-center gap-1
                ${
                  side === "long"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white/10 text-white/60 hover:bg-white/15 border border-white/10"
                }
              `}
            >
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span className="truncate">LONG</span>
            </button>
            <button
              onClick={() => setSide("short")}
              className={`
                py-2 rounded-lg font-semibold text-xs
                transition-all duration-150
                cursor-pointer
                flex items-center justify-center gap-1
                ${
                  side === "short"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-white/10 text-white/60 hover:bg-white/15 border border-white/10"
                }
              `}
            >
              <TrendingDown className="w-3 h-3 shrink-0" />
              <span className="truncate">SHORT</span>
            </button>
          </div>

          <div>
            <label className="block text-white/50 mb-1.5 font-medium text-[10px]">
              Symbol
            </label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="BTCUSDT"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs outline-none focus:border-blue-500/50 transition-colors placeholder-white/30"
            />
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 gap-2">
            <div>
              <label className="block text-white/50 mb-1.5 font-medium text-[10px]">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.5"
                step="0.001"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs outline-none focus:border-blue-500/50 transition-colors placeholder-white/30"
              />
            </div>

            <div>
              <label className="block text-white/50 mb-1.5 font-medium text-[10px]">
                Entry Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="45000"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-xs outline-none focus:border-blue-500/50 transition-colors placeholder-white/30"
              />
            </div>
          </div>

          {/* Calculations */}
          {quantity && price && (
            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                <div className="text-white/50 text-[10px] mb-0.5 font-medium">Margin Required</div>
                <div className="text-lg font-bold text-white">
                  ${marginRequired.toFixed(2)}
                </div>
              </div>

              <div
                className={`border rounded-lg p-2.5 ${
                  side === "long"
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-emerald-500/10 border-emerald-500/20"
                }`}
              >
                <div className="text-white/50 text-[10px] mb-0.5 font-medium">
                  Liquidation Price
                </div>
                <div
                  className={`text-lg font-bold ${
                    side === "long" ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  ${liquidationPrice.toFixed(2)}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5">
                <div className="text-white/50 text-[10px] mb-0.5 font-medium">Position Size</div>
                <div className="text-lg font-bold text-blue-400">
                  ${positionSize.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!quantity || !price}
            className={`
              w-full py-2.5 rounded-lg font-semibold text-xs
              transition-all
              cursor-pointer
              flex items-center justify-center gap-1.5
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                side === "long"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
              }
            `}
          >
            {side === "long" ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Open Long Position</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Open Short Position</span>
              </>
            )}
          </button>

          <div className="pt-3 border-t border-white/10">
            <div className="text-white/50 text-[10px] mb-2 font-medium">Quick Presets</div>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_SYMBOL_PRESETS.map((preset) => (
                <button
                  key={preset.symbol}
                  onClick={() => {
                    setSymbol(preset.symbol);
                    setLeverage(preset.leverage);
                    setLeverageInput(preset.leverage.toString());
                  }}
                  className="
                    py-1.5 px-2 rounded-lg text-[10px] font-semibold
                    border transition-all duration-150
                    cursor-pointer
                    bg-white/10 text-white border-white/10
                    hover:bg-teal-500/15
                    hover:border-teal-400/40
                    hover:text-teal-400
                    hover:shadow-[0_0_0_1px_rgba(45,212,191,0.35)]
                    truncate
                  "
                >
                  {preset.name} {preset.leverage}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-t border-yellow-500/20">
        <div className="flex items-start gap-1.5 mb-2">
          <AlertCircle className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
          <span className="text-yellow-400 font-semibold text-[9px] leading-tight">
            High Risk: Use stop-loss orders
          </span>
        </div>

<div className="flex flex-wrap items-center justify-between gap-2 mb-2">
  <label className="text-white/70 text-[10px] font-semibold">
    Leverage
  </label>
  <input
    type="number"
    min="1"
    max="125"
    value={leverageInput}
    onChange={(e) => handleLeverageInputChange(e.target.value)}
    onBlur={handleLeverageInputBlur}
    className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs outline-none text-right focus:border-blue-500/50 transition-colors shrink-0"
  />
</div>

        <input
          type="range"
          min="1"
          max="125"
          value={leverage}
          onChange={(e) => handleLeverageSliderChange(parseInt(e.target.value))}
          className="w-full accent-blue-500 mb-2"
        />

        <div>
          <div className="text-white/50 text-[10px] mb-1.5 font-medium">Quick</div>
          <div className="grid grid-cols-3 gap-1">
            {QUICK_LEVERAGE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setLeverage(preset.value);
                  setLeverageInput(preset.value.toString());
                }}
                className={`
                  py-1 px-1.5 rounded-lg text-[9px] font-semibold
                  border transition-all duration-150
                  cursor-pointer
                  truncate
                  ${
                    leverage === preset.value
                      ? "bg-blue-500/30 text-blue-300 border-blue-500/50"
                      : `
                          bg-white/10 text-white border-white/10
                          hover:bg-teal-500/15
                          hover:border-teal-400/40
                          hover:text-teal-400
                        `
                  }
                `}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}