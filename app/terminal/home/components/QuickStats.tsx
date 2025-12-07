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
    const interval = setInterval(fetchStats, 60000); // 1 dk'da bir güncelle
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-[#13141a] border border-white/10 p-6 rounded-xl animate-pulse"
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
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <StatCard
        label="Toplam Piyasa Değeri"
        value={`$${formatNumber(marketCap)}`}
        trend=""
      />
      <StatCard
        label="24h İşlem Hacmi"
        value={`$${formatNumber(volume)}`}
        trend=""
      />
      <StatCard label="BTC Dominansı" value={`${btcDominance.toFixed(2)}%`} />
      <StatCard label="Aktif Kripto Sayısı" value={activeCoins} />
    </section>
  );
}

function StatCard({ label, value, trend }: any) {
  return (
    <div className="bg-[#13141a] border border-white/10 p-6 rounded-xl">
      <p className="text-gray-500 text-sm mb-1 uppercase">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {trend && <p className="text-gray-400 text-sm">{trend}</p>}
    </div>
  );
}

function formatNumber(num: number) {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
}
