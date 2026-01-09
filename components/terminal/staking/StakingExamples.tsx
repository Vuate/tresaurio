const exampleCards = [
  {
    label: "Stake Edilmiş",
    value: "0.5 BTC",
    subvalue: "≈ $21,287.50",
  },
  {
    label: "Kazanılan Rewards",
    value: "0.0128 BTC",
    subvalue: "≈ $544.96",
  },
  {
    label: "APR",
    value: "5.2%",
    subvalue: "Campaign boost +1.2%",
  },
  {
    label: "Total Return",
    value: "+17.2%",
    subvalue: "APR 5.2% + Price 12%",
  },
];

const comparisonData = [
  {
    type: "BTC Staking (Treasurio)",
    return: "17.2%",
    risk: "Orta-Yüksek",
    highlighted: true,
  },
  {
    type: "Vadeli Mevduat (TRY)",
    return: "48%",
    risk: "Düşük",
  },
  {
    type: "Devlet Tahvili",
    return: "35%",
    risk: "Düşük",
  },
  {
    type: "S&P 500 (Tarihsel)",
    return: "~10%",
    risk: "Orta",
  },
  {
    type: "Altın (Tarihsel)",
    return: "~8%",
    risk: "Düşük-Orta",
  },
];

export default function StakingExamples() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Örnek Pano Görünümü</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Staking pozisyonlarınızı nasıl görüntüleyeceğinize dair örnekler
        </p>
      </div>

      {/* BTC Staking Position */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        <h3 className="mb-6 text-xl font-bold">BTC Staking Pozisyonu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {exampleCards.map((card, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 rounded-xl p-6 border border-white/10"
            >
              <div className="text-[11px] uppercase text-gray-400 tracking-wider mb-2">
                {card.label}
              </div>
              <div className="text-[28px] font-extrabold text-teal-400 mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-300">{card.subvalue}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TradFi Comparison */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-6">
        <h3 className="mb-6 text-xl font-bold">TradFi Karşılaştırması</h3>
        <div className="bg-[#041F20]/95 rounded-2xl overflow-hidden border border-white/10 mt-8">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6 p-5 md:px-8 border-b border-white/10 bg-teal-500/10 font-bold">
            <div className="text-[15px]">Yatırım Türü</div>
            <div className="text-[14px] text-gray-300 text-center">
              Yıllık Getiri
            </div>
            <div className="text-[14px] text-gray-300 text-center">
              Risk Seviyesi
            </div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6 p-5 md:px-8 items-center ${
                index !== comparisonData.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              <div className="text-[15px]">
                {row.highlighted ? <strong>{row.type}</strong> : row.type}
              </div>
              <div className="text-[14px] text-gray-300 text-center">
                {row.highlighted ? (
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-semibold bg-green-500/20 text-green-500">
                    {row.return}
                  </span>
                ) : (
                  row.return
                )}
              </div>
              <div className="text-[14px] text-gray-300 text-center">
                {row.highlighted ? (
                  <span className="inline-block px-3 py-1 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-500">
                    {row.risk}
                  </span>
                ) : (
                  row.risk
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}