import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:briefcase-transfer-outline",
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
    icon: "grommet-icons:money", 
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
    icon: "lucide:wallet",
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
    icon: "ri:swap-line",
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
    icon: "material-symbols:swap-horiz-rounded",
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
    icon: "healthicons:alert-outline",
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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Ana Özellikler
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Kripto piyasasındaki büyük oyuncuların hareketlerini anlık takip edin
        </p>
      </div>

      <div className="features-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-[#041F20]/95 p-4 sm:p-5 lg:p-6 xl:p-7 transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1"
          >
            <Icon icon={feature.icon} className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-2 sm:mb-3 lg:mb-4 text-teal-400" />

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
