import { Icon } from "@iconify/react";

const features = [
  {
    icon: "material-symbols:monitoring-rounded",
    title: "Gerçek Zamanlı Takip",
    description:
      "Tüm stake pozisyonlarınızı anlık olarak izleyin. Stake edilen miktar, kazanılan rewards ve güncel değeri tek bir ekranda görüntüleyin.",
    items: [
      "Anlık stake değeri ve güncel fiyat",
      "Kazanılan reward miktarı (günlük/haftalık/aylık)",
      "Toplam değer (stake + rewards)",
      "Multi-platform görünüm",
    ],
  },
  {
    icon: "material-symbols:percent-rounded",
    title: "APR/APY Karşılaştırma",
    description:
      "Farklı platformlardaki staking oranlarını karşılaştırın ve en karlı seçeneği bulun.",
    items: [
      "Platform bazlı APR comparison",
      "Lock period vs APR analizi",
      "Campaign boost tracking",
      "Historical APR trends",
    ],
  },
  {
    icon: "material-symbols:calculate-rounded",
    title: "ROI Hesaplaması",
    description:
      "Staking yatırımlarınızın gerçek getirisini hesaplayın. APR kazancı ve fiyat değişimini birlikte analiz edin.",
    items: [
      "Total return (APR + price appreciation)",
      "Entry price vs current price",
      "Unrealized profit/loss tracking",
      "Break-even analysis",
    ],
  },
  {
    icon: "material-symbols:account-balance-rounded",
    title: "TradFi Karşılaştırma",
    description:
      "Crypto staking getirilerinizi geleneksel finans ürünleri ile karşılaştırın.",
    items: [
      "Savings account comparison",
      "Government bonds comparison",
      "Index fund comparison",
      "Risk-adjusted returns",
    ],
  },
  {
    icon: "material-symbols:calendar-clock-rounded",
    title: "Reward Calendar",
    description:
      "Reward dağıtım takvimini görüntüleyin ve gelecek kazançlarınızı projeksiyon yapın.",
    items: [
      "Daily reward distribution schedule",
      "Compound interest projections",
      "Lock period countdown",
      "Auto-compound tracking",
    ],
  },
  {
    icon: "material-symbols:stacked-line-chart-rounded",
    title: "Multi-Asset Pano",
    description:
      "Birden fazla coin'de staking yapıyorsanız, tümünü tek bir pano'da yönetin.",
    items: [
      "Portfolio diversification view",
      "Cross-asset performance comparison",
      "Total portfolio APR calculation",
      "Asset allocation optimizer",
    ],
  },
];

export default function StakingFeatures() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Ana Özellikler</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Tüm staking pozisyonlarınızı tek bir yerden yönetin ve optimize edin
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
<div className="mb-4">
  <Icon
    icon={feature.icon}
    width={40}
    height={40}
    className="text-teal-400"
  />
</div>

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