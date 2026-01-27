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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      {/* Section Header */}
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Exchange Karşılaştırması
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          $100,000 BTC trade için farklı exchange'lerde maliyet
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <div className="bg-[#041F20]/95 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 sm:gap-4 p-3 sm:p-4 md:px-5 lg:px-6 border-b border-white/10 bg-teal-500/10 font-bold text-[11px] sm:text-xs lg:text-[13px]">
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
              className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 sm:gap-4 p-3 sm:p-4 md:px-5 lg:px-6 items-center ${
                index !== exchangeData.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              {/* Exchange Name + Badge */}
              <div className="text-xs sm:text-sm">
                <strong>{exchange.name}</strong>
                {exchange.badge && (
                  <span
                    className={`inline-block ml-2 px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold ${
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
              <div className="text-xs sm:text-sm text-gray-300 text-center">
                {exchange.fee}
              </div>

              {/* Spread */}
              <div className="text-xs sm:text-sm text-gray-300 text-center">
                {exchange.spread}
              </div>

              {/* Slippage */}
              <div className="text-xs sm:text-sm text-gray-300 text-center">
                {exchange.slippage}
              </div>

              {/* Total Cost */}
              <div className="text-xs sm:text-sm text-center">
                <strong>{exchange.total}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
