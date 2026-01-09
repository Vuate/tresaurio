const features = [
  {
    icon: "📡",
    title: "Real-time Transfer Feed",
    description:
      "Büyük transferleri anlık olarak görün. Whale hareketleri, exchange in/out flow ve önemli wallet aktivitelerini canlı feed'de takip edin.",
    items: [
      "Whale transfer alerts (>$1M)",
      "Exchange inflow/outflow tracking",
      "Unknown wallet → Exchange",
      "Exchange → Unknown wallet",
    ],
  },
  {
    icon: "🎯",
    title: "Smart Money Patterns",
    description:
      "16 farklı smart money pattern'ini otomatik tespit edin ve piyasa manipülasyon sinyallerini yakalayın.",
    items: [
      "Accumulation detection",
      "Distribution pattern recognition",
      "Pump & dump signals",
      "Institutional buying patterns",
    ],
  },
  {
    icon: "🔍",
    title: "Wallet Inspector",
    description:
      "Herhangi bir wallet'ı detaylı inceleyin. Balance, transaction history, unrealized PnL ve smart money score görüntüleyin.",
    items: [
      "Wallet balance breakdown",
      "Historical transaction analysis",
      "Unrealized profit/loss",
      "Smart money scoring (0-100)",
    ],
  },
  {
    icon: "🏦",
    title: "Exchange Net Flow",
    description:
      "Exchange'lere giren ve çıkan coin miktarını izleyin. Net flow pozitif mi negatif mi anlık takip edin.",
    items: [
      "Per-exchange inflow/outflow",
      "Net flow calculation (+ / -)",
      "24h/7d/30d comparison",
      "Exchange breakdown charts",
    ],
  },
  {
    icon: "📊",
    title: "Token Flow Analysis",
    description:
      "Token bazlı akış analizleri yapın. Hangi token'larda accumulation, hangilerinde distribution var görün.",
    items: [
      "Per-token flow tracking",
      "Top accumulating tokens",
      "Top distributing tokens",
      "Anomaly detection",
    ],
  },
  {
    icon: "⚡",
    title: "Alert System",
    description:
      "Kritik whale hareketleri için otomatik alert alın. Custom threshold'lar belirleyin ve önemli hiçbir hareketi kaçırmayın.",
    items: [
      "Custom alert thresholds",
      "Whale movement notifications",
      "Pattern detection alerts",
      "Exchange flow warnings",
    ],
  },
];

export default function WalletFeatures() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Ana Özellikler</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Kripto piyasasındaki büyük oyuncuların hareketlerini anlık takip edin
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