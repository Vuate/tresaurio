import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:calculator-variant-outline",
    title: "Total Cost Calculator",
    description: "Calculate the real cost of a trade. Combine Fee + Spread + Slippage + Funding into a single percentage.",
    items: ["Maker/taker fee calculation", "Bid-ask spread measurement", "Slippage estimation by size", "Funding rate impact (futures)"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:compare-horizontal",
    title: "Exchange Comparison",
    description: "How much does the same trade cost on different exchanges? Compare Binance vs OKX vs Bybit vs Kraken.",
    items: ["Side-by-side cost comparison", "Best/worst exchange highlighting", "Annual savings projection", "VIP tier recommendations"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:percent-outline",
    title: "Fee Structure Analysis",
    description: "Analyze exchange fee structures in detail. Calculate VIP tiers, discount tokens (BNB, OKB), and volume-based rebates.",
    items: ["VIP tier fee schedules", "Discount token (BNB/OKB) impact", "Volume-based rebates", "Maker rebate tracking"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:arrow-expand-horizontal",
    title: "Spread & Slippage",
    description: "Measure bid-ask spread and slippage at different order sizes. See the real cost for $10K, $100K, $1M trades.",
    items: ["Real-time spread monitoring", "Slippage by order size", "Liquidity depth analysis", "Best execution strategies"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:flash-outline",
    title: "Funding Rate Tracking",
    description: "Track funding rates for perpetual futures. Calculate the impact of positive/negative funding on trade costs.",
    items: ["8-hour funding rate tracking", "Cumulative funding cost", "Long/short pressure analysis", "Funding arbitrage opportunities"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:speedometer",
    title: "Market Efficiency Score",
    description: "Calculate the market efficiency score (0-100) for each exchange and coin pair.",
    items: ["Composite efficiency score (0-100)", "Liquidity rating", "Spread tightness", "Execution quality measurement"],
    variant: "blue" as const,
  },
];

export default function MarketIntelligenceFeatures() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Capabilities
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Key Features
        </h2>
        <p className="text-[#71717A] max-w-xl text-[0.875rem] leading-[1.7]">
          Put your trading costs under the microscope and optimize them
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
        {features.map((feature, i) => (
          <div
            key={i}
            className={[
              "rounded-xl p-7 border transition-all duration-250",
              "hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)]",
              feature.variant === "blue"
                ? "border-[#2563EB]/20"
                : "bg-card border-border-sub",
            ].join(" ")}
            style={
              feature.variant === "blue"
                ? { background: "linear-gradient(145deg, rgba(37,99,235,0.08) 0%, var(--card) 60%)" }
                : undefined
            }
          >
            <div
              className={[
                "w-10.5 h-10.5 rounded-[10px] flex items-center justify-center mb-4",
                feature.variant === "blue"
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "bg-input text-[#71717A]",
              ].join(" ")}
            >
              <Icon icon={feature.icon} className="text-xl" />
            </div>
            <h3 className="text-[0.95rem] font-bold text-foreground mb-2">{feature.title}</h3>
            <p className="text-[0.845rem] text-[#71717A] leading-[1.65] mb-4">{feature.description}</p>
            <ul className="space-y-1.5">
              {feature.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-[0.845rem] text-[#71717A]">
                  <span className="text-[#2563EB] font-bold mt-0.5 shrink-0">✓</span>
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
