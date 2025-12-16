"use client";

import { useEffect, useState } from "react";

interface MarketRow {
  exchange: string;
  asset: string;
  liquidity: string;
  depth: string;
  status: "healthy" | "warning" | "critical";
}

export default function LiquidityTable() {
  const [rows, setRows] = useState<MarketRow[]>([]);

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await fetch("/api/markets");
        const json = await res.json();
        setRows(json);
      } catch (err) {
        console.error("Market fetch error:", err);
      }
    }

    fetchMarkets();
    const timer = setInterval(fetchMarkets, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-xs">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span>💧</span> Watchlist Likidite Durumu
        </h3>

        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-xs">
            +
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-xs">
            ⋯
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-slate-500 border-b border-white/10">
            <th className="py-2 text-left">Varlık</th>
            <th className="py-2 text-left">Borsa</th>
            <th className="py-2 text-left">Likidite</th>
            <th className="py-2 text-left">Derinlik</th>
            <th className="py-2 text-left">Durum</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              <td className="py-2 font-mono text-xs">{row.asset}</td>
              <td className="py-2 text-slate-300">{row.exchange}</td>
              <td className="py-2 font-mono">{row.liquidity}</td>
              <td className="py-2 font-mono">{row.depth}</td>
              <td className="py-2">
                <span
                  className={
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.14em] " +
                    (row.status === "healthy"
                      ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/40"
                      : row.status === "warning"
                      ? "bg-amber-400/10 text-amber-300 border border-amber-400/40"
                      : "bg-rose-400/10 text-rose-300 border border-rose-400/40")
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
                  {row.status === "healthy"
                    ? "SAĞLIKLI"
                    : row.status === "warning"
                    ? "DİKKAT"
                    : "DÜŞÜK"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
