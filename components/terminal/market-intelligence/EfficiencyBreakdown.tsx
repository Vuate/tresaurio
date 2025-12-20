export default function EfficiencyBreakdown() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <h3 className="mb-4 text-sm font-bold">
        🧠 Market Efficiency Skoru Detayı
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <Gauge label="Likidite" value={92} />
        <Gauge label="Spread" value={85} />
        <Gauge label="Execution" value={84} />
      </div>

      <div className="mt-5 space-y-3">
        <Row label="Fee Rekabetçiliği" value="9.1 / 10" positive />
        <Row label="Volatiliteye Tepki Süresi" value="Hızlı (45ms)" positive />
        <Row label="Genel Sağlık Durumu" value="Mükemmel" positive />
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

function Gauge({ label, value }: { label: string; value: number }) {
  const angle = Math.round((value / 100) * 360);

  return (
    <div className="text-center">
      <div
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(
            rgba(34,211,238,1) 0deg,
            rgba(34,211,238,1) ${angle}deg,
            rgba(255,255,255,0.08) ${angle}deg
          )`,
        }}
      >
        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#041F20]">
          <div className="text-xl font-extrabold">{value}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
