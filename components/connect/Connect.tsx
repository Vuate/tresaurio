"use client";

import { useState, useEffect } from "react";

const Logo = ({ name }: { name: string }) => {
  return (
    <div className="opacity-60 group-hover:opacity-100 transition-all">
      <span className="text-[#7AF8FF] font-semibold tracking-wide text-lg">
        {name}
      </span>
    </div>
  );
};

const items = [
  "coinbase",
  "BloFin",
  "BitMEX",
  "Bitget",
  "BingX",

  "grvt",
  "PARADEX",
  "MODE",
  "CENTER",
  "Kodiaq",

  "ASTER",
  "ARKHAM",
  "kraken",
  "PHEMEX",
  "WOOX",

  "WOOFi",
  "OKX",
  "Hyperliquid",
  "CoinCatch",
  "BYBIT",
];

export default function Connect() {
  const [active, setActive] = useState(9);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="w-full py-32 bg-[#000F0F]">
      {/* TITLE */}
      <h2 className="text-center text-6xl font-extrabold text-white mb-20">
        Connect with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#33E6C8] via-[#19D8D0] to-[#00CFEA]">
          Everything
        </span>
      </h2>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6">
        {items.map((name, i) => {
          const isActive = active === i;

          return (
            <div
              key={i}
              className={`
                group relative flex items-center justify-center
                h-32 rounded-xl overflow-hidden
                bg-[#021819]/40 
                border border-[#0C2C29]/40
                backdrop-blur-[2px]
                transition-all duration-300 select-none
                cursor-pointer
              `}
            >
              {/* CYBER GLOW BEHIND CARD */}
              {isActive && (
                <div
                  className="
                  absolute inset-0 
                  bg-[radial-gradient(circle_at_center,rgba(0,255,213,0.35),transparent_70%)]
                  animate-pulse
                "
                />
              )}

              {/* CYBER GRID LINES */}
              <div
                className="
                absolute inset-0 pointer-events-none opacity-20
                bg-[linear-gradient(#00F5FF33_1px,transparent_1px),linear-gradient(90deg,#00F5FF33_1px,transparent_1px)]
                bg-[size:24px_24px]
              "
              />

              {/* INNER NEON BORDER ON ACTIVE */}
              {isActive && (
                <div
                  className="
                  absolute inset-0 rounded-xl 
                  border border-[#00FFD5]/60 
                  shadow-[0_0_40px_#00FFD580]
                "
                />
              )}

              {/* LOGO */}
              <Logo name={name === "CENTER" ? "≣" : name} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
