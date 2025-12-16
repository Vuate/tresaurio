"use client";

export default function ActiveAssets() {
  const rows = [
    { asset: "DOGE", trades: 348, spark: [2, 5, 3, 7, 4, 6] },
    { asset: "BTC", trades: 287, spark: [6, 7, 5, 6, 8, 9] },
    { asset: "ETH", trades: 234, spark: [3, 4, 5, 6, 5, 7] },
    { asset: "XRP", trades: 198, spark: [4, 3, 4, 5, 6, 4] },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl">
      {/* HEADER */}
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <span>🔥</span> En Aktif Varlıklar
      </h3>

      <table className="w-full text-[11px]">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.asset}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              {/* ASSET */}
              <td className="py-3 font-mono text-xs">{row.asset}</td>

              {/* SPARKLINE (mini trend çizgisi) */}
              <td className="py-3">
                <Sparkline values={row.spark} />
              </td>

              {/* TRADE COUNT */}
              <td className="py-3 text-right text-emerald-300 font-semibold">
                {row.trades} işlem
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* MINI SPARKLINE COMPONENTI */
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);

  return (
    <div className="flex items-end gap-1 h-6">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm bg-gradient-to-t from-emerald-700/60 to-emerald-300/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
          style={{
            height: `${(v / max) * 24}px`,
          }}
        ></div>
      ))}
    </div>
  );
}
