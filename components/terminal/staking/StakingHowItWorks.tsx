const steps = [
  {
    number: "1",
    title: "Platform Bağlantısı",
    description:
      "Staking yaptığınız platformları (Binance, Kraken, Coinbase vb.) API ile bağlayın veya manuel olarak pozisyonlarınızı girin.",
  },
  {
    number: "2",
    title: "Pozisyon Takibi",
    description:
      "Tüm stake pozisyonlarınız otomatik olarak pano'a yüklenir. Anlık değerler, rewards ve ROI hesaplamaları gerçek zamanlı güncellenir.",
  },
  {
    number: "3",
    title: "Analiz & İçgörü",
    description:
      "APR karşılaştırmaları, TradFi comparison ve historical performance raporlarını inceleyerek en iyi stratejileri belirleyin.",
  },
  {
    number: "4",
    title: "Optimizasyon",
    description:
      "Düşük performanslı stake'leri tespit edin, daha iyi APR fırsatlarını keşfedin ve portföyünüzü optimize edin.",
  },
];

export default function StakingHowItWorks() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Nasıl Çalışır?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Staking & Getiri Takibi'ı kullanmaya başlamak için 4 basit adım
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {steps.map((step, index) => (
          <div
            key={index}
            className="text-center p-8 bg-[#041F20]/95 rounded-2xl border border-white/10"
          >
            {/* Step Number Circle */}
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-5">
              {step.number}
            </div>

            {/* Step Title */}
            <h3 className="text-lg font-bold mb-3">{step.title}</h3>

            {/* Step Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}