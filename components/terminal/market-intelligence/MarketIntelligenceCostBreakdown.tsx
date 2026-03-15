const costItems = [
  { label: "Trading Fee", value: "$40", percent: "0.040%" },
  { label: "Spread", value: "$15", percent: "0.015%" },
  { label: "Slippage", value: "$7", percent: "0.007%" },
  { label: "Funding (8h)", value: "$0", percent: "0.000%" },
];

export default function MarketIntelligenceCostBreakdown() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      {/* Section Header */}
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          All-in Cost Example
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Cost breakdown for a $100,000 BTC trade
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <h3 className="text-base sm:text-lg mb-4 sm:mb-5 lg:mb-6 text-white">
          Binance - BTC/USDT Perpetual
        </h3>

        {/* Cost Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {costItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center"
            >
              <div className="text-[10px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2">{item.label}</div>
              <div className="text-xl sm:text-2xl font-extrabold text-white mb-0.5 sm:mb-1">
                {item.value}
              </div>
              <div className="text-xs sm:text-[13px] text-gray-300">{item.percent}</div>
            </div>
          ))}
        </div>

        {/* All-in Cost Summary */}
        <div className="mt-6 sm:mt-7 lg:mt-8 p-4 sm:p-5 lg:p-6 bg-[#041F20]/95 rounded-lg sm:rounded-xl border-2 border-[#1A73E8]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-5 lg:gap-6">
            {/* All-in Cost */}
            <div>
              <div className="text-xs sm:text-sm text-gray-400">ALL-IN COST</div>
              <div className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-white mt-1.5 sm:mt-2">
                $62 (0.062%)
              </div>
            </div>

            {/* Annual Savings */}
            <div className="text-center md:text-right">
              <div className="text-xs sm:text-[13px] text-gray-300">
                Annual Savings Potential
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#1A73E8] mt-0.5 sm:mt-1">
                $22,680
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
