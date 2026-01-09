const categories = [
  {
    icon: "📈",
    title: "Market & Price",
    count: "5 Modules",
    modules: [
      "Price Summary & Performance",
      "Percentage Change Analysis",
      "Volatility Metrics",
      "Top Gainers/Losers",
      "Market Cap Trends",
    ],
  },
  {
    icon: "💧",
    title: "Liquidity & Orderbook",
    count: "5 Modules",
    modules: [
      "Spread Summary",
      "Orderbook Snapshot",
      "Market Pressure Analysis",
      "Liquidity Depth",
      "Bid/Ask Dynamics",
    ],
  },
  {
    icon: "🌊",
    title: "Flow & Transfer",
    count: "4 Modules",
    modules: [
      "Exchange Net Flow",
      "Whale Transfers",
      "CEX↔CEX Flow",
      "CEX↔DEX Movement",
    ],
  },
  {
    icon: "🧠",
    title: "Smart Money",
    count: "4 Modules",
    modules: [
      "Whale Accumulation/Distribution",
      "Smart Money Buy/Sell",
      "LTH Movements",
      "Institutional Activity",
    ],
  },
  {
    icon: "💼",
    title: "Portfolio & Trade",
    count: "6 Modules",
    modules: [
      "Unrealized PnL",
      "Realized PnL",
      "DCA Average Analysis",
      "Open Positions",
      "Futures Positions",
      "Portfolio Allocation",
    ],
  },
  {
    icon: "⚠️",
    title: "Risk & Alert",
    count: "5 Modules",
    modules: [
      "Risk Limit Status",
      "Spread Anomalies",
      "Liquidity Warnings",
      "Price Shock Detection",
      "Active Alerts Summary",
    ],
  },
  {
    icon: "💰",
    title: "Fee & Tax",
    count: "5 Modules",
    modules: [
      "Fee Analysis",
      "Maker/Taker Breakdown",
      "Fee PnL Impact",
      "Tax Calculation",
      "Annual Fee Report",
    ],
  },
  {
    icon: "📊",
    title: "Advanced Metrics",
    count: "5 Modules",
    modules: [
      "Open Interest Analysis",
      "Funding Rate History",
      "Long/Short Ratio",
      "Volume Analysis",
      "Global Market Metrics",
    ],
  },
];

export default function ReportingCategories() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">8 Rapor Kategorisi</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Her türlü analiz ihtiyacınız için kapsamlı modül koleksiyonu
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-[#041F20]/95 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1"
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="text-4xl">{category.icon}</div>
              <div className="flex-1">
                <div className="text-xl font-bold text-teal-400 mb-1">
                  {category.title}
                </div>
                <div className="text-xs text-gray-400">{category.count}</div>
              </div>
            </div>

            {/* Module List */}
            <ul className="space-y-0">
              {category.modules.map((module, moduleIndex) => (
                <li
                  key={moduleIndex}
                  className="py-2.5 border-b border-white/5 last:border-b-0 text-sm text-gray-300 flex items-center gap-3 before:content-['▸'] before:text-teal-400 before:font-bold"
                >
                  {module}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}