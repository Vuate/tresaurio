"use client";

import { useState } from "react";
import { useAlertStore } from "@/store/alertStore";

export default function CreateAlertModule() {
  const addAlert = useAlertStore((s) => s.addAlert);

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [target, setTarget] = useState("");

  return (
    <div className="space-y-3 text-xs">
      <div className="font-semibold text-white/90">Create Price Alert</div>

      {/* SYMBOL */}
      <select
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3"
      >
        <option>BTCUSDT</option>
        <option>ETHUSDT</option>
        <option>SOLUSDT</option>
        <option>BNBUSDT</option>
      </select>

      {/* CONDITION */}
      <select
        value={condition}
        onChange={(e) => setCondition(e.target.value as any)}
        className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3"
      >
        <option value="above">Price Above</option>
        <option value="below">Price Below</option>
      </select>

      {/* TARGET */}
      <input
        type="number"
        placeholder="Target price"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3"
      />

      <button
        onClick={() => {
          if (!target) return;
          addAlert({
            symbol,
            condition,
            target: Number(target),
          });
          setTarget("");
        }}
        className="w-full h-9 rounded-lg bg-teal-400/20
          border border-teal-400/40 text-teal-300
          hover:bg-teal-400/30 transition"
      >
        Create Alert
      </button>
    </div>
  );
}
