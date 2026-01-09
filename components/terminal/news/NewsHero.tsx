import Head from "next/head";

export default function NewsHero() {
  return (
    <>
      <Head>
        <title>Haber İstihbaratı | Treasurio</title>
        <meta
          name="description"
          content="Kripto haberlerini AI ile analiz edin, sentiment scoring yapın ve fiyat etkisini gerçek zamanlı ölçün. Piyasa hareketlerini haberlerle ilişkilendirerek önceden hareket edin."
        />
      </Head>

      <div className="px-6 py-20 pb-16 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        {/* Hero Icon with Float Animation */}
        <div className="text-6xl mb-6 inline-block animate-float">
          📰
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-black mb-4 text-teal-400">
          Haber İstihbaratı
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Kripto haberlerini AI ile analiz edin, sentiment scoring yapın ve fiyat etkisini gerçek zamanlı ölçün. 
          Piyasa hareketlerini haberlerle ilişkilendirerek önceden hareket edin.
        </p>

        {/* Tags */}
        <div className="flex gap-3 justify-center flex-wrap">
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Yapay Zeka Duygu Analizi
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Fiyat Etkisi Takibi
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Çoklu Kaynak Toplama
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Anlık Uyarılar
          </span>
        </div>
      </div>
    </>
  );
}