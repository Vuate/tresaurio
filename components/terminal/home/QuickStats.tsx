"use client";

import React, { useEffect, useState } from "react";

type ProxyResponse<T> =
  | { success: true; data: T }
  | { success: false; error?: string };

// CoinGecko /global response (biz sadece kullandığımız alanları tipliyoruz)
type CoinGeckoGlobal = {
  data: {
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    markets: number;
  };
};

export default function QuickStats() {
  const [loading, setLoading] = useState(true);
  const [global, setGlobal] = useState<CoinGeckoGlobal | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        // ✅ TASK GEREĞİ: dış API yerine proxy route kullanıyoruz (CORS yok)
        const res = await fetch("/api/v2/coingecko/global", {
          cache: "no-store",
        });

        // ekstra güvenlik (API hata dönerse)
        if (!res.ok) {
          console.error("QuickStats fetch failed:", res.status);
          return;
        }

        const json = (await res.json()) as ProxyResponse<CoinGeckoGlobal>;

        if (!json.success) {
          console.error("Proxy error:", json.error);
          return;
        }

        if (alive) {
          setGlobal(json.data); // proxy formatı: { success, data }
          setLoading(false);
        }
      } catch (error) {
        console.error("QuickStats error:", error);
      }
    }

    load();
    const interval = setInterval(load, 60_000); // 1 dk refresh

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || !global) {
    return <div className="text-gray-400">Loading...</div>;
  }

  const usdMcap = global.data.total_market_cap?.usd ?? 0;
  const usdVol = global.data.total_volume?.usd ?? 0;
  const change24h =
    global.data.market_cap_change_percentage_24h_usd ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-white/10 p-4">
        <div className="text-gray-400 text-xs">Total Market Cap</div>
        <div className="text-white font-bold text-lg">
          ${usdMcap.toLocaleString()}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 p-4">
        <div className="text-gray-400 text-xs">Total Volume (24h)</div>
        <div className="text-white font-bold text-lg">
          ${usdVol.toLocaleString()}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 p-4">
        <div className="text-gray-400 text-xs">Market Cap Change (24h)</div>
        <div
          className={`font-bold text-lg ${
            change24h >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {change24h >= 0 ? "+" : ""}
          {change24h.toFixed(2)}%
        </div>
      </div>

      <div className="rounded-xl border border-white/10 p-4">
        <div className="text-gray-400 text-xs">
          Active Cryptos / Markets
        </div>
        <div className="text-white font-bold text-lg">
          {global.data.active_cryptocurrencies} / {global.data.markets}
        </div>
      </div>
    </div>
  );
}
