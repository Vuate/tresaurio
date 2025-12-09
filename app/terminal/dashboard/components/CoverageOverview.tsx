"use client";

export default function CoverageOverview() {
  const data = {
    watchedAssets: 8,
    newAssets: 2,
    activeExchanges: 7,
    totalExchanges: 7,
    feedStatus: "Stabil - Gecikme yok",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f111a] p-6 shadow-lg relative overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <span>📊</span> Kapsam Genel Bakış
        </h3>

        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
            +
          </button>
          <button className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs">
            …
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        {/* İzlenen Varlıklar */}
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-xs text-gray-400">İzlenen Varlıklar</p>
          <p className="text-3xl font-bold">{data.watchedAssets}</p>
          <p className="text-green-400 text-xs mt-1">+{data.newAssets} yeni</p>
        </div>

        {/* Aktif Borsalar */}
        <div className="rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-xs text-gray-400">Aktif Borsalar</p>
          <p className="text-3xl font-bold">{data.activeExchanges}</p>
          <p className="text-teal-400 text-xs mt-1">
            {data.activeExchanges} / {data.totalExchanges} çevrimiçi
          </p>
        </div>

        {/* Veri Akışı Durumu */}
        <div className="col-span-2 rounded-xl bg-white/5 p-4 border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Veri Akış Durumu</p>
            <p className="text-green-400 font-medium">{data.feedStatus}</p>
          </div>

          <button className="px-3 py-1 rounded-md bg-green-500/20 text-green-300 border border-green-400/40 text-xs">
            REALTIME
          </button>
        </div>
      </div>
    </div>
  );
}
