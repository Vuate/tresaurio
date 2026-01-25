// components/terminal/personalized-dashboard/FuturesActionsModule.tsx

import { useState, useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

interface Props {
  instanceId: string;
}

export default function FuturesActionsModule({ instanceId }: Props) {
  const { addFuturesPosition } = usePortfolioStore();

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState("Binance");
  const [side, setSide] = useState<"long" | "short">("long");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [leverage, setLeverage] = useState(10);

  // Calculate liquidation price
  const liquidationPrice = useMemo(() => {
    if (!price || !quantity) return 0;

    const entryPrice = parseFloat(price);
    if (isNaN(entryPrice) || entryPrice <= 0) return 0;

    // Simplified liquidation calculation
    // Long: entryPrice * (1 - 1/leverage)
    // Short: entryPrice * (1 + 1/leverage)
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
      fundingRate: 0.0001, // Default funding rate
    });

    // Reset form
    setQuantity("");
    setPrice("");
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">⚡</div>
          <h3 className="font-semibold">Futures Actions</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Long/Short Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSide("long")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              side === "long"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            📈 LONG
          </button>
          <button
            onClick={() => setSide("short")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              side === "short"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            📉 SHORT
          </button>
        </div>

        {/* Exchange Selection */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">Exchange</label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
          >
            <option value="Binance">Binance Futures</option>
            <option value="OKX">OKX Futures</option>
            <option value="Bybit">Bybit Futures</option>
          </select>
        </div>

        {/* Symbol Input */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="BTCUSDT"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Quantity Input */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">
            Quantity (Contracts)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.5"
            step="0.001"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Price Input */}
        <div>
          <label className="text-xs text-white/60 mb-1 block">
            Entry Price (USDT)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45000"
            step="0.01"
            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Leverage Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs text-white/60">Leverage</label>
            <span className="text-sm font-bold text-white">{leverage}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="125"
            step="1"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/40 mt-1">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>100x</span>
            <span>125x</span>
          </div>
        </div>

        {/* Calculations */}
        {quantity && price && (
          <div className="space-y-2">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Margin Required</div>
              <div className="text-lg font-bold text-white">
                ${marginRequired.toFixed(2)}
              </div>
            </div>

            <div
              className={`rounded-lg p-3 ${
                side === "long" ? "bg-red-500/10" : "bg-emerald-500/10"
              }`}
            >
              <div className="text-xs text-white/60 mb-1">
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

            <div className="bg-blue-500/10 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Position Size</div>
              <div className="text-lg font-bold text-blue-400">
                ${(parseFloat(quantity) * parseFloat(price)).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            side === "long"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {side === "long" ? "📈 Open Long Position" : "📉 Open Short Position"}
        </button>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Quick Presets</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setSymbol("BTCUSDT");
                setPrice("45000");
                setLeverage(10);
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              BTC 10x
            </button>
            <button
              onClick={() => {
                setSymbol("ETHUSDT");
                setPrice("2500");
                setLeverage(20);
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              ETH 20x
            </button>
            <button
              onClick={() => {
                setSymbol("SOLUSDT");
                setPrice("100");
                setLeverage(50);
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              SOL 50x
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <span className="text-yellow-400">⚠️</span>
            <div className="text-xs text-yellow-400">
              <strong>High Risk:</strong> Trading with leverage can result in
              significant losses. Always use stop-loss orders.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
