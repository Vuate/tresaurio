"use client";

export default function WalletMovements() {
  const rows = [
    {
      time: "16:45",
      addr: "bc1q...7x2m",
      amount: "127.84 BTC",
      type: "GİRİŞ",
      value: "$5.53M",
      status: "healthy",
    },
    {
      time: "16:38",
      addr: "1A1z...P9Nb",
      amount: "89.23 BTC",
      type: "ÇIKIŞ",
      value: "$3.86M",
      status: "critical",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span>👜</span> Büyük Wallet Hareketleri
        </h3>
        <div className="w-full h-[2px] bg-gradient-to-r from-emerald-400/40 to-transparent mt-2" />
      </div>

      {/* TABLE */}
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-slate-500 border-b border-white/10">
            <th className="py-2 text-left">Zaman</th>
            <th className="py-2 text-left">Wallet</th>
            <th className="py-2 text-left">Miktar</th>
            <th className="py-2 text-left">Tip</th>
            <th className="py-2 text-right">Değer</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/5 hover:bg-white/5 transition rounded-lg"
            >
              {/* TIME */}
              <td className="py-2 text-slate-300 font-mono">{row.time}</td>

              {/* WALLET */}
              <td className="py-2">
                <button
                  className="
                  px-2 py-1 rounded-lg 
                  bg-sky-500/10 border border-sky-400/40 
                  text-sky-200 font-mono text-[11px] 
                  hover:bg-sky-500/20 transition
                "
                >
                  {row.addr} <span>📋</span>
                </button>
              </td>

              {/* AMOUNT */}
              <td className="py-2 font-mono text-emerald-300">{row.amount}</td>

              {/* TYPE BADGE */}
              <td className="py-2">
                <span
                  className={`
                    px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide border
                    ${
                      row.status === "healthy"
                        ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/40"
                        : "bg-rose-400/10 text-rose-300 border-rose-400/40"
                    }
                  `}
                >
                  {row.type}
                </span>
              </td>

              {/* VALUE */}
              <td className="py-2 font-mono text-right text-slate-200">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
