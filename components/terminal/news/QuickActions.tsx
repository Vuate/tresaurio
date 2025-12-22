export default function QuickActions() {
  return (
    <div className="mt-6">
      <div className="mb-3 text-sm font-semibold">⚡ Hızlı İşlemler</div>

      <div className="space-y-2">
        <button className="w-full rounded-lg bg-gradient-to-r from-teal-400 to-teal-600 px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
          📊 Grafiğe Git
        </button>

        <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          ⭐ Watchlist’e Ekle
        </button>

        <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          🔔 Alert Oluştur
        </button>

        <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
          💬 Sosyal Medya
        </button>
      </div>
    </div>
  );
}
