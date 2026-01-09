const exchangeData = [
  {
    name: "Binance",
    badge: "BEST",
    badgeType: "best",
    fee: "$40",
    spread: "$15",
    slippage: "$7",
    total: "$62",
  },
  {
    name: "OKX",
    fee: "$45",
    spread: "$18",
    slippage: "$9",
    total: "$72",
  },
  {
    name: "Bybit",
    fee: "$42",
    spread: "$22",
    slippage: "$11",
    total: "$75",
  },
  {
    name: "Kraken",
    badge: "WORST",
    badgeType: "worst",
    fee: "$50",
    spread: "$35",
    slippage: "$19",
    total: "$104",
  },
];

export default function MarketIntelligenceComparison() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Exchange Karşılaştırması</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          $100,000 BTC trade için farklı exchange'lerde maliyet
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        <div className="bg-[#041F20]/95 rounded-2xl overflow-hidden border border-white/10">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 md:px-6 border-b border-white/10 bg-teal-500/10 font-bold text-[13px]">
            <div>Exchange</div>
            <div className="text-center">Fee</div>
            <div className="text-center">Spread</div>
            <div className="text-center">Slippage</div>
            <div className="text-center">Total Cost</div>
          </div>

          {/* Table Rows */}
          {exchangeData.map((exchange, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 md:px-6 items-center ${
                index !== exchangeData.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              {/* Exchange Name + Badge */}
              <div className="text-sm">
                <strong>{exchange.name}</strong>
                {exchange.badge && (
                  <span
                    className={`inline-block ml-2 px-3 py-1 rounded-xl text-[11px] font-bold ${
                      exchange.badgeType === "best"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {exchange.badge}
                  </span>
                )}
              </div>

              {/* Fee */}
              <div className="text-sm text-gray-300 text-center">
                {exchange.fee}
              </div>

              {/* Spread */}
              <div className="text-sm text-gray-300 text-center">
                {exchange.spread}
              </div>

              {/* Slippage */}
              <div className="text-sm text-gray-300 text-center">
                {exchange.slippage}
              </div>

              {/* Total Cost */}
              <div className="text-sm text-center">
                <strong>{exchange.total}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}