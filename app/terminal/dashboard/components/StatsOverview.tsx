"use client";

import { useEffect, useState } from "react";

export default function StatsOverview() {
  const [stats, setStats] = useState<any>(null);

  async function fetchStats() {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/global");
      const data = await res.json();
      setStats(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
      rounded-2xl 
      border border-white/10 
      bg-slate-900/80 
      p-4 
      text-xs 
      shadow-[0_20px_40px_rgba(0,0,0,0.35)]
    "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold flex items-center gap-1">
          <span>📈</span> Piyasa Özeti
        </h3>
        <span className="text-[10px] text-slate-500">24s</span>
      </div>

      {/* CONTENT GRID */}
      <div className="space-y-3">
        {/* GLOBAL MARKET CAP */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.18em]">
            Global Market Cap
          </div>

          <div className="font-mono text-lg font-bold">
            {stats
              ? `$${(stats.total_market_cap.usd / 1e12).toFixed(2)}T`
              : "..."}
          </div>

          <div className="text-[11px] text-emerald-400">+1.8%</div>
        </div>

        {/* VOLUME 24H */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.18em]">
            24h Volume
          </div>

          <div className="font-mono text-lg font-bold">
            {stats ? `$${(stats.total_volume.usd / 1e9).toFixed(2)}B` : "..."}
          </div>
        </div>

        {/* BTC DOMINANCE */}
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-[0.18em]">
            BTC.D
          </div>

          <div className="font-mono text-lg font-bold">
            {stats ? `${stats.market_cap_percentage.btc.toFixed(2)}%` : "..."}
          </div>
        </div>
      </div>
    </div>
  );
}
