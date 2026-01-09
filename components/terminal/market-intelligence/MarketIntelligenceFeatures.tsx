const features = [
  {
    icon: "🧮",
    title: "Toplam Maliyet Hesaplayıcı",
    description:
      "Bir trade'in gerçek maliyetini hesaplayın. Fee + Spread + Slippage + Funding'i tek bir percentage'da toplayın.",
    items: [
      "Maker/taker fee calculation",
      "Bid-ask spread measurement",
      "Slippage estimation by size",
      "Funding rate impact (futures)",
    ],
  },
  {
    icon: "🏦",
    title: "Borsa Karşılaştırma",
    description:
      "Aynı trade'i farklı exchange'lerde yapmak ne kadara mal olur? Binance vs OKX vs Bybit vs Kraken karşılaştırması.",
    items: [
      "Side-by-side cost comparison",
      "Best/worst exchange highlighting",
      "Annual savings projection",
      "VIP tier recommendations",
    ],
  },
  {
    icon: "📊",
    title: "Fee Structure Analysis",
    description:
      "Exchange fee yapılarını detaylı inceleyin. VIP tier'lar, discount token'lar (BNB, OKB) ve volume-based rebate'leri hesaplayın.",
    items: [
      "VIP tier fee schedules",
      "Discount token (BNB/OKB) impact",
      "Volume-based rebates",
      "Maker rebate tracking",
    ],
  },
  {
    icon: "📉",
    title: "Spread & Slippage",
    description:
      "Bid-ask spread'i ve farklı order size'larda slippage'ı ölçün. $10K, $100K, $1M trade için gerçek maliyeti görün.",
    items: [
      "Real-time spread monitoring",
      "Slippage by order size",
      "Liquidity depth analysis",
      "Best execution strategies",
    ],
  },
  {
    icon: "⚡",
    title: "Funding Rate Tracking",
    description:
      "Perpetual futures için funding rate'leri takip edin. Pozitif/negatif funding'in trade maliyetine etkisini hesaplayın.",
    items: [
      "8-hour funding rate tracking",
      "Cumulative funding cost",
      "Long/short pressure analysis",
      "Funding arbitrage opportunities",
    ],
  },
  {
    icon: "🎯",
    title: "Piyasa Verimliliği Score",
    description:
      "Her exchange'in ve coin pair'in market efficiency score'unu hesaplayın (0-100). Liquidity, spread, execution quality'i tek bir metric'te toplayın.",
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
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Ana Özellikler</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Trading maliyetlerinizi mikroskop altına alın ve optimize edin
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#041F20]/95 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1"
          >
            {/* Icon */}
            <span className="text-[40px] block mb-4">{feature.icon}</span>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3 text-teal-400">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-[15px] text-gray-300 leading-relaxed mb-4">
              {feature.description}
            </p>

            {/* Feature List */}
            <ul className="space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-sm text-gray-400 pl-6 relative before:content-['✓'] before:absolute before:left-0 before:text-green-500 before:font-bold"
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