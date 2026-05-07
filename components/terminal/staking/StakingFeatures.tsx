import { Icon } from "@iconify/react";

const features = [
  {
    icon: "material-symbols:monitoring-rounded",
    title: "Real-Time Tracking",
    description: "Monitor all your staking positions in real-time. View staked amount, earned rewards, and current value on a single screen.",
    items: ["Live stake value and current price", "Earned reward amount (daily/weekly/monthly)", "Total value (stake + rewards)", "Multi-platform view"],
    variant: "blue" as const,
  },
  {
    icon: "material-symbols:percent-rounded",
    title: "APR/APY Comparison",
    description: "Compare staking rates across different platforms and find the most profitable option.",
    items: ["Platform-based APR comparison", "Lock period vs APR analysis", "Campaign boost tracking", "Historical APR trends"],
    variant: "neutral" as const,
  },
  {
    icon: "material-symbols:calculate-rounded",
    title: "ROI Calculation",
    description: "Calculate the real return on your staking investments. Analyze APR earnings and price changes together.",
    items: ["Total return (APR + price appreciation)", "Entry price vs current price", "Unrealized profit/loss tracking", "Break-even analysis"],
    variant: "neutral" as const,
  },
  {
    icon: "material-symbols:account-balance-rounded",
    title: "TradFi Comparison",
    description: "Compare your crypto staking returns with traditional finance products.",
    items: ["Savings account comparison", "Government bonds comparison", "Index fund comparison", "Risk-adjusted returns"],
    variant: "blue" as const,
  },
  {
    icon: "material-symbols:calendar-clock-rounded",
    title: "Reward Calendar",
    description: "View the reward distribution calendar and project your future earnings.",
    items: ["Daily reward distribution schedule", "Compound interest projections", "Lock period countdown", "Auto-compound tracking"],
    variant: "neutral" as const,
  },
  {
    icon: "material-symbols:stacked-line-chart-rounded",
    title: "Multi-Asset Dashboard",
    description: "If you're staking multiple coins, manage them all on a single dashboard.",
    items: ["Portfolio diversification view", "Cross-asset performance comparison", "Total portfolio APR calculation", "Asset allocation optimizer"],
    variant: "blue" as const,
  },
];

export default function StakingFeatures() {
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
          Manage and optimize all your staking positions from one place
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
