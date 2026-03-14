"use client";

import CryptoTicker from "./CryptoTicker";
import Globe from "../globe/Globe";

export default function Hero() {
  return (
    <section
      className="
       relative flex min-h-[120vh] 2xl:min-h-[112vh] flex-col items-center
        overflow-hidden bg-[#031a1c] px-6 text-center text-white
      "
    >
      <div
        className="
          relative z-[5] mt-[140px]
          min-[1280px]:pr-10
          min-[1536px]:pr-0
        "
      >
        <h1 className="text-3xl lg:text-4xl xl:text-[4rem] font-black leading-tight">
          Manage your treasury anywhere <br />
         with <span className="text-[#1A73E8]/65">
             Treasurio
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-[520px] text-[19px] text-slate-300">
          A high-performance terminal that doesn&apos;t slow you down.
        </p>

        <CryptoTicker />
      </div>

      {/* GLOBE */}
      <div
        className="
          pointer-events-none absolute 
          bottom-[-280px] lg:bottom-[-320px] xl:bottom-[-350px] 2xl:bottom-[-400px]
          left-1/2 z-[1] -translate-x-1/2
        "
      >
        <Globe />
      </div>
    </section>
  );
}