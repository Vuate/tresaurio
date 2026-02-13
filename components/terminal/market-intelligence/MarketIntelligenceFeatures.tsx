import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:calculator-variant-outline",
     title: "Total Cost Calculator",
    description:
      "Calculate the real cost of a trade. Combine Fee + Spread + Slippage + Funding into a single percentage.",
    items: [
      "Maker/taker fee calculation",
      "Bid-ask spread measurement",
      "Slippage estimation by size",
      "Funding rate impact (futures)",
    ],
  },
  {
    icon: "mdi:compare-horizontal",
  title: "Exchange Comparison",
    description:
      "How much does the same trade cost on different exchanges? Compare Binance vs OKX vs Bybit vs Kraken.",
    items: [
      "Side-by-side cost comparison",
      "Best/worst exchange highlighting",
      "Annual savings projection",
      "VIP tier recommendations",
    ],
  },
  {
    icon: "mdi:percent-outline",
    title: "Fee Structure Analysis",
    description:
      "Analyze exchange fee structures in detail. Calculate VIP tiers, discount tokens (BNB, OKB), and volume-based rebates.",
    items: [
      "VIP tier fee schedules",
      "Discount token (BNB/OKB) impact",
      "Volume-based rebates",
      "Maker rebate tracking",
    ],
  },
  {
    icon: "mdi:arrow-expand-horizontal",
    title: "Spread & Slippage",
    description:
      "Measure bid-ask spread and slippage at different order sizes. See the real cost for $10K, $100K, $1M trades.",
    items: [
      "Real-time spread monitoring",
      "Slippage by order size",
      "Liquidity depth analysis",
      "Best execution strategies",
    ],
  },
  {
    icon: "mdi:flash-outline",
    title: "Funding Rate Tracking",
    description:
      "Track funding rates for perpetual futures. Calculate the impact of positive/negative funding on trade costs.",
    items: [
      "8-hour funding rate tracking",
      "Cumulative funding cost",
      "Long/short pressure analysis",
      "Funding arbitrage opportunities",
    ],
  },
  {
    icon: "mdi:speedometer",
    title: "Market Efficiency Score",
    description:
      "Calculate the market efficiency score (0-100) for each exchange and coin pair. Combine liquidity, spread, and execution quality into a single metric.",
    items: [
      "Composite efficiency score (0-100)",
      "Liquidity rating",
      "Spread tightness",
      "Execution quality measurement",
    ],
  },
];

export default function MarketIntelligenceFeatures() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      {/* Section Header */}
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Key Features
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Put your trading costs under the microscope and optimize them
        </p>
      </div>

      <div className="features-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1"
          >
            <Icon
              icon={feature.icon}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2 sm:mb-3 lg:mb-4 text-teal-400"
            />

            <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold mb-2 sm:mb-3 text-teal-400">
              {feature.title}
            </h3>

            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-2.5 sm:mb-3 lg:mb-4">
              {feature.description}
            </p>

            <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-xs sm:text-sm lg:text-base text-gray-400 pl-4 sm:pl-5 lg:pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-green-500 before:font-bold before:inline-block before:w-3 sm:before:w-4 lg:before:w-5 before:text-center"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
