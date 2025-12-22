"use client";

export default function StakingHeader() {
  return (
    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => history.back()}
          className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-teal-300 hover:bg-teal-300/10 transition"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            📊 Staking & Yield Intelligence
          </h1>
          <p className="text-xs text-gray-400">
            Kripto ve geleneksel finans getiri karşılaştırması
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">
          ⚙️ Uyarılar
        </button>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-br from-teal-300 to-teal-600 font-semibold text-sm">
          + Strateji Ekle
        </button>
      </div>
    </div>
  );
}
