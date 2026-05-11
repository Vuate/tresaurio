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
      <div className="p-4 sm:p-5 md:p-6 xl:p-7 2xl:p-8 rounded-xl sm:rounded-2xl xl:rounded-[28px] 2xl:rounded-3xl bg-card border border-border-emphasis shadow-xl">
        <h3 className="text-base sm:text-lg xl:text-xl 2xl:text-2xl font-bold mb-3 sm:mb-4 xl:mb-5 2xl:mb-6">Top Movers</h3>
        <p className="text-gray-500 text-xs sm:text-sm xl:text-[15px] 2xl:text-base">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="
        relative 
        p-4 sm:p-5 md:p-6 xl:p-7 2xl:p-8
        rounded-xl sm:rounded-2xl xl:rounded-[28px] 2xl:rounded-3xl
        bg-background/95 border border-border-sub
        backdrop-blur-2xl overflow-hidden
        shadow-[0_0_45px_-8px_rgba(0,0,0,0.8)]
        transition-all duration-500
      "
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="
        absolute inset-0 opacity-[0.12]
        bg-[radial-gradient(circle_at_top_left,rgba(0,255,240,0.2),transparent_65%),
            radial-gradient(circle_at_bottom_right,rgba(150,70,255,0.2),transparent_65%)]
        blur-3xl pointer-events-none
      " />

      <h3 className="text-base sm:text-lg xl:text-xl 2xl:text-2xl font-semibold text-foreground mb-4 sm:mb-5 md:mb-6 xl:mb-7 2xl:mb-8 relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2.5 xl:gap-3">
        <span>Top Movers</span>
        <div className="
          px-2.5 sm:px-3 xl:px-3.5 2xl:px-4
          py-0.5 xl:py-1 2xl:py-1
          rounded-lg xl:rounded-xl 2xl:rounded-xl
          backdrop-blur-xl 
          bg-input
          border border-border
          text-foreground/90
          text-[10px] sm:text-xs xl:text-[13px] 2xl:text-sm
          font-medium
          shadow-[0_0_15px_rgba(255,255,255,0.15)]
        ">
          24H
        </div>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8 xl:gap-9 2xl:gap-10 relative z-10">
        <Section title="Top Gainers" color="green">
          {gainers.map((c, i) => (
            <Row key={i} coin={c} />
          ))}
        </Section>

        <Section title="Top Losers" color="red">
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
      <h4 className={`text-${color}-400 font-bold mb-2 sm:mb-2.5 md:mb-3 xl:mb-3.5 2xl:mb-4 tracking-wide text-xs sm:text-sm xl:text-[15px] 2xl:text-base`}>
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
        relative flex justify-between items-center 
        py-2.5 sm:py-3 xl:py-3.5 2xl:py-4
        px-2 sm:px-2.5 xl:px-3 2xl:px-3
        border-b border-border-sub
        group transition-all duration-300
        hover:bg-foreground/[0.035]
        hover:shadow-[0_0_16px_rgba(0,255,255,0.20)]
        hover:scale-[1.015]
        rounded-lg xl:rounded-xl 2xl:rounded-xl
        overflow-hidden
      "
    >
      <div
        className="
          absolute inset-0 
          bg-gradient-to-r from-foreground/0 via-foreground/5 to-foreground/0
          opacity-0 group-hover:opacity-100
          -translate-x-[120%] group-hover:translate-x-[120%]
          transition-all duration-700
        "
      />

      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 xl:gap-3.5 2xl:gap-4 relative z-10">
        <img
          src={coin.image}
          alt={coin.name}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 rounded-lg xl:rounded-xl object-cover flex-shrink-0"
        />

        <span className="font-medium text-foreground text-xs sm:text-sm xl:text-[15px] 2xl:text-base tracking-wide">
          {coin.name}
        </span>
      </div>

      <span
        className={`
          relative z-10 
          text-[10px] sm:text-xs xl:text-[13px] 2xl:text-sm
          font-semibold 
          px-2 sm:px-2.5 md:px-3 xl:px-3.5 2xl:px-3.5
          py-0.5 sm:py-1 xl:py-1.5 2xl:py-1.5
          rounded-full
          backdrop-blur-xl border shadow-[0_0_10px_rgba(0,0,0,0.3)]
          transition-all duration-300
          whitespace-nowrap
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