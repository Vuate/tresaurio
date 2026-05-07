import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:briefcase-variant-outline",
    title: "Spot Positions",
    description: "View all your spot holdings. Track entry prices, current value, and unrealized PnL in real-time.",
    items: ["Multi-exchange support", "Real-time price updates", "Unrealized PnL calculation", "Portfolio allocation view"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:flash-outline",
    title: "Futures Positions",
    description: "Monitor your open futures positions. View leverage, margin, and liquidation levels.",
    items: ["Long/Short position tracking", "Leverage and margin view", "Liquidation price calculation", "Funding rate impact"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:cash-multiple",
    title: "PnL Analysis",
    description: "View your realized and unrealized PnL in detail. Analyze by coin, exchange, or total portfolio returns.",
    items: ["Realized PnL breakdown", "Unrealized PnL tracking", "Coin-based performance", "Historical return charts"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:target-account",
    title: "DCA Calculation",
    description: "Combine purchases made at different times to calculate your average entry price.",
    items: ["Automatic DCA calculation", "Manual purchase entry", "Average price view", "Break-even analysis"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:shield-alert-outline",
    title: "Risk Management",
    description: "Measure your portfolio risk level. Get stop-loss recommendations and optimize position sizing.",
    items: ["Risk level scoring", "Stop-loss recommendations", "Position sizing calculation", "Diversification analysis"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:chart-line-variant",
    title: "Performance Statistics",
    description: "Analyze your historical trading performance. View win rate, average returns, and most profitable coins.",
    items: ["Win / Loss ratio", "Average gain / loss", "Most profitable / losing trades", "Monthly performance report"],
    variant: "blue" as const,
  },
];

export default function TradeFeatures() {
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
          All your trading and portfolio management tools in one place
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
