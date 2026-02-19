"use client";

import { useEffect, useState } from "react";

type ProxyResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

type CoinGeckoGlobal = {
  data: {
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    active_cryptocurrencies: number;
  };
};

export default function QuickStats() {
  const [stats, setStats] = useState<CoinGeckoGlobal["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      const res = await fetch("/api/v2/coingecko/global", { cache: "no-store" });
      const json = (await res.json()) as ProxyResponse<CoinGeckoGlobal>;
      if (json.success) {
        setStats(json.data.data);
        setLoading(false);
      }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-4.5 2xl:gap-5 mb-10 xl:mb-11 2xl:mb-12">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-[#0F121A] border border-white/10 p-5 xl:p-5.5 2xl:p-6 rounded-2xl xl:rounded-[28px] 2xl:rounded-3xl animate-pulse"
          >
            <div className="h-3.5 xl:h-4 w-20 xl:w-22 2xl:w-24 bg-white/10 rounded mb-2.5 xl:mb-3"></div>
            <div className="h-5 xl:h-5.5 2xl:h-6 w-16 xl:w-18 2xl:w-20 bg-white/20 rounded"></div>
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
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-4.5 2xl:gap-5 mb-10 xl:mb-11 2xl:mb-12 mt-3 xl:mt-4">
      <StatCard label="Total Market Cap" value={`$${formatNumber(marketCap)}`} />
      <StatCard label="24h Trading Volume" value={`$${formatNumber(volume)}`} />
      <StatCard label="BTC Dominance" value={`${btcDominance.toFixed(2)}%`} />
      <StatCard label="Active Cryptocurrencies" value={activeCoins} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="
        relative
        p-5 xl:p-5.5 2xl:p-6
        rounded-2xl xl:rounded-[28px] 2xl:rounded-3xl
        bg-[#0C0F14]/80 border border-white/5
        backdrop-blur-xl
        overflow-hidden
        shadow-[0_0_25px_-8px_rgba(0,0,0,0.6)]
      "
    >
      {/* BLOB */}
      <div
        className="
          absolute -top-20 xl:-top-22 2xl:-top-25
          -right-20 xl:-right-22 2xl:-right-25
          w-36 h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44
          bg-gradient-to-br from-cyan-400/20 via-teal-500/10 to-transparent
          rounded-full blur-2xl
          pointer-events-none
        "
      />

      {/* RING */}
      <div
        className="
          absolute inset-0 rounded-2xl xl:rounded-[28px] 2xl:rounded-3xl
          ring-1 ring-white/5
          pointer-events-none
        "
      />

      <p className="text-gray-400 text-[11px] xl:text-xs 2xl:text-xs mb-0.5 xl:mb-1 uppercase tracking-wide relative z-10">
        {label}
      </p>

      <p className="text-3xl xl:text-4xl 2xl:text-4xl font-bold text-white tracking-tight relative z-10">
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
