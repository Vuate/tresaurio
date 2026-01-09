// components/terminal/trade/TradeHero.tsx

import Head from "next/head";

export default function TradeHero() {
  return (
    <>
      <Head>
        <title>Trade & Portföy Yönetimi | Treasurio</title>
        <meta
          name="description"
          content="Spot ve futures işlemlerinizi tek bir panoda yönetin. Açık pozisyonlarınızı takip edin, PnL hesaplamaları yapın ve portföy performansınızı analiz edin."
        />
      </Head>

      <div className="px-6 py-20 pb-16 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        {/* Hero Icon with Float Animation */}
        <div className="text-6xl mb-6 inline-block animate-float">
          📊
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-black mb-4 text-teal-400">
          Trade & Portföy Yönetimi
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Spot ve futures işlemlerinizi tek bir panoda yönetin. Açık pozisyonlarınızı takip edin, 
          PnL hesaplamaları yapın ve portföy performansınızı analiz edin.
        </p>

        {/* Tags */}
        <div className="flex gap-3 justify-center flex-wrap">
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Spot & Futures
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Çoklu Borsa
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            PnL Takibi
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Risk Yönetimi
          </span>
        </div>
      </div>
    </>
  );
}