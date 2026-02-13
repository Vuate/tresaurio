"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/landing/globe/Globe"), {
  ssr: false,
});

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-EN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative mb-10 xl:mb-11 2xl:mb-12">
      {/* AURA */}
      <div
        className="absolute inset-0 -top-6 blur-3xl opacity-[0.15]
        bg-[radial-gradient(circle_at_30%_20%,rgba(0,180,255,0.35),transparent_60%),radial-gradient(circle_at_80%_50%,rgba(120,60,255,0.35),transparent_60%)]
      "
      />

      <div className="flex justify-between items-end relative z-10">
        <div className="space-y-1.5 xl:space-y-2">
<h1
  className="text-6xl xl:text-7xl 2xl:text-8xl font-extrabold bg-gradient-to-r from-white via-[#19D8D0] to-[#238c7c]
    bg-clip-text text-transparent translate-y-24 xl:translate-y-28 2xl:translate-y-32"
>
  Treasurio
</h1>

          <p className="text-gray-400 text-xs xl:text-sm 2xl:text-[15px] translate-y-[118px] xl:translate-y-[126px] 2xl:translate-y-[134px]">
           Institutional Market Depth • Liquidity • Risk • Data Analytics
          </p>

          <div className="w-40 xl:w-44 2xl:w-48 h-[2.5px] xl:h-[3px] bg-gradient-to-r from-cyan-400/40 to-purple-500/40 rounded-full translate-y-[118px] xl:translate-y-[126px] 2xl:translate-y-[134px]"></div>
        </div>
        <div className="flex items-center gap-6 xl:gap-7 2xl:gap-8">
<div className="relative w-[220px] xl:w-[250px] 2xl:w-[280px] h-[95px] xl:h-[110px] 2xl:h-[125px] scale-[.42] xl:scale-[.47] 2xl:scale-[.52] opacity-40 pointer-events-none -ml-[420px] xl:-ml-[440px] 2xl:-ml-[460px]">
  <Globe />
</div>
        </div>
      </div>
    </header>
  );
}