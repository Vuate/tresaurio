// components/terminal/personalized-dashboard/RiskCalculatorModule.tsx
"use client";

import { useMemo, useState } from "react";
import { useAlertStore } from "@/store/alertStore";
import { usePriceStore } from "@/store/priceStore";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

export default function RiskCalculatorModule() {
  // 🔥 PRICESTORE'DAN REAL-TIME PRICE
  const prices = usePriceStore((s) => s.prices);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");

  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPercent, setStopPercent] = useState(2); // Stop loss % from current price

  const addAlert = useAlertStore((s) => s.addAlert);

  // 🔥 Real-time current price
  const currentPrice = prices[selectedSymbol] || 0;
  const stopLoss = currentPrice * (1 - stopPercent / 100);

  const calc = useMemo(() => {
    const riskAmount = (account * riskPct) / 100;
    const stopDistance = currentPrice - stopLoss;

    if (stopDistance <= 0 || currentPrice === 0) return null;

    const positionSize = riskAmount / stopDistance;
    const positionValue = positionSize * currentPrice;

    return {
      riskAmount,
      stopDistance,
      positionSize,
      positionValue,
      stopLoss,
    };
  }, [account, riskPct, currentPrice, stopLoss]);

  return (
    <div className="space-y-3 text-xs">
      {/* 🔥 Symbol Selector */}
      <div>
        <label className="block text-white/50 mb-1 text-[10px] font-semibold">
          Symbol
        </label>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-xs outline-none"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 Current Price (Real-time) */}
      <div className="bg-white/5 border border-white/10 rounded p-2">
        <div className="flex justify-between items-center">
          <span className="text-white/50 text-[10px]">
            Current Price (Live)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">
              ${currentPrice.toLocaleString()}
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* INPUTS */}
      <Field label="Account Size ($)" value={account} onChange={setAccount} />
      <Field label="Risk (%)" value={riskPct} onChange={setRiskPct} />
      <Field
        label="Stop Loss (%)"
        value={stopPercent}
        onChange={setStopPercent}
      />

      {/* RESULT */}
      {calc && (
        <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <Row label="Entry Price">
            <span className="text-white/80">
              ${currentPrice.toLocaleString()}
            </span>
          </Row>

          <Row label="Stop Loss Price">
            <span className="text-red-400 font-semibold">
              ${calc.stopLoss.toFixed(2)}
            </span>
          </Row>

          <Row label="Risk Amount">
            <span className="text-red-400 font-semibold">
              -${calc.riskAmount.toFixed(2)}
            </span>
          </Row>

          <Row label="Stop Distance">
            <span className="text-white/80">
              ${calc.stopDistance.toFixed(2)}
            </span>
          </Row>

          <Row label="Position Size">
            <span className="text-emerald-400 font-semibold">
              {calc.positionSize.toFixed(4)}{" "}
              {selectedSymbol.replace("USDT", "")}
            </span>
          </Row>

          <Row label="Position Value">
            <span className="text-white/80">
              ${calc.positionValue.toFixed(2)}
            </span>
          </Row>

          {/* 🔥 CREATE ALERT */}
          <button
            onClick={() =>
              addAlert({
                symbol: selectedSymbol,
                condition: "below",
                target: calc.stopLoss,
              })
            }
            className="w-full h-9 rounded-lg
              bg-red-500/10 border border-red-400/40
              text-red-300 font-semibold
              hover:bg-red-500/20 transition"
          >
            🚨 Create Stop-Loss Alert
          </button>
        </div>
      )}

      {currentPrice === 0 && (
        <div className="text-center text-white/40 py-4 text-[10px]">
          Waiting for price data...
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-white/50 text-[10px]">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-9 rounded-lg bg-white/5 border border-white/10 px-3 text-white text-xs outline-none"
      />
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      {children}
    </div>
  );
}
