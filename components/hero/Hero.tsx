"use client";

import { Button } from "@/components/ui/button";
import Globe from "@/components/globe/Globe";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Tittle */}
      <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight z-10 drop-shadow-lg">
        Manage your treasury anywhere
        <br />
        with{" "}
        <span
          className="
            bg-gradient-to-r from-teal-300 to-teal-500 
            bg-clip-text text-transparent 
            drop-shadow-[0_0_18px_rgba(0,255,200,0.35)]
          "
        >
          Treasurio
        </span>
      </h1>

      <p className="mt-4 max-w-xl text-gray-300 z-10 text-lg leading-relaxed">
        A high-performance trading terminal that doesn’t slow you down.
      </p>

      <div className="mt-8 flex gap-4 z-10">
        {/* LEARN HOW TO TRADE */}
        <Button
          className="
    px-6 py-3 rounded-2xl font-semibold text-white
    border border-white/30 bg-white/5
    hover:border-teal-300 hover:text-teal-200
    transition-all duration-300
    cursor-pointer
    overflow-hidden
  "
        >
          START TRADING FOR FREE
        </Button>

        {/* START TRADING FOR FREE */}
        <Button
          className="
            relative px-8 py-3 rounded-2xl font-semibold text-white
            bg-white/5 border border-white/20 backdrop-blur-xl
            overflow-hidden transition-all duration-300
            hover:bg-white/10 hover:border-teal-300
            cursor-pointer
          "
        >
          <span className="relative z-10">LEARN HOW TO TRADE</span>

          {/* Reflection line */}
          <div
            className="
              absolute top-0 left-[-150%] w-[200%] h-full
              bg-gradient-to-r from-transparent via-white/40 to-transparent
              opacity-40
              transition-all duration-700
              group-hover:left-[150%]
            "
          ></div>
        </Button>
      </div>

      {/* Yazılar ile globe arasına boşluk */}
      <div className="h-[130px] z-10" />

      {/* Globe Animation */}
      <div className="absolute bottom-[-260px] left-1/2 -translate-x-1/2 z-0 scale-[0.9] opacity-90">
        <Globe />
      </div>

      {/* Alt Gradient */}
      <div className="absolute bottom-[-40px] w-full h-[220px] bg-gradient-to-b from-transparent/0 to-[#06302f]/100" />
    </section>
  );
}
