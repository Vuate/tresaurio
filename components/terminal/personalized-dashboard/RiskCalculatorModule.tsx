"use client";

import { useMemo, useState } from "react";
import { useAlertStore } from "@/store/alertStore";

export default function RiskCalculatorModule() {
  const [account, setAccount] = useState(10000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(42000);
  const [stop, setStop] = useState(41000);

  const addAlert = useAlertStore((s) => s.addAlert);

  const calc = useMemo(() => {
    const riskAmount = (account * riskPct) / 100;
    const stopDistance = Math.abs(entry - stop);

    if (stopDistance <= 0) return null;

    const positionSize = riskAmount / stopDistance;

    return {
      riskAmount,
      stopDistance,
      positionSize,
    };
  }, [account, riskPct, entry, stop]);

  return (
    <div className="space-y-3 text-xs">
      {/* INPUTS */}
      <Field label="Account Size ($)" value={account} onChange={setAccount} />
      <Field label="Risk (%)" value={riskPct} onChange={setRiskPct} />
      <Field label="Entry Price" value={entry} onChange={setEntry} />
      <Field label="Stop Loss" value={stop} onChange={setStop} />

      {/* RESULT */}
      {calc && (
        <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
          <Row label="Risk Amount">
            <span className="text-red-400 font-semibold">
              -${calc.riskAmount.toFixed(2)}
            </span>
          </Row>

          <Row label="Stop Distance">
            <span className="text-white/80">
              {calc.stopDistance.toFixed(2)}
            </span>
          </Row>

          <Row label="Position Size">
            <span className="text-emerald-400 font-semibold">
              {calc.positionSize.toFixed(4)} qty
            </span>
          </Row>

          {/* CREATE ALERT */}
          <button
            onClick={() =>
              addAlert({
                symbol: "BTCUSDT", // şimdilik sabit
                condition: "below",
                target: stop,
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
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

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
      <label className="text-white/50">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-9 rounded-lg bg-[#031A1C]
          border border-white/10 px-3 text-white outline-none"
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
