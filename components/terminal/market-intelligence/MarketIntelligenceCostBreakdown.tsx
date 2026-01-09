const costItems = [
  { label: "Trading Fee", value: "$40", percent: "0.040%" },
  { label: "Spread", value: "$15", percent: "0.015%" },
  { label: "Slippage", value: "$7", percent: "0.007%" },
  { label: "Funding (8h)", value: "$0", percent: "0.000%" },
];

export default function MarketIntelligenceCostBreakdown() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">All-in Cost Örneği</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          $100,000 BTC trade için maliyet breakdown
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        <h3 className="text-lg mb-6 text-teal-400">
          Binance - BTC/USDT Perpetual
        </h3>

        {/* Cost Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {costItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 rounded-xl p-5 text-center"
            >
              <div className="text-xs text-gray-400 mb-2">{item.label}</div>
              <div className="text-2xl font-extrabold text-teal-400 mb-1">
                {item.value}
              </div>
              <div className="text-[13px] text-gray-300">{item.percent}</div>
            </div>
          ))}
        </div>

        {/* All-in Cost Summary */}
        <div className="mt-8 p-6 bg-[#041F20]/95 rounded-xl border-2 border-teal-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* All-in Cost */}
            <div>
              <div className="text-sm text-gray-400">ALL-IN COST</div>
              <div className="text-[32px] font-extrabold text-teal-400 mt-2">
                $62 (0.062%)
              </div>
            </div>

            {/* Annual Savings */}
            <div className="text-center md:text-right">
              <div className="text-[13px] text-gray-300">
                Annual Savings Potential
              </div>
              <div className="text-2xl font-bold text-green-500 mt-1">
                $22,680
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}