"use client";

import { useEffect, useState } from "react";

export default function SystemStatus() {
  const [status, setStatus] = useState<any>({
    latency: null,
    coverage: "99.8%",
    api: null,
    stable: true,
  });

  useEffect(() => {
    async function check() {
      try {
        const start = performance.now();

        // 3 borsa ping
        const [binance, okx, coinbase] = await Promise.all([
          fetch("https://api.binance.com/api/v3/ping"),
          fetch("https://www.okx.com/api/v5/public/time"),
          fetch("https://api.exchange.coinbase.com/time"),
        ]);

        const latency = Math.round(performance.now() - start);
        const apiStatus =
          binance.ok && okx.ok && coinbase.ok ? "Online" : "Unstable";

        setStatus({
          latency,
          api: apiStatus,
          coverage: "99.8%",
          stable: apiStatus === "Online",
        });
      } catch (e) {
        setStatus({
          latency: null,
          api: "Offline",
          coverage: "0%",
          stable: false,
        });
      }
    }

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span>⚙️</span> Sistem Durumu
        </h3>

        <span
          className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${
            status.stable
              ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/40"
              : "bg-rose-400/10 text-rose-300 border-rose-400/40"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              status.stable ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
          {status.stable ? "Stable" : "Unstable"}
        </span>
      </div>

      {/* CONTENT */}
      <div className="space-y-3 text-[11px]">
        <Row
          label="Veri Gecikmesi"
          value={status.latency ? `${status.latency} ms` : "—"}
        />
        <Row label="Kapsama" value={status.coverage} />
        <Row label="API Durumu" value={status.api ?? "—"} />
      </div>
    </div>
  );
}

/* --- Row Component --- */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-mono text-emerald-300">{value}</span>
    </div>
  );
}
