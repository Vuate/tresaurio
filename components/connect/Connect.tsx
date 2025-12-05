"use client";

import { useEffect, useState } from "react";

export default function Connect() {
  const items = [
    "coinbase",
    "BloFin",
    "BitMEX",
    "Bitget",
    "BingX",
    "BINANCE",
    "APEX",
    "grvt",
    "PARADEX",
    "MODE",
    "Kodiaq",
    "what.exchange",
    "ASTER",
    "ARKHAM",
    "kraken",
    "PHEMEX",
    "WOOX",
    "BYBIT",
    "bitrue",
    "Bitunix",
  ];

  const [active, setActive] = useState(0);

  // Yazıların sırayla gidip gelmesi
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 900); // her 0.9 saniyede bir sonraki yazı
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-32 bg-[#032b2a]">
      {/* Title */}
      <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-16">
        Connect with <span className="text-teal-400">Everything</span>
      </h2>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
        {items.map((name, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-20 rounded-xl 
              border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <span
              className={`
                text-gray-300 text-lg
                ${
                  active === i
                    ? "animate-[pulseText_1.2s_ease-in-out]"
                    : "opacity-40"
                }
              `}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
