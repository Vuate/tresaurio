"use client";

export default function ActiveWatchlistSummary() {
  const totalValue = "$3.2M"; // 👉 Buraya API bağlanacak
  const change24h = "+$124K"; // 👉 Buraya API bağlanacak
  const changePercent = "+2.1%"; // 👉 Buraya API bağlanacak

  const isPositive = change24h.startsWith("+");

  return (
    <div
      className="
        rounded-2xl 
        border border-emerald-400/40 
        bg-[#0f1612] 
        p-6 
        relative 
        overflow-hidden
        shadow-[0_0_25px_rgba(0,255,180,0.15)]
      "
    >
      {/* Neon Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          📈 Aktif Watchlist Özeti
        </h2>

        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
            +
          </button>
          <button className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
            …
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {/* LEFT — TOPLAM DEĞER */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-[11px] text-gray-400 tracking-wide">
            TOPLAM DEĞER
          </span>

          <div className="text-3xl font-extrabold mt-1 text-emerald-300 drop-shadow-[0_0_10px_rgba(0,255,180,0.35)]">
            {totalValue}
          </div>

          <div className="text-[12px] text-emerald-400 mt-1">+4.2%</div>
        </div>

        {/* RIGHT — 24H DEĞİŞİM */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <span className="text-[11px] text-gray-400 tracking-wide">
            24H DEĞİŞİM
          </span>

          <div
            className={
              "text-3xl font-extrabold mt-1 drop-shadow-[0_0_10px_rgba(0,255,180,0.35)] " +
              (isPositive ? "text-emerald-300" : "text-rose-300")
            }
          >
            {change24h}
          </div>

          <div
            className={
              "text-[12px] mt-1 " +
              (isPositive ? "text-emerald-400" : "text-rose-400")
            }
          >
            {changePercent}
          </div>
        </div>
      </div>
    </div>
  );
}
