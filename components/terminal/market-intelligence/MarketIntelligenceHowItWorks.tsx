const steps = [
  {
    number: "1",
    title: "Data Collection",
    description:
      "Real-time orderbook data, fee schedules, funding rates ve historical spreads toplanır. Tüm exchange'lerden aynı anda veri çekilir.",
  },
  {
    number: "2",
    title: "Cost Calculation",
    description:
      "Order size'ınız için all-in cost hesaplanır. Fee + spread + slippage + funding component'leri bir araya getirilerek gerçek maliyet bulunur.",
  },
  {
    number: "3",
    title: "Optimization",
    description:
      "En ucuz exchange tespit edilir, VIP tier upgrade ROI hesaplanır ve execution strategy önerileri sunulur. Annual savings projection gösterilir.",
  },
];

export default function MarketIntelligenceHowItWorks() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Nasıl Çalışır?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Market Microstructure analizi yapmak için 3 adım
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