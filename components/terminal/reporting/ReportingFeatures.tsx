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
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Öne Çıkan Özellikler</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Raporlama Motoru'i güçlü kılan yetenekler
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#041F20]/95 border border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:border-teal-400 hover:-translate-y-1"
          >
            {/* Icon */}
<div className="mb-5 flex justify-center">
  <Icon
    icon={feature.icon}
    width={44}
    height={44}
    className="text-teal-400"
  />
</div>
            {/* Title */}
            <h3 className="text-lg font-bold mb-3">{feature.title}</h3>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}