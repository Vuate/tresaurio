export default function CostComparison() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">🧮 Gerçek Maliyet Karşılaştırması</h3>
        <span className="rounded bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">
          $100K İşlem
        </span>
      </div>

      <p className="mb-3 text-xs text-gray-400">
        All-in Cost (Fee + Spread + Slippage + Funding)
      </p>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 text-gray-400">
            <th className="py-2 text-left font-semibold uppercase tracking-wide">
              Borsa
            </th>
            <th className="py-2 text-left font-semibold uppercase tracking-wide">
              Fee
            </th>
            <th className="py-2 text-left font-semibold uppercase tracking-wide">
              Spread
            </th>
            <th className="py-2 text-left font-semibold uppercase tracking-wide">
              Slippage
            </th>
            <th className="py-2 text-left font-semibold uppercase tracking-wide">
              Funding
            </th>
            <th className="py-2 text-left font-semibold uppercase tracking-wide">
              Toplam
            </th>
          </tr>
        </thead>
        <tbody>
          <Row
            exchange="🟡 Binance"
            fee="$32"
            spread="$15"
            slip="$12"
            fund="$9"
            total="$68"
            best
          />
          <Row
            exchange="🟢 OKX"
            fee="$35"
            spread="$18"
            slip="$15"
            fund="$10"
            total="$78"
          />
          <Row
            exchange="🔵 Bybit"
            fee="$30"
            spread="$22"
            slip="$18"
            fund="$11"
            total="$81"
          />
          <Row
            exchange="⚪ Kraken"
            fee="$40"
            spread="$28"
            slip="$24"
            fund="$12"
            total="$104"
            worst
          />
        </tbody>
      </table>

      <div className="mt-4 rounded-lg border border-purple-400/30 bg-purple-400/10 p-4">
        <p className="text-sm font-semibold text-purple-400">
          💡 AI Recommendation
        </p>
        <p className="mt-1 text-xs text-gray-300">
          <strong>Binance</strong> bu işlem için{" "}
          <strong>$36 (%35) daha ucuz</strong>. Yıllık 100 benzer işlem
          yaparsanız toplam tasarruf: <strong>~$3,600</strong>
        </p>
      </div>
    </div>
  );
}

function Row({
  exchange,
  fee,
  spread,
  slip,
  fund,
  total,
  best,
  worst,
}: {
  exchange: string;
  fee: string;
  spread: string;
  slip: string;
  fund: string;
  total: string;
  best?: boolean;
  worst?: boolean;
}) {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="py-2">{exchange}</td>
      <td className="py-2 font-mono">{fee}</td>
      <td className="py-2 font-mono">{spread}</td>
      <td className="py-2 font-mono">{slip}</td>
      <td className="py-2 font-mono">{fund}</td>
      <td
        className={`py-2 font-mono font-bold ${
          best ? "text-emerald-400" : worst ? "text-red-400" : "text-white"
        }`}
      >
        {total}
      </td>
    </tr>
  );
}
