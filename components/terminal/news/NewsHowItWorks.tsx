const steps = [
  {
    number: "1",
    title: "News Aggregation",
    description:
      "50+ haber kaynağından ve social media'dan haberleri otomatik toplarız. Real-time feed sürekli güncellenir ve tekrar eden haberler filtrelenir.",
  },
  {
    number: "2",
    title: "AI Analysis",
    description:
      "Her haber AI ile analiz edilir. Sentiment scoring, token mention detection ve impact prediction yapılır. Bullish/Bearish classification otomatik gerçekleşir.",
  },
  {
    number: "3",
    title: "Price Correlation",
    description:
      "Haber ile fiyat değişimi ilişkilendirilir. Pre/post news price tracking yapılır ve impact magnitude hesaplanır. High-impact news'ler için alert gönderilir.",
  },
];

export default function NewsHowItWorks() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Nasıl Çalışır?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Haber İstihbaratı'ı kullanmaya başlamak için 3 adım
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
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