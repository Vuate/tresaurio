"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/globe/Globe"), {
  ssr: false,
});

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("tr-TR", {
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
    <header className="relative mb-12">

      {/* AURA */}
      <div className="absolute inset-0 -top-6 blur-3xl opacity-[0.15]
        bg-[radial-gradient(circle_at_30%_20%,rgba(0,180,255,0.35),transparent_60%),radial-gradient(circle_at_80%_50%,rgba(120,60,255,0.35),transparent_60%)]
      " />

      <div className="flex justify-between items-end relative z-10">

        {/* SOL TARAF */}
        <div className="space-y-2">
  <h1 className=" text-8xl font-extrabold bg-gradient-to-r from-white via-[#19D8D0] to-[#238c7c]
    bg-clip-text text-transparent translate-y-20">
  Treasurio
  </h1>


          <p className="text-gray-400 text-sm translate-y-23">
            Kurumsal Piyasa Derinliği • Likidite • Risk • Veri Analitiği
          </p>

          <div className="w-48 h-[3px] bg-gradient-to-r from-cyan-400/40 to-purple-500/40 rounded-full translate-y-23"></div>
        </div>

        {/* SAĞ TARAF — UPDATE + GLOBE */}
        <div className="flex items-center gap-8">

   
          {/* 🔥 HEADER MINI GLOBE */}
          <div className="relative w-[430px] h-[190px] scale-[.65] opacity-40 pointer-events-none">
            <Globe />
          </div>

        </div>

      </div>
    </header>
  );
}
