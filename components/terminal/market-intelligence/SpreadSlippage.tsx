export default function SpreadSlippage() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <h3 className="mb-4 text-sm font-bold">📉 Spread & Slippage Analizi</h3>

      <div className="space-y-3 text-sm">
        <Row label="Anlık Spread" value="$6.50 (0.015%)" />
        <Row label="1s Ortalama Spread" value="$7.80 (0.018%)" />
        <Row label="En Dar Spread (24s)" value="$4.20 (0.010%)" positive />
        <Row label="En Geniş Spread (24s)" value="$24.50 (0.056%)" warning />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-gray-400">
          Emir Büyüklüğüne Göre Slippage
        </p>
        <table className="w-full text-xs">
          <tbody>
            <TableRow size="$10K" value="0.003%" best />
            <TableRow size="$100K" value="0.012%" />
            <TableRow size="$500K" value="0.045%" />
            <TableRow size="$1M" value="0.098%" worst />
          </tbody>
        </table>
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

function TableRow({
  size,
  value,
  best,
  worst,
}: {
  size: string;
  value: string;
  best?: boolean;
  worst?: boolean;
}) {
  return (
    <tr className="border-b border-white/10">
      <td className="py-2 text-gray-400">{size}</td>
      <td
        className={`py-2 text-right font-mono font-semibold ${
          best ? "text-emerald-400" : worst ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </td>
    </tr>
  );
}
