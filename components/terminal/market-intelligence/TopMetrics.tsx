export default function TopMetrics() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {/* All-in Cost */}
      <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
        <p className="text-xs text-gray-400">💰 Gerçek İşlem Maliyeti</p>
        <p className="mt-2 text-3xl font-extrabold text-emerald-400">0.062%</p>
        <p className="mt-1 text-xs text-emerald-400">
          ↓ %12 daha düşük (OKX’e göre)
        </p>
      </div>

      {/* Efficiency */}
      <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
        <p className="text-xs text-gray-400">🧠 Market Efficiency</p>
        <p className="mt-2 text-3xl font-extrabold text-emerald-400">87</p>
        <div className="mt-2 h-2 w-full rounded bg-white/10">
          <div className="h-2 w-[87%] rounded bg-cyan-400" />
        </div>
      </div>

      {/* Spread */}
      <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
        <p className="text-xs text-gray-400">📉 Anlık Spread</p>
        <p className="mt-2 text-3xl font-extrabold">0.015%</p>
        <p className="mt-1 text-xs text-emerald-400">Normal (Ort: 0.018%)</p>
      </div>

      {/* Funding */}
      <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
        <p className="text-xs text-gray-400">🔄 Funding Rate</p>
        <p className="mt-2 text-3xl font-extrabold text-emerald-400">
          +0.0087%
        </p>
        <p className="mt-1 text-xs text-yellow-400">8s içinde • Long ödüyor</p>
      </div>
    </div>
  );
}
