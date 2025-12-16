"use client";

import { useState, useEffect } from "react";

const partners = [
  ["coinbase", "BINANCE", "BloFin", "BitMEX", "Bitget", "BingX", "PARADEX"],
  ["grvt", "MODE", "CENTER", "Kodiaq", "ASTER", "ARKHAM", "kraken"],
  ["PHEMEX", "WOOX", "WOOFi", "OKX", "Hyperliquid", "CoinCatch", "BYBIT"],
];

export default function ConnectBoxed() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatList = partners.flat();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % flatList.length);
    }, 550);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-20 -mt-20 bg-[#000F0F]">
      {/* Title */}
      <h2 className="text-center text-6xl font-extrabold text-white mb-8">
        Connect with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#19D8D0] to-[#238c7c]">
          Everything
        </span>
      </h2>

      {/* Alt çizgi */}
      <div className="w-full flex justify-center mb-20">
        <div className="w-[55%] h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-4 px-4 w-full">
        {flatList.map((name, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className={`
                h-24 rounded-xl flex items-center justify-center
                relative cursor-pointer overflow-hidden
                transition-all duration-500

                /* İç gradient + cam efekti */
                bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),rgba(0,0,0,0.2))]
                backdrop-blur-[2px]

                /* 3D iç gölge */
                shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-3px_10px_rgba(0,0,0,0.5),0_6px_20px_rgba(0,0,0,0.4)]

                ${
                  isActive
                    ? "scale-[1.05] shadow-[0_0_20px_rgba(25,216,208,0.7)] bg-[#0f2f2f]"
                    : "opacity-70"
                }

                hover:scale-[1.04] hover:shadow-[0_0_18px_rgba(25,216,208,0.3)]
              `}
            >
              {/* İç parlama vinyet efekti */}
              <div
                className={`
                  absolute inset-0 rounded-xl pointer-events-none
                  bg-[radial-gradient(circle_at_center,rgba(25,216,208,0.12),transparent)]
                  opacity-${isActive ? "70" : "20"}
                  transition-all duration-500
                `}
              />

              {/* Üst highlight çizgisi */}
              <div
                className={`
                  absolute top-0 left-0 w-full h-[2px]
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  opacity-${isActive ? "70" : "30"}
                `}
              />

              <span
                className={`text-xl font-semibold tracking-wide transition-all duration-300 z-10
                  ${isActive ? "text-teal-300" : "text-gray-400"}
                `}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
