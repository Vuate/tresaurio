"use client";

import { useEffect, useState } from "react";

export default function QuickStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/global");
      const data = await res.json();
      setStats(data.data);
      setLoading(false);
    } catch (err) {
      console.error("QuickStats API error:", err);
    }
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-[#0F121A] border border-white/10 p-6 rounded-2xl animate-pulse"
          >
            <div className="h-4 w-24 bg-white/10 rounded mb-3"></div>
            <div className="h-6 w-20 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const marketCap = stats.total_market_cap.usd;
  const volume = stats.total_volume.usd;
  const btcDominance = stats.market_cap_percentage.btc;
  const activeCoins = stats.active_cryptocurrencies;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 mt-[17px] ">
      <StatCard label="Toplam Piyasa Değeri" value={`$${formatNumber(marketCap)}`} />
      <StatCard label="24h İşlem Hacmi" value={`$${formatNumber(volume)}`} />
      <StatCard label="BTC Dominansı" value={`${btcDominance.toFixed(2)}%`} />
      <StatCard label="Aktif Kripto Sayısı" value={activeCoins} />
    </section>
  );
}
function StatCard({ label, value }: any) {
  return (
    <div
      className="
        relative p-6 rounded-3xl 
        bg-[#0C0F14]/80 border border-white/5 
        backdrop-blur-xl
        overflow-hidden
        shadow-[0_0_25px_-8px_rgba(0,0,0,0.6)]
      "
    >

      {/* SAĞ ÜST KÖŞE PREMIUM BLOB */}
      <div
        className="
          absolute -top-25 -right-25 w-40 h-40
          bg-gradient-to-br from-cyan-400/20 via-teal-500/10 to-transparent
          rounded-full blur-2xl
          pointer-events-none
        "
      />

      {/* İÇ PARLAKLIK (çok hafif) */}
      <div
        className="
          absolute inset-0 rounded-2xl
          ring-1 ring-white/5 
          pointer-events-none
        "
      />

      <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide relative z-10">
        {label}
      </p>

      <p className="text-4xl font-bold text-white tracking-tight relative z-10">
        {value}
      </p>
    </div>
  );
}





function formatNumber(num: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
}
