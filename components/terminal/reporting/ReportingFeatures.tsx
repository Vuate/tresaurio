import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:database-sync-outline",
    title: "Automatic Data Collection",
    description:
      "Tüm data otomatik toplanır. Exchange API'leri, blockchain data, news sources bir araya getirilir ve raporunuz hazırlanır.",
  },
  {
    icon: "mdi:palette-outline",
    title: "Custom Templates",
    description:
      "Kendi rapor template'inizi oluşturun. Hangi modüllerin dahil olacağını, sıralamayı ve görsel düzeni özelleştirin.",
  },
  {
    icon: "mdi:calendar-clock-outline",
    title: "Scheduled Reports",
    description:
      "Günlük, haftalık veya aylık otomatik raporlar. Email'e otomatik gönderim veya PDF export desteği.",
  },
  {
    icon: "mdi:brain",
    title: "AI-Powered Insights",
    description:
      "Her modülde AI-generated insight'lar. Anomaly detection, trend spotting ve actionable recommendations.",
  },
  {
    icon: "mdi:chart-multiple",
    title: "Visual Charts",
    description:
      "Her metrik için görsel grafikler. Line charts, bar charts, pie charts ve heatmap'ler otomatik oluşturulur.",
  },
  {
    icon: "mdi:file-export-outline",
    title: "Export Options",
    description:
      "PDF, Excel, CSV formatlarında export. Raporlarınızı paylaşın veya arşivleyin.",
  },
];

export default function ReportingFeatures() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      {/* Section Header */}
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Öne Çıkan Özellikler
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Raporlama Motoru'i güçlü kılan yetenekler
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#041F20]/95 border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 2xl:p-8 text-center transition-all duration-300 hover:border-teal-400 hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="mb-3 sm:mb-4 lg:mb-5 flex justify-center">
              <Icon
                icon={feature.icon}
                className="text-3xl sm:text-4xl lg:text-[44px] text-teal-400"
              />
            </div>
            
            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">{feature.title}</h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
