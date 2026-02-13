import { Icon } from "@iconify/react";

const categories = [
  {
    icon: "mdi:chart-line",
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
    icon: "mdi:waterfall",
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
    icon: "mdi:swap-horizontal",
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
    icon:"mdi:brain",
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
    icon: "mdi:briefcase-variant-outline",
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
    icon: "mdi:alert-octagon-outline",
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
    icon: "mdi:cash-multiple",
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
    icon: "mdi:chart-box-outline",
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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          8 Report Categories
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Comprehensive module collection for all your analysis needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-[#041F20]/95 border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 2xl:p-8 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-5">
              <div className="text-2xl sm:text-3xl lg:text-4xl text-teal-400">
                <Icon icon={category.icon} />
              </div>
              <div className="flex-1">
                <div className="text-base sm:text-lg lg:text-xl font-bold text-teal-400 mb-0.5 sm:mb-1">
                  {category.title}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">{category.count}</div>
              </div>
            </div>

            <ul className="space-y-0">
              {category.modules.map((module, moduleIndex) => (
                <li
                  key={moduleIndex}
                  className="py-2 sm:py-2.5 border-b border-white/5 last:border-b-0 text-xs sm:text-sm text-gray-300 flex items-center gap-2 sm:gap-3 before:content-['▸'] before:text-teal-400 before:font-bold"
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
