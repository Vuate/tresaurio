export default function TradFiCard({
  icon,
  title,
  sub,
  rate,
  vs,        // 👈 BURASI ÖNEMLİ
  text,
  positive,
  negative,
}: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-teal-300/40 transition">
      <div className="flex gap-3 mb-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-xs text-gray-400">{sub}</div>
        </div>
      </div>

      <div className="text-2xl font-mono font-bold text-teal-300 mb-1">
        {rate}
      </div>

      <div
        className={`text-xs ${
          positive
            ? "text-emerald-400"
            : negative
            ? "text-red-400"
            : "text-gray-400"
        }`}
      >
        vs {vs} Staking: {text}
      </div>
    </div>
  );
}
