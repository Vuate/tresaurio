export default function FeeAnalysis() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">💸 Komisyon & Fee Analizi</h3>
        <span className="rounded bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">
          VIP 2
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <Row label="Maker Fee" value="0.020%" positive />
        <Row label="Taker Fee" value="0.040%" />
        <Row label="Effective Fee (30g Ort.)" value="0.032%" />
        <Row label="BNB İndirim Sonrası" value="0.028%" positive />
        <Row label="Sonraki VIP (30g hacim)" value="$2.4M / $5M" />
      </div>

      <div className="mt-4 rounded-lg border border-purple-400/20 bg-purple-400/5 p-4">
        <p className="text-sm font-semibold text-purple-400">💡 AI Insight</p>
        <p className="mt-1 text-xs text-gray-300">
          $2.6M daha fazla hacim yaparsanız VIP 3’e geçer ve fee oranlarınız %15
          düşer. Potansiyel yıllık tasarruf:
          <strong> ~$8,400</strong>
        </p>
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
