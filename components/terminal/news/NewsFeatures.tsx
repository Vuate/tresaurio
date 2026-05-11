import { Icon } from "@iconify/react";

const features = [
  {
    icon: "material-symbols:psychology-rounded",
    title: "AI Sentiment Analysis",
    description: "Analyze each news article with AI to determine bullish/bearish/neutral sentiment scores. Track overall market sentiment in real-time.",
    items: ["Automatic sentiment scoring (0-100)", "Bullish/Bearish/Neutral classification", "Market-wide sentiment aggregation", "Historical sentiment tracking"],
    variant: "blue" as const,
  },
  {
    icon: "material-symbols:show-chart-rounded",
    title: "Price Impact Tracking",
    description: "Measure the impact of news on price. Automatically calculate price changes 5min, 15min, 1hr after news releases.",
    items: ["Pre/Post news price comparison", "Impact magnitude calculation", "Correlation analysis", "False news detection"],
    variant: "neutral" as const,
  },
  {
    icon: "lucide:layers",
    title: "Multi-Source Aggregation",
    description: "Aggregate news from CoinDesk, CoinTelegraph, Bloomberg Crypto, Twitter, Reddit, and 50+ sources in a single feed.",
    items: ["50+ news source integration", "Social media monitoring", "Custom source filtering", "Duplicate detection"],
    variant: "neutral" as const,
  },
  {
    icon: "lucide:filter",
    title: "Token-Specific News",
    description: "Dedicated news feed for each token. Filter news specific to tokens like BTC, ETH, SOL and view only relevant content.",
    items: ["Per-token news filtering", "Token mention tracking", "Trending topics per coin", "Custom watchlist alerts"],
    variant: "blue" as const,
  },
  {
    icon: "material-symbols:notifications-active-rounded",
    title: "Breaking News Alerts",
    description: "Get instant alerts when critical news breaks. Automatic notification system for high-impact news.",
    items: ["Instant push notifications", "High-impact news prioritization", "Custom keyword alerts", "Price movement correlation"],
    variant: "neutral" as const,
  },
  {
    icon: "material-symbols:trending-up-rounded",
    title: "Sentiment Trends",
    description: "Visualize market sentiment changes over time with charts. Detect bullish/bearish turning points.",
    items: ["Historical sentiment charts", "Sentiment momentum indicators", "Correlation with price", "Sentiment divergence detection"],
    variant: "blue" as const,
  },
];

export default function NewsFeatures() {
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
          Track crypto news intelligently and anticipate market movements in advance
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
