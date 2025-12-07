"use client";

import { useEffect, useState } from "react";

export default function Movers() {
  const [gainers, setGainers] = useState<any[]>([]);
  const [losers, setLosers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMovers() {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200"
      );

      const data = await res.json();

      // Sıralama: en çok artanlar
      const topGainers = [...data]
        .filter((c) => c.price_change_percentage_24h !== null)
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        )
        .slice(0, 5);

      // Sıralama: en çok düşenler
      const topLosers = [...data]
        .filter((c) => c.price_change_percentage_24h !== null)
        .sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h
        )
        .slice(0, 5);

      setGainers(topGainers);
      setLosers(topLosers);
      setLoading(false);
    } catch (err) {
      console.error("Movers API error:", err);
    }
  }

  useEffect(() => {
    fetchMovers();
    const interval = setInterval(fetchMovers, 60000); // her 1 dakikada güncelle
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#13141a] border border-white/10 p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">En Çok Hareket Edenler</h3>
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#13141a] border border-white/10 p-8 rounded-2xl">
      <h3 className="text-xl font-bold mb-6">En Çok Hareket Edenler (24h)</h3>

      {/* Gainers */}
      <h4 className="text-green-400 font-semibold mb-2">En Çok Artanlar</h4>
      {gainers.map((coin, i) => (
        <Row key={i} coin={coin} />
      ))}

      {/* Losers */}
      <h4 className="text-red-400 font-semibold mt-6 mb-2">En Çok Düşenler</h4>
      {losers.map((coin, i) => (
        <Row key={i} coin={coin} loser />
      ))}
    </div>
  );
}

function Row({ coin, loser }: any) {
  return (
    <div className="flex justify-between border-b border-white/5 py-3">
      <span className="font-medium">{coin.name}</span>

      <span
        className={
          (loser ? "text-red-400" : "text-green-400") + " font-semibold"
        }
      >
        {coin.price_change_percentage_24h.toFixed(2)}%
      </span>
    </div>
  );
}
