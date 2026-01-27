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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      {/* Section Header */}
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Nasıl Çalışır?
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Wallet tracking'i kullanmaya başlamak için 3 adım
        </p>
      </div>

      {/* Steps Grid */}
      <div className="steps grid gap-4 sm:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 grid-cols-1 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="text-center p-4 sm:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-[#041F20]/95 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10"
          >
            {/* Step Number Circle */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-extrabold mx-auto mb-3 sm:mb-4 lg:mb-5">
              {step.number}
            </div>

            {/* Step Title */}
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3">
              {step.title}
            </h3>

            {/* Step Description */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
