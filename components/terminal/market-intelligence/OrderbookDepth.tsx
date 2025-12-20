"use client";

import { useEffect, useState } from "react";

export default function OrderbookDepth() {
  const [cells, setCells] = useState<number[]>([]);

  useEffect(() => {
    const gen = () => Array.from({ length: 10 }, () => Math.random());
    setCells(gen());

    const i = setInterval(() => setCells(gen()), 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <h3 className="mb-4 text-sm font-bold">
        📦 Orderbook Derinliği & Likidite
      </h3>

      <div className="space-y-3 text-sm">
        <Row label="Toplam Derinlik (±1%)" value="$45.2M" />
        <Row label="Toplam Derinlik (±2%)" value="$124.8M" />
        <Row label="Bid / Ask Dengesizliği" value="52% / 48%" />
        <Row label="En Büyük Bid Duvarı" value="$42,450 @ 320 BTC" />
        <Row label="En Büyük Ask Duvarı" value="$43,200 @ 280 BTC" />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-gray-400">Likidite Yoğunluk Haritası</p>

        <div className="grid grid-cols-10 gap-1">
          {cells.map((v, i) => (
            <div
              key={i}
              className={`aspect-square rounded ${
                v > 0.7
                  ? "bg-red-500/70"
                  : v > 0.4
                  ? "bg-yellow-400/60"
                  : "bg-emerald-400/40"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-cyan-400/30 bg-cyan-400/10 p-3 text-xs text-cyan-400">
        💡 $42.4K seviyesinde güçlü destek duvarı
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
