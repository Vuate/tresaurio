export default function OpenInterest() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">🔓 Open Interest & Positioning</h3>
        <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs text-emerald-400">
          +12.4%
        </span>
      </div>

      <p className="text-xs text-gray-400">Toplam Open Interest</p>
      <p className="mt-1 text-3xl font-extrabold">$8.45B</p>
      <p className="mt-1 text-xs text-emerald-400">↑ +$1.02B son 24s</p>

      <div className="mt-4 flex h-40 items-center justify-center rounded-lg bg-white/5 text-xs text-gray-400">
        OI vs Fiyat korelasyon grafiği
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <Row label="OI Değişim Hızı" value="+12.4% / 24s" positive />
        <Row label="Fiyat vs OI Korelasyon" value="0.87 (Güçlü)" />
        <Row label="Son OI Spike" value="14:32 UTC (+8.2%)" />
      </div>

      <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-400">
        ⚠️ Fiyat düşerken OI artıyor — Short pozisyon açılışı dominant
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 text-xs">
      <span className="text-gray-400">{label}</span>
      <span
        className={`font-mono font-semibold ${
          positive ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
