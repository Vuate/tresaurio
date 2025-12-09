"use client";

import { useEffect, useState } from "react";

interface NetflowPoint {
  time: number;
  value: number;
}

export default function NetFlow() {
  const [netflow, setNetflow] = useState<NetflowPoint[]>([]);

  async function fetchNetflow() {
    try {
      // MOCK DATA — sonra API ekleriz
      const demoData = [
        { time: 1, value: -320 },
        { time: 2, value: 150 },
        { time: 3, value: -80 },
        { time: 4, value: 220 },
        { time: 5, value: -410 },
        { time: 6, value: 190 },
      ];

      setNetflow(demoData);
    } catch (err) {
      console.error("Netflow error:", err);
    }
  }

  useEffect(() => {
    fetchNetflow();
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span>🌊</span> Net Akış Genel Bakış
        </h3>

        <span className="text-[11px] text-slate-400">Son 6 dönem</span>
      </div>

      {/* NETFLOW CHART */}
      <div className="flex items-end h-36 gap-3">
        {netflow.map((p, i) => {
          const positive = p.value > 0;
          const height = Math.min(Math.abs(p.value) / 3, 100); // max 100px

          return (
            <div
              key={i}
              className={`
                w-6 rounded-md transition-all duration-500 
                shadow-[0_0_12px_rgba(0,0,0,0.4)]
                ${
                  positive
                    ? "bg-gradient-to-t from-rose-600/60 to-rose-300/80 shadow-[0_0_20px_rgba(255,80,80,0.4)]"
                    : "bg-gradient-to-t from-emerald-700/60 to-emerald-300/80 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                }
              `}
              style={{
                height: `${height}px`,
              }}
            ></div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="flex justify-between mt-3 text-[11px] text-slate-400">
        <span>🔴 Pozitif → Borsalara giriş</span>
        <span>🟢 Negatif → Borsalardan çıkış</span>
      </div>
    </div>
  );
}
