// components/terminal/personalized-dashboard/FuturesPositionsModule.tsx
"use client";

import { useEffect, useState } from "react";
import { useFuturesPositionStore } from "@/store/futuresPositionStore";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { usePriceStore } from "@/store/priceStore";

interface Props {
  instanceId: string;
}

export default function FuturesPositionsModule({ instanceId }: Props) {
  const storageKey = `futures-positions-${instanceId}`;

  const positions = useFuturesPositionStore((s) => s.positions);
  const removePosition = useFuturesPositionStore((s) => s.removePosition);
  const prices = usePriceStore((s) => s.prices);

  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState("");
  const [size, setSize] = useState("");
  const [leverage, setLeverage] = useState(10);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // Could restore positions here if needed
        } catch (e) {
          console.warn("Failed to parse saved positions");
        }
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined" && positions.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(positions));
    }
  }, [positions, storageKey]);

  const addPosition = () => {
    if (!symbol || !entry || !size) {
      alert("Please fill all fields");
      return;
    }

    const entryPrice = parseFloat(entry);
    const posSize = parseFloat(size);

    if (entryPrice <= 0 || posSize <= 0) {
      alert("Invalid entry or size");
      return;
    }

    useFuturesPositionStore.getState().addPosition({
      symbol: symbol.toUpperCase(),
      side,
      entryPrice,
      size: posSize,
      leverage,
    });

    setSymbol("");
    setEntry("");
    setSize("");
  };

  if (positions.length === 0) {
    return (
      <div className="space-y-3 text-xs">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Symbol (e.g. BTCUSDT)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSide("long")}
              className={`py-2 rounded text-xs cursor-pointer transition ${
                side === "long"
                  ? "bg-emerald-500 text-white"
                  : "bg-white/5 text-white/50"
              }`}
            >
              Long
            </button>
            <button
              onClick={() => setSide("short")}
              className={`py-2 rounded text-xs cursor-pointer transition ${
                side === "short"
                  ? "bg-red-500 text-white"
                  : "bg-white/5 text-white/50"
              }`}
            >
              Short
            </button>
          </div>

          <input
            type="number"
            placeholder="Entry Price"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
          />

          <input
            type="number"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
          />

          <div>
            <label className="block text-white/50 mb-1 text-[10px]">
              Leverage: {leverage}x
            </label>
            <input
              type="range"
              min="1"
              max="125"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>

          <button
            onClick={addPosition}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition text-xs font-semibold cursor-pointer"
          >
            Add Position
          </button>
        </div>

        <div className="text-center text-white/40 text-[10px]">
          No futures positions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {positions.map((pos) => {
        const currentPrice = prices[pos.symbol] || pos.entryPrice;
        const pnl =
          pos.side === "long"
            ? (currentPrice - pos.entryPrice) * pos.size
            : (pos.entryPrice - currentPrice) * pos.size;

        const pnlPercent =
          (pnl / (pos.entryPrice * pos.size)) * 100 * pos.leverage;
        const isProfit = pnl >= 0;

        return (
          <div
            key={pos.id}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {pos.side === "long" ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className="text-sm font-semibold text-white">
                  {pos.symbol.replace("USDT", "")}
                </span>
                <span className="text-[10px] text-white/40">
                  {pos.leverage}x
                </span>
              </div>

              <button
                onClick={() => removePosition(pos.id)}
  className="
    text-white/40
    cursor-pointer
    transition-all
    duration-150
    hover:text-red-400
    hover:scale-110
    hover:drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]
  "
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="text-[11px] space-y-0.5">
              <div className="flex justify-between text-white/50">
                <span>Entry</span>
                <span>${pos.entryPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-white/50">
                <span>Current</span>
                <span>${currentPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-white/50">
                <span>Size</span>
                <span>{pos.size}</span>
              </div>

              <div className="flex justify-between font-semibold pt-1 border-t border-white/10">
                <span className="text-white/70">PnL</span>
                <span
                  className={isProfit ? "text-emerald-400" : "text-red-400"}
                >
                  {isProfit ? "+" : ""}${pnl.toFixed(2)} ({isProfit ? "+" : ""}
                  {pnlPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
