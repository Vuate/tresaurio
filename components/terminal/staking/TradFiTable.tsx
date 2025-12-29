export default function TradFiTable() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6">
      <div className="mb-4">
        <div className="text-lg font-bold">
          📊 Detaylı Karşılaştırma Tablosu
        </div>
        <div className="text-sm text-gray-400">
          Risk, likidite ve getiri analizi
        </div>
      </div>

      <div className="grid grid-cols-5 text-sm">
        {["Ürün", "Getiri", "Risk", "Likidite", "Vergi"].map(h => (
          <div key={h} className="border-b border-white/10 p-3 font-semibold text-gray-400">
            {h}
          </div>
        ))}

        <Row name="BTC Staking (Flexible)" apr="5.2%" risk="Düşük" liquidity="Anında" tax="Sermaye Kazancı" highlight />
        <Row name="ABD Hazine Bonosu" apr="4.2%" risk="Çok Düşük" liquidity="10 yıl" tax="%15-37" />
        <Row name="Türkiye Tahvil" apr="48.5%" risk="Yüksek" liquidity="1 yıl" tax="%10-40" />
        <Row name="S&P 500" apr="10.5%" risk="Orta" liquidity="1-2 gün" tax="%15-37" highlight />
      </div>
    </div>
  );
}

interface RowProps {
  name: string;
  apr: string;
  risk: string;
  liquidity: string;
  tax: string;
  highlight?: boolean;
}

function Row({ name, apr, risk, liquidity, tax, highlight }: RowProps) {
  return (
    <>
      <div className="border-b border-white/5 p-3">{name}</div>
      <div className={`border-b border-white/5 p-3 ${highlight ? "text-teal-300 font-bold" : ""}`}>
        {apr}
      </div>
      <div className="border-b border-white/5 p-3">{risk}</div>
      <div className={`border-b border-white/5 p-3 ${highlight ? "text-emerald-400" : ""}`}>
        {liquidity}
      </div>
      <div className="border-b border-white/5 p-3">{tax}</div>
    </>
  );
}
