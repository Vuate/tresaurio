import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: "🔄",
    title: "Autobalancer",
    desc: "Exchange'leriniz arasında otomatik likidite yönetimi. Hot, Cold ve LP wallet'larınızı önceden belirlediğiniz band'ler içinde tutar. Manuel onay sistemi ile güvenli CW operasyonları.",
    tags: ["Otomatik", "Hot/Cold/LP", "Band Sistemi", "Maker-Checker", "Multi-Chain"],
  },
  {
    icon: "🪙",
    title: "Staking & Yield Intelligence",
    desc: "Tüm exchange'lerdeki staking fırsatlarını karşılaştırın. APR tracking, reward takvimi, geleneksel finans ürünleri ile kıyaslama. En iyi getiriyi bulun.",
    tags: ["APR Compare", "Flexible/Locked", "Reward Takvimi", "TradFi Comparison"],
  },
  {
    icon: "📊",
    title: "Market Wallet Tracker",
    desc: "Whale ve smart money hareketlerini gerçek zamanlı takip edin. Exchange flow'ları, on-chain transferler, accumulation/distribution sinyalleri. Arkham tarzı profesyonel tracker.",
    tags: ["Live Feed", "Whale Tracking", "Smart Money", "Exchange Flow"],
  },
  {
    icon: "📰",
    title: "News Intelligence",
    desc: "Haber akışını filtreleyin, etki seviyelerine göre sıralayın. Sentiment analizi, trend takibi, yaklaşan events. Her haberin fiyat etkisini anlık görün.",
    tags: ["Impact Labels", "Sentiment Analysis", "Event Calendar", "Trend Topics"],
  },
  {
    icon: "💰",
    title: "Market Microstructure & Cost Intelligence",
    desc: "Gerçek işlem maliyetinizi hesaplayın: Fee + Spread + Slippage + Funding. Exchange'leri karşılaştırın, en ucuz nerede trade yapacağınızı öğrenin. Quant seviyesi analiz.",
    tags: ["All-in Cost", "Exchange Compare", "Funding Rate", "OI Analysis", "Efficiency Score"],
  },
  {
    icon: "📄",
    title: "Reporting Engine",
    desc: "Özelleştirilebilir raporlar oluşturun. 39 farklı modülden seçim yapın, zaman aralığı belirleyin, otomatik insight'lar ekleyin. PDF, HTML, Excel export. Zamanlanabilir otomatik raporlar.",
    tags: ["39 Modül", "Custom Reports", "Auto Insights", "Scheduled"],
  },
];

export default function FeatureList() {
  return (
    <>
      {FEATURES.map((item) => (
        <FeatureCard key={item.title} {...item} />
      ))}
    </>
  );
}
