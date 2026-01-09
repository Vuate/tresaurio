// components/terminal/personalized-dashboard/CreateAlertModule.tsx
"use client";

import { useState } from "react";
import { useAlertStore } from "@/store/alertStore";
import { usePriceStore } from "@/store/priceStore";
import { Bell } from "lucide-react";

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

export default function CreateAlertModule() {
  const addAlert = useAlertStore((s) => s.addAlert);
  const prices = usePriceStore((s) => s.prices);

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [target, setTarget] = useState("");

  const currentPrice = prices[symbol] || 0;

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center gap-2 font-semibold text-white/90">
        <Bell className="w-4 h-4" />
        <span>Create Price Alert</span>
      </div>

      {/* 🔥 Current Price Display */}
      {currentPrice > 0 && (
        <div className="bg-white/5 border border-white/10 rounded p-2">
          <div className="flex justify-between items-center">
            <span className="text-white/50 text-[10px]">Current Price</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">
                ${currentPrice.toLocaleString()}
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* SYMBOL */}
      <div>
        <label className="block text-white/50 mb-1 text-[10px] font-semibold">
          Symbol
        </label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-xs outline-none"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* CONDITION */}
      <div>
        <label className="block text-white/50 mb-1 text-[10px] font-semibold">
          Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as any)}
          className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-xs outline-none"
        >
          <option value="above">Price Above</option>
          <option value="below">Price Below</option>
        </select>
      </div>

      {/* TARGET */}
      <div>
        <label className="block text-white/50 mb-1 text-[10px] font-semibold">
          Target Price
        </label>
        <input
          type="number"
          placeholder="Target price"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-xs outline-none"
        />
      </div>

      <button
        onClick={() => {
          if (!target) {
            alert("Please enter a target price");
            return;
          }
          addAlert({
            symbol,
            condition,
            target: Number(target),
          });
          setTarget("");
        }}
        className="w-full h-9 rounded-lg bg-teal-400/20 border border-teal-400/40 text-teal-300 hover:bg-teal-400/30 transition font-semibold"
      >
        Create Alert
      </button>
    </div>
  );
}
