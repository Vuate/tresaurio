import { Icon } from "@iconify/react";
export default function AnalyticsModulesList() {
  const modules = [
    {
      no: "1",
          icon: "mdi:chart-line",
      title: " Market & Fiyat Verileri",
      desc: "Fiyat özeti, yüzdesel değişim, volatilite, spread analizi",
    },
    {
      no: "2",
          icon: "mdi:chart-bar-stacked",

      title: " Likidite & Orderbook",
      desc: "Orderbook depth, spread & depth analizi, market pressure, bid-ask dengesizliği",
    },
    {
      no: "3",
          icon: "mdi:swap-horizontal",

      title: " Flow & Transfer",
      desc: "Exchange inflow/outflow, whale transfers, CEX↔CEX, CEX↔DEX akışları",
    },
    {
      no: "4",
          icon: "mdi:brain",

      title: " Smart Money & Davranış",
      desc: "16 farklı davranış pattern'i: accumulation, distribution, senkronize alım, lider-takipçi analizi",
    },
    {
      no: "5",
          icon: "mdi:briefcase-variant-outline",

      title: " Portföy & Trade",
      desc: "Unrealized/Realized PnL, DCA tracking, futures pozisyonlar, TP/SL durumu",
    },
    {
      no: "6",
          icon: "mdi:alert-octagon-outline",

      title: " Risk & Alert",
      desc: "Risk limit aşımları, spread anomalileri, likidite uyarıları, price shock events",
    },
    {
      no: "7",
          icon: "mdi:receipt-text-outline",

      title: " Fee & Tax",
      desc: "Toplam fee, maker/taker dağılımı, fee bazlı PnL etkisi, vergi hesaplaması",
    },
    {
      no: "8",
          icon: "mdi:chart-timeline-variant",

      title: " Open Interest",
      desc: "OI tracking, değişim hızı, fiyat korelasyonu, long/short ratio, likidasyon seviyeleri",
    },
    {
      no: "9",
          icon: "mdi:finance",

      title: " Funding Rate",
      desc: "Anlık funding, geçmiş grafiği, long/short baskısı, exchange karşılaştırması",
    },
    {
      no: "10",
          icon: "mdi:chart-box-outline",

      title: " Market Microstructure",
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
          {/* NUMARA */}
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 font-extrabold text-teal-300">
            {m.no}
          </div>

          {/* ICON + TITLE */}
          <div>
            <div className="flex items-center gap-2 font-bold">
              <Icon
                icon={m.icon}
                className="text-teal-400 text-[18px]"
              />
              <span>{m.title}</span>
            </div>

            <div className="text-sm text-gray-400">{m.desc}</div>
          </div>
        </div>
      ))}
    </>
  );

}
