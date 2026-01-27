import Head from "next/head";
import { Icon } from "@iconify/react";

const stats = [
  { value: "39", label: "Reporting Modules" },
  { value: "8", label: "Categories" },
  { value: "∞", label: "Custom Reports" },
];

export default function ReportingHero() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="39 modül, 8 kategori ile profesyonel crypto raporları oluşturun. Otomatik data toplama, AI-powered insight'lar ve özelleştirilebilir template'ler."
        />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 pb-5 sm:pb-7 lg:pb-9 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        {/* Hero Icon with Float Animation */}
        <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-3 sm:mb-4 lg:mb-5 inline-block animate-float text-teal-400">
          <Icon icon="mdi:file-chart-outline" />
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-2 sm:mb-3 lg:mb-4 text-teal-400">
          Raporlama Motoru
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300 max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto mb-6 sm:mb-7 lg:mb-8 xl:mb-10 leading-relaxed px-4">
          39 modül, 8 kategori ile profesyonel crypto raporları oluşturun. Otomatik data toplama, 
          AI-powered insight'lar ve özelleştirilebilir template'ler.
        </p>

        {/* Hero Stats */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-10 xl:gap-12 justify-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-teal-400 mb-1 sm:mb-1.5 lg:mb-2">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
