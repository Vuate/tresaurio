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

      const topGainers = [...data]
        .filter((c) => c.price_change_percentage_24h !== null)
        .sort(
          (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
        )
        .slice(0, 5);

      const topLosers = [...data]
        .filter((c) => c.price_change_percentage_24h !== null)
        .sort(
          (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
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
    const interval = setInterval(fetchMovers, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 rounded-2xl bg-[#0E121A] border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold mb-6">En Çok Hareket Edenler</h3>
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div
      className="
      relative p-8 rounded-3xl 
      bg-[#05070A]/95 border border-white/5 
      backdrop-blur-2xl overflow-hidden
      shadow-[0_0_45px_-8px_rgba(0,0,0,0.8)]
      transition-all duration-500
    "
    >
      {/* Köşelerde soft glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* İç Holografik Texture */}
      <div className="
        absolute inset-0 opacity-[0.12]
        bg-[radial-gradient(circle_at_top_left,rgba(0,255,240,0.2),transparent_65%),
            radial-gradient(circle_at_bottom_right,rgba(150,70,255,0.2),transparent_65%)]
        blur-3xl pointer-events-none
      " />

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-8 relative z-10 flex items-center gap-3">
        En Çok Hareket Edenler 
<div className="
  px-4 py-1 rounded-xl 
  backdrop-blur-xl 
  bg-white/5 
  border border-white/10 
  text-white/90 
  text-sm font-medium
  shadow-[0_0_15px_rgba(255,255,255,0.15)]
">
  24H
</div>


        
        
      </h3>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        
        <Section title="En Çok Artanlar" color="green">
          {gainers.map((c, i) => (
            <Row key={i} coin={c} />
          ))}
        </Section>

        <Section title="En Çok Düşenler" color="red">
          {losers.map((c, i) => (
            <Row key={i} coin={c} loser />
          ))}
        </Section>

      </div>
    </div>
  );
}

function Section({ title, color, children }: any) {
  return (
    <div className="relative z-10">
      <h4 className={`text-${color}-400 font-bold mb-4 tracking-wide`}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function Row({ coin, loser }: any) {
  const percentage = coin.price_change_percentage_24h;

  return (
    <div
      className="
      relative flex justify-between items-center py-4 px-3
      border-b border-white/5 
      group transition-all duration-300
      hover:bg-white/[0.035]
      hover:shadow-[0_0_16px_rgba(0,255,255,0.20)]
      hover:scale-[1.015]
      rounded-xl overflow-hidden
    "
    >
      {/* Shine */}
      <div
        className="
        absolute inset-0 
        bg-gradient-to-r from-white/0 via-white/5 to-white/0
        opacity-0 group-hover:opacity-100
        -translate-x-[120%] group-hover:translate-x-[120%]
        transition-all duration-700
      "
      />

      <div className="flex items-center gap-4 relative z-10">
        
        {/* ICON — kutu kaldırıldı */}
        <img
          src={coin.image}
          alt={coin.name}
          className="w-11 h-11 rounded-xl object-cover"
        />

        <span className="font-medium text-white text-base tracking-wide">
          {coin.name}
        </span>
      </div>

      {/* Yüzdelik */}
      <span
        className={`
          relative z-10 text-sm font-semibold px-3.5 py-1.5 rounded-full
          backdrop-blur-xl border shadow-[0_0_10px_rgba(0,0,0,0.3)]
          transition-all duration-300
          ${loser 
            ? "text-red-400 border-red-500/20 bg-gradient-to-r from-red-600/25 to-red-500/10"
            : "text-green-400 border-green-500/20 bg-gradient-to-r from-green-600/25 to-green-500/10"
          }
        `}
      >
        {percentage.toFixed(2)}%
      </span>
    </div>
  );
}
