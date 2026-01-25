import { Icon } from "@iconify/react";

const features = [
  {
    icon: "material-symbols:psychology-rounded",
    title: "Yapay Zeka Duygu Analizi",
    description:
      "Her haberi AI ile analiz ederek bullish/bearish/neutral sentiment puanı belirleyin. Toplam market sentiment'i anlık takip edin.",
    items: [
      "Automatic sentiment scoring (0-100)",
      "Bullish/Bearish/Neutral classification",
      "Market-wide sentiment aggregation",
      "Historical sentiment tracking",
    ],
  },
  {
    icon: "material-symbols:show-chart-rounded",
    title: "Fiyat Etkisi Takibi",
    description:
      "Haberlerin fiyat üzerindeki etkisini ölçün. Haber sonrası 5dk, 15dk, 1h fiyat değişimlerini otomatik hesaplayın.",
    items: [
      "Pre/Post news price comparison",
      "Impact magnitude calculation",
      "Correlation analysis",
      "False news detection",
    ],
  },
  {
    icon: "lucide:layers",
    title: "Çoklu Kaynak Toplama",
    description:
      "CoinDesk, CoinTelegraph, Bloomberg Crypto, Twitter, Reddit ve 50+ kaynaktan haberleri tek bir feed'de toplayın.",
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
      "Her token için özel haber feed'i. BTC, ETH, SOL gibi token'lara özel haberleri filtreleyin ve sadece ilgili içeriği görün.",
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
      "Kritik haberler çıktığında anında alert alın. High-impact news'ler için otomatik bildirim sistemi.",
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
      "Market sentiment'inin zaman içindeki değişimini grafik olarak görüntüleyin. Bullish/Bearish dönüm noktalarını tespit edin.",
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
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Ana Özellikler</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Kripto haberlerini akıllı şekilde takip edin ve piyasa hareketlerini önceden tahmin edin
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