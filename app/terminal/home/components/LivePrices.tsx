"use client";

import { useEffect, useState } from "react";

export default function LivePrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hangi coinleri göstereceğiz
  const symbols = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "USDTUSDT",
  ];

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        const all = await res.json();

        const filtered = all.filter((item: any) =>
          symbols.includes(item.symbol)
        );
        setPrices(filtered);
        setLoading(false);
      } catch (err) {
        console.error("API Hatası:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-gray-400 text-lg py-10">Yükleniyor...</div>;
  }

  return (
    <section className="bg-[#13141a] border border-white/10 rounded-3xl p-10">
      <div className="flex justify-between mb-10">
        <h2 className="text-2xl font-semibold">Canlı Piyasa Fiyatları</h2>
        <span className="text-green-400">LIVE ●</span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prices.map((p) => (
          <div
            key={p.symbol}
            className="bg-white/5 border border-white/10 p-5 rounded-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold">{p.symbol.replace("USDT", "")}</p>
                <span className="text-gray-500 text-sm">{p.symbol}</span>
              </div>

              <span
                className={`px-3 py-1 rounded-md text-sm font-bold ${
                  Number(p.priceChangePercent) >= 0
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {Number(p.priceChangePercent).toFixed(2)}%
              </span>
            </div>

            <p className="text-3xl font-bold">
              ${Number(p.lastPrice).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
