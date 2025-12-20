export default function FundingAnalysis() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">🔄 Funding Rate Analizi</h3>
        <span className="rounded bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">
          8 Saat
        </span>
      </div>

      <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-white/5 text-xs text-gray-400">
        Funding rate geçmiş grafiği (24s)
      </div>

      <div className="space-y-3 text-sm">
        <Row label="Mevcut Rate" value="+0.0087%" positive />
        <Row label="24s Ortalama" value="+0.0062%" />
        <Row label="Pozitif Funding Süresi" value="18 / 24 saat" />
        <Row label="Long / Short Baskısı" value="Long Dominant" warning />
      </div>

      <div className="mt-4 rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-3 text-xs text-yellow-400">
        ⚠️ Funding yüksek! Short pozisyon alırsanız ödeme alırsınız
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  positive,
  warning,
}: {
  label: string;
  value: string;
  positive?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 text-xs">
      <span className="text-gray-400">{label}</span>
      <span
        className={`font-mono font-semibold ${
          positive
            ? "text-emerald-400"
            : warning
            ? "text-yellow-400"
            : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
