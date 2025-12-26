export default function AnalyticsModulesList() {
  const modules = [
    {
      no: "1",
      title: "📈 Market & Fiyat Verileri",
      desc: "Fiyat özeti, yüzdesel değişim, volatilite, spread analizi",
    },
    {
      no: "2",
      title: "📊 Likidite & Orderbook",
      desc: "Orderbook depth, spread & depth analizi, market pressure, bid-ask dengesizliği",
    },
    {
      no: "3",
      title: "🔄 Flow & Transfer",
      desc: "Exchange inflow/outflow, whale transfers, CEX↔CEX, CEX↔DEX akışları",
    },
    {
      no: "4",
      title: "🧠 Smart Money & Davranış",
      desc: "16 farklı davranış pattern'i: accumulation, distribution, senkronize alım, lider-takipçi analizi",
    },
    {
      no: "5",
      title: "💼 Portföy & Trade",
      desc: "Unrealized/Realized PnL, DCA tracking, futures pozisyonlar, TP/SL durumu",
    },
    {
      no: "6",
      title: "⚠️ Risk & Alert",
      desc: "Risk limit aşımları, spread anomalileri, likidite uyarıları, price shock events",
    },
    {
      no: "7",
      title: "🧾 Fee & Tax",
      desc: "Toplam fee, maker/taker dağılımı, fee bazlı PnL etkisi, vergi hesaplaması",
    },
    {
      no: "8",
      title: "🔓 Open Interest",
      desc: "OI tracking, değişim hızı, fiyat korelasyonu, long/short ratio, likidasyon seviyeleri",
    },
    {
      no: "9",
      title: "🔄 Funding Rate",
      desc: "Anlık funding, geçmiş grafiği, long/short baskısı, exchange karşılaştırması",
    },
    {
      no: "10",
      title: "💰 Market Microstructure",
      desc: "Tick size, decimal yapısı, execution hassasiyeti, slippage hesaplama",
    },
  ];

  return (
    <>
      {modules.map((m) => (
        <div
          key={m.no}
          className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 px-6 py-5 transition hover:border-teal-400/40 hover:bg-white/10"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 font-extrabold text-teal-300">
            {m.no}
          </div>

          <div>
            <div className="font-bold">{m.title}</div>
            <div className="text-sm text-gray-400">{m.desc}</div>
          </div>
        </div>
      ))}
    </>
  );
}
