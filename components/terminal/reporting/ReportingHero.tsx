import Head from "next/head";

const stats = [
  { value: "39", label: "Reporting Modules" },
  { value: "8", label: "Categories" },
  { value: "∞", label: "Custom Reports" },
];

export default function ReportingHero() {
  return (
    <>
      <Head>
        <title>Raporlama Motoru | Treasurio</title>
        <meta
          name="description"
          content="39 modül, 8 kategori ile profesyonel crypto raporları oluşturun. Otomatik data toplama, AI-powered insight'lar ve özelleştirilebilir template'ler."
        />
      </Head>

      <div className="px-6 py-20 pb-16 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        {/* Hero Icon with Float Animation */}
        <div className="text-6xl mb-6 inline-block animate-float">
          📊
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-black mb-4 text-teal-400">
          Raporlama Motoru
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          39 modül, 8 kategori ile profesyonel crypto raporları oluşturun. Otomatik data toplama, 
          AI-powered insight'lar ve özelleştirilebilir template'ler.
        </p>

        {/* Hero Stats */}
        <div className="flex flex-col md:flex-row gap-12 justify-center mt-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-black text-teal-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}