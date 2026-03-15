import { Icon } from "@iconify/react";

const features = [
  {
    icon: "material-symbols:psychology-rounded",
    title: "AI Sentiment Analysis",
    description:
      "Analyze each news article with AI to determine bullish/bearish/neutral sentiment scores. Track overall market sentiment in real-time.",
    items: [
      "Automatic sentiment scoring (0-100)",
      "Bullish/Bearish/Neutral classification",
      "Market-wide sentiment aggregation",
      "Historical sentiment tracking",
    ],
  },
  {
    icon: "material-symbols:show-chart-rounded",
    title: "Price Impact Tracking",
    description:
      "Measure the impact of news on price. Automatically calculate price changes 5min, 15min, 1hr after news releases.",
    items: [
      "Pre/Post news price comparison",
      "Impact magnitude calculation",
      "Correlation analysis",
      "False news detection",
    ],
  },
  {
    icon: "lucide:layers",
    title: "Multi-Source Aggregation",
    description:
      "Aggregate news from CoinDesk, CoinTelegraph, Bloomberg Crypto, Twitter, Reddit, and 50+ sources in a single feed.",
    items: [
      "50+ news source integration",
      "Social media monitoring",
      "Custom source filtering",
      "Duplicate detection",
    ],
  },
  {
    icon: "lucide:filter",
    title: "Token-Specific News",
    description:
      "Dedicated news feed for each token. Filter news specific to tokens like BTC, ETH, SOL and view only relevant content.",
    items: [
      "Per-token news filtering",
      "Token mention tracking",
      "Trending topics per coin",
      "Custom watchlist alerts",
    ],
  },
  {
    icon: "material-symbols:notifications-active-rounded",
    title: "Breaking News Alerts",
    description:
      "Get instant alerts when critical news breaks. Automatic notification system for high-impact news.",
    items: [
      "Instant push notifications",
      "High-impact news prioritization",
      "Custom keyword alerts",
      "Price movement correlation",
    ],
  },
  {
    icon: "material-symbols:trending-up-rounded",
    title: "Sentiment Trends",
    description:
      "Visualize market sentiment changes over time with charts. Detect bullish/bearish turning points.",
    items: [
      "Historical sentiment charts",
      "Sentiment momentum indicators",
      "Correlation with price",
      "Sentiment divergence detection",
    ],
  },
];

export default function NewsFeatures() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Key Features
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Track crypto news intelligently and anticipate market movements in advance
        </p>
      </div>

      <div className="features-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1"
          >
            <div className="mb-2 sm:mb-3 lg:mb-4">
              <Icon
                icon={feature.icon}
                className="text-[#1A73E8]/65 text-xl sm:text-2xl lg:text-3xl xl:text-4xl"
              />
            </div>

            <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold mb-2 sm:mb-3 text-white">
              {feature.title}
            </h3>

            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-2.5 sm:mb-3 lg:mb-4">
              {feature.description}
            </p>

            <ul className="space-y-1 sm:space-y-1.5 lg:space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-xs sm:text-sm lg:text-base text-gray-400 pl-4 sm:pl-5 lg:pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-[#1A73E8] before:font-bold before:inline-block before:w-3 sm:before:w-4 lg:before:w-5 before:text-center"
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