"use client";

import { useEffect, useState } from "react";

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------
export default function MarketComparison() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/markets/comparison");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // ❗ DATA YOKSA RENDER ETME
  if (!data || !data.binance || !data.okx) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
        <p className="text-gray-500 text-sm">
          Borsa karşılaştırması yükleniyor...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span>⚡</span> Borsa Karşılaştırması
        </h3>

        <div className="flex items-center gap-4 text-[11px]">
          <ExchangeSelect label="Sol Borsa" />
          <span className="text-slate-500">VS</span>
          <ExchangeSelect label="Sağ Borsa" />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ComparisonCard
          title="BINANCE"
          price={data.binance.price}
          spread={data.binance.spread}
          spreadStability={data.binance.stability}
          volume={data.binance.volume}
          freq={data.binance.freq}
          theme="sky"
        />

        <ComparisonCard
          title="OKX"
          price={data.okx.price}
          spread={data.okx.spread}
          spreadStability={data.okx.stability}
          volume={data.okx.volume}
          freq={data.okx.freq}
          theme="violet"
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// EXCHANGE SELECT BOX
// ----------------------------------------------------
function ExchangeSelect({ label }: { label: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-slate-500 uppercase tracking-[0.16em] text-[9px] mb-1">
        {label}
      </label>
      <select className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-400/40 font-mono text-xs">
        <option>BINANCE</option>
        <option>OKX</option>
        <option>COINBASE</option>
      </select>
    </div>
  );
}

// ----------------------------------------------------
// COMPARISON CARD COMPONENT
// ----------------------------------------------------
function ComparisonCard({
  title,
  price,
  spread,
  spreadStability,
  volume,
  freq,
  theme,
}: any) {
  const themeStyles =
    theme === "sky"
      ? "border-sky-400/30 bg-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.4)]"
      : "border-violet-400/30 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.4)]";

  return (
    <div className={`rounded-2xl border p-5 ${themeStyles}`}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div
          className={`font-mono text-lg font-extrabold tracking-[0.2em] ${
            theme === "sky" ? "text-sky-200" : "text-violet-200"
          }`}
        >
          {title}
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          Canlı
        </span>
      </div>

      {/* BODY */}
      <div className="space-y-4">
        {/* PRICE */}
        <div>
          <div className="text-[10px] text-slate-200 uppercase tracking-[0.16em] mb-1">
            Fiyat & Piyasa
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-200">Son Fiyat</span>
            <span className="font-mono">${price?.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-emerald-200">
            <span>Fiyat Sapması</span>
            <span className="font-mono">
              {spread > 0 ? "+" : ""}
              {spread.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* SPREAD STABILITY */}
        <div>
          <div className="text-[10px] text-slate-200 uppercase tracking-[0.16em] mb-1">
            Spread & Likidite
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-200">Spread</span>
            <span className="font-mono text-emerald-200">
              {spread.toFixed(3)}%
            </span>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 text-[11px]">
                Spread İstikrarı
              </span>
              <span className="font-mono text-[11px] text-slate-50">
                {spreadStability}%
              </span>
            </div>

            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
              <div
                className={`h-full rounded-full ${
                  theme === "sky"
                    ? "bg-gradient-to-r from-sky-300 to-emerald-300"
                    : "bg-gradient-to-r from-violet-300 to-pink-300"
                }`}
                style={{ width: `${spreadStability}%` }}
              />
            </div>
          </div>
        </div>

        {/* VOLUME */}
        <div>
          <div className="text-[10px] text-slate-200 uppercase tracking-[0.16em] mb-1">
            Hacim & Aktivite
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-200">24h Volume</span>
            <span className="font-mono">${(volume / 1e9).toFixed(2)}B</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-200">
            <span>İşlem Frekansı</span>
            <span className="font-mono">{freq}/dk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
