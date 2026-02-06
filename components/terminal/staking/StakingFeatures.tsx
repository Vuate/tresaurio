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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Ana Özellikler
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Tüm staking pozisyonlarınızı tek bir yerden yönetin ve optimize edin
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
                className="text-teal-400 text-xl sm:text-2xl lg:text-3xl xl:text-4xl"
              />
            </div>

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
