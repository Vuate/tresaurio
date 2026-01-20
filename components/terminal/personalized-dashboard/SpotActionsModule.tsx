// components/terminal/personalized-dashboard/SpotActionsModule.tsx

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

interface Props {
  instanceId: string;
}

export default function SpotActionsModule({ instanceId }: Props) {
  const { addSpotPosition } = usePortfolioStore();

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [exchange, setExchange] = useState("Binance");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");

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

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">💰</div>
          <h3 className="font-semibold">Spot Actions</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Action Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setAction("buy")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              action === "buy"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            🟢 BUY
          </button>
          <button
            onClick={() => setAction("sell")}
            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
              action === "sell"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            🔴 SELL
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
            <option value="Binance">Binance</option>
            <option value="OKX">OKX</option>
            <option value="Bybit">Bybit</option>
            <option value="Coinbase">Coinbase</option>
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
          <label className="text-xs text-white/60 mb-1 block">Quantity</label>
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
            Price (USDT)
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

        {/* Total */}
        {quantity && price && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/60 mb-1">Total Cost</div>
            <div className="text-xl font-bold text-white">
              ${(parseFloat(quantity) * parseFloat(price)).toFixed(2)}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            action === "buy"
              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {action === "buy" ? "🟢 Add Buy Position" : "🔴 Add Sell Position"}
        </button>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-white/10">
          <div className="text-xs text-white/60 mb-2">Quick Presets</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                setSymbol("BTCUSDT");
                setPrice("45000");
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              BTC
            </button>
            <button
              onClick={() => {
                setSymbol("ETHUSDT");
                setPrice("2500");
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              ETH
            </button>
            <button
              onClick={() => {
                setSymbol("SOLUSDT");
                setPrice("100");
              }}
              className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
            >
              SOL
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-white/40 text-center pt-2">
          This will add a position to your portfolio
        </div>
      </div>
    </div>
  );
}
