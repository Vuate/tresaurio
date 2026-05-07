import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:briefcase-transfer-outline",
    title: "Real-time Transfer Feed",
    description: "View large transfers instantly. Track whale movements, exchange in/out flow, and significant wallet activities in a live feed.",
    items: ["Whale transfer alerts (>$1M)", "Exchange inflow/outflow tracking", "Unknown wallet → Exchange", "Exchange → Unknown wallet"],
    variant: "blue" as const,
  },
  {
    icon: "grommet-icons:money",
    title: "Smart Money Patterns",
    description: "Automatically detect 16 different smart money patterns and capture market manipulation signals.",
    items: ["Accumulation detection", "Distribution pattern recognition", "Pump & dump signals", "Institutional buying patterns"],
    variant: "neutral" as const,
  },
  {
    icon: "lucide:wallet",
    title: "Wallet Inspector",
    description: "Inspect any wallet in detail. View balance, transaction history, unrealized PnL, and smart money score.",
    items: ["Wallet balance breakdown", "Historical transaction analysis", "Unrealized profit/loss", "Smart money scoring (0-100)"],
    variant: "neutral" as const,
  },
  {
    icon: "ri:swap-line",
    title: "Exchange Net Flow",
    description: "Monitor the amount of coins entering and exiting exchanges. Track whether net flow is positive or negative in real-time.",
    items: ["Per-exchange inflow/outflow", "Net flow calculation (+ / -)", "24h/7d/30d comparison", "Exchange breakdown charts"],
    variant: "blue" as const,
  },
  {
    icon: "material-symbols:swap-horiz-rounded",
    title: "Token Flow Analysis",
    description: "Perform token-based flow analysis. See which tokens show accumulation and which show distribution.",
    items: ["Per-token flow tracking", "Top accumulating tokens", "Top distributing tokens", "Anomaly detection"],
    variant: "neutral" as const,
  },
  {
    icon: "healthicons:alert-outline",
    title: "Alert System",
    description: "Receive automatic alerts for critical whale movements. Set custom thresholds and never miss an important move.",
    items: ["Custom alert thresholds", "Whale movement notifications", "Pattern detection alerts", "Exchange flow warnings"],
    variant: "blue" as const,
  },
];

export default function WalletFeatures() {
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
          Track the movements of major players in the crypto market in real-time
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
