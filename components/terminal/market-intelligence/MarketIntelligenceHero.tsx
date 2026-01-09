import Head from "next/head";

export default function MarketIntelligenceHero() {
  return (
    <>
      <Head>
        <title>Market Microstructure & Cost Intelligence | Treasurio</title>
        <meta
          name="description"
          content="Gerçek trading maliyetini hesaplayın. Fee, spread, slippage ve funding'i tek bir all-in cost'ta toplayın. Exchange'leri karşılaştırıp en ucuz seçeneği bulun."
        />
      </Head>

      <div className="px-6 py-20 pb-16 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        {/* Hero Icon with Float Animation */}
        <div className="text-6xl mb-6 inline-block animate-float">
          💰
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-black mb-4 text-teal-400">
          Market Microstructure
          <br />& Cost Intelligence
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Gerçek trading maliyetini hesaplayın. Fee, spread, slippage ve funding'i tek bir all-in cost'ta toplayın. 
          Exchange'leri karşılaştırıp en ucuz seçeneği bulun.
        </p>

        {/* Tags */}
        <div className="flex gap-3 justify-center flex-wrap">
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Toplam Maliyet Hesaplayıcı
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Borsa Karşılaştırma
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Piyasa Verimliliği
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            İşlem Kalitesi
          </span>
        </div>
      </div>
    </>
  );
}