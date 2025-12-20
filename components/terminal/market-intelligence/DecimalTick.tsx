export default function DecimalTick() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <h3 className="mb-4 text-sm font-bold">📐 Decimal & Tick Size Yapısı</h3>

      <div className="space-y-3">
        <Row label="Price Tick Size" value="$0.10" />
        <Row label="Quantity Step Size" value="0.001 BTC" />
        <Row label="Min. Emir Büyüklüğü" value="$5 (0.00012 BTC)" />
        <Row label="Max. Emir Büyüklüğü" value="1,000 BTC" />
        <Row label="Execution Hassasiyeti" value="9.2/10" positive />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-gray-400">Borsa Karşılaştırması</p>

        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="py-2 text-left font-semibold uppercase tracking-wide">
                Borsa
              </th>
              <th className="py-2 text-left font-semibold uppercase tracking-wide">
                Tick Size
              </th>
              <th className="py-2 text-left font-semibold uppercase tracking-wide">
                Min. Lot
              </th>
            </tr>
          </thead>
          <tbody>
            <TableRow exchange="🟡 Binance" tick="$0.10" lot="0.001" best />
            <TableRow exchange="🟢 OKX" tick="$0.10" lot="0.001" />
            <TableRow exchange="🔵 Bybit" tick="$0.50" lot="0.01" worst />
            <TableRow exchange="⚪ Kraken" tick="$1.00" lot="0.001" worstTick />
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-3 text-xs text-yellow-400">
        ⚠️ Bybit’te küçük lot işlemleri dezavantajlı (0.01 BTC min)
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

function TableRow({
  exchange,
  tick,
  lot,
  best,
  worst,
  worstTick,
}: {
  exchange: string;
  tick: string;
  lot: string;
  best?: boolean;
  worst?: boolean;
  worstTick?: boolean;
}) {
  return (
    <tr className="border-b border-white/10 hover:bg-white/5">
      <td className="py-2">{exchange}</td>
      <td
        className={`py-2 font-mono font-semibold ${
          best ? "text-emerald-400" : worstTick ? "text-red-400" : "text-white"
        }`}
      >
        {tick}
      </td>
      <td
        className={`py-2 font-mono font-semibold ${
          best ? "text-emerald-400" : worst ? "text-red-400" : "text-white"
        }`}
      >
        {lot}
      </td>
    </tr>
  );
}
