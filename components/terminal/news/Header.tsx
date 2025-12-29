export default function Header() {
  return (
    <div className="h-[72px] px-6 flex items-center justify-between border-b border-white/10 bg-[#041F20]">
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-lg border border-white/10 mt-4">
          ←
        </button>

        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">📰 News</h1>
          <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/30">
            CANLI
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button className="btn-secondary">⚙️ Bildirimler</button>
        <button className="btn-secondary">📅 Takvim</button>
      </div>
    </div>
  );
}
