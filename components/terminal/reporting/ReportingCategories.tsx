import { Icon } from "@iconify/react";

const categories = [
  {
    icon: "mdi:chart-line",
    title: "Market & Price",
    count: "5 Modules",
    modules: ["Price Summary & Performance", "Percentage Change Analysis", "Volatility Metrics", "Top Gainers/Losers", "Market Cap Trends"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:waterfall",
    title: "Liquidity & Orderbook",
    count: "5 Modules",
    modules: ["Spread Summary", "Orderbook Snapshot", "Market Pressure Analysis", "Liquidity Depth", "Bid/Ask Dynamics"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:swap-horizontal",
    title: "Flow & Transfer",
    count: "4 Modules",
    modules: ["Exchange Net Flow", "Whale Transfers", "CEX↔CEX Flow", "CEX↔DEX Movement"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:brain",
    title: "Smart Money",
    count: "4 Modules",
    modules: ["Whale Accumulation/Distribution", "Smart Money Buy/Sell", "LTH Movements", "Institutional Activity"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:briefcase-variant-outline",
    title: "Portfolio & Trade",
    count: "6 Modules",
    modules: ["Unrealized PnL", "Realized PnL", "DCA Average Analysis", "Open Positions", "Futures Positions", "Portfolio Allocation"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:alert-octagon-outline",
    title: "Risk & Alert",
    count: "5 Modules",
    modules: ["Risk Limit Status", "Spread Anomalies", "Liquidity Warnings", "Price Shock Detection", "Active Alerts Summary"],
    variant: "neutral" as const,
  },
  {
    icon: "mdi:cash-multiple",
    title: "Fee & Tax",
    count: "5 Modules",
    modules: ["Fee Analysis", "Maker/Taker Breakdown", "Fee PnL Impact", "Tax Calculation", "Annual Fee Report"],
    variant: "blue" as const,
  },
  {
    icon: "mdi:chart-box-outline",
    title: "Advanced Metrics",
    count: "5 Modules",
    modules: ["Open Interest Analysis", "Funding Rate History", "Long/Short Ratio", "Volume Analysis", "Global Market Metrics"],
    variant: "neutral" as const,
  },
];

export default function ReportingCategories() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Modules
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          8 Report Categories
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Comprehensive module collection for all your analysis needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
        {categories.map((cat, i) => (
          <div
            key={i}
            className={[
              "group rounded-xl p-6 border transition-all duration-250",
              "hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)]",
              cat.variant === "blue"
                ? "border-[#2563EB]/20"
                : "bg-card border-border-sub",
            ].join(" ")}
            style={
              cat.variant === "blue"
                ? { background: "linear-gradient(145deg, rgba(37,99,235,0.08) 0%, var(--card) 60%)" }
                : undefined
            }
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={[
                  "w-10.5 h-10.5 rounded-[10px] flex items-center justify-center shrink-0",
                  cat.variant === "blue"
                    ? "bg-[#2563EB]/10 text-[#2563EB]"
                    : "bg-input text-[#71717A]",
                ].join(" ")}
              >
                <Icon icon={cat.icon} className="text-xl" />
              </div>
              <div>
                <div className="text-[0.875rem] font-bold text-foreground">{cat.title}</div>
                <div className="text-[0.72rem] text-[#2563EB] font-medium">{cat.count}</div>
              </div>
            </div>

            <ul className="space-y-0">
              {cat.modules.map((mod, j) => (
                <li
                  key={j}
                  className="py-1.5 border-b border-border-sub last:border-b-0 text-[0.8rem] text-[#71717A] flex items-center gap-2"
                >
                  <span className="text-[#2563EB] font-bold shrink-0">▸</span>
                  {mod}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
