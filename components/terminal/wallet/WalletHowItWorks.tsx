const steps = [
  {
    number: "1",
    title: "Blockchain Monitoring",
    description:
      "Treasurio, blockchain'i sürekli tarar ve büyük transferleri otomatik tespit eder. Whale wallet'lar, exchange hot wallet'lar ve known addresses izlenir.",
  },
  {
    number: "2",
    title: "Pattern Detection",
    description:
      "AI destekli algoritma, 16 farklı smart money pattern'ini otomatik tespit eder. Accumulation, distribution, pump setup gibi kritik sinyalleri yakalar.",
  },
  {
    number: "3",
    title: "Alert & Analysis",
    description:
      "Kritik hareketler için anında alert alırsınız. Detaylı analiz araçları ile whale davranışlarını inceler ve trading stratejinizi optimize edersiniz.",
  },
];

export default function WalletHowItWorks() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Nasıl Çalışır?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Wallet tracking'i kullanmaya başlamak için 3 adım
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