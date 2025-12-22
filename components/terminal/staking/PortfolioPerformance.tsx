"use client";

export default function PortfolioPerformance() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6">
      <div className="mb-3">
        <div className="text-lg font-bold">📈 Performans Özeti</div>
        <div className="text-sm text-gray-400">
          Son 30 günlük getiri analizi
        </div>
      </div>

      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-gray-400">
        Performans grafiği buraya gelecek (Chart.js)
      </div>
    </div>
  );
}
