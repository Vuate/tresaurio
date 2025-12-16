"use client";

export default function DataQuality() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10121A] p-5 flex flex-col items-center justify-center">
      <h3 className="text-xs font-semibold mb-3 flex items-center gap-1">
        <span>✓</span> Veri Kalitesi Durumu
      </h3>

      <div className="relative w-24 h-24 mb-2">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />

        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin-slow" />

        <div className="absolute inset-2 rounded-full bg-slate-950 flex flex-col items-center justify-center">
          <div className="font-mono text-xl font-extrabold text-emerald-300">
            98
          </div>
          <div className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
            Kalite
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Realtime veri akışı aktif. Gecikme gözlemlenmedi.
      </p>
    </div>
  );
}
