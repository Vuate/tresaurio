// components/terminal/staking/StakingHero.tsx

import Head from "next/head";

export default function StakingHero() {
  return (
    <>
      <Head>
        <title>Staking & Getiri Takibi | Treasurio</title>
        <meta
          name="description"
          content="Stake verilerinizi merkezi bir pano'da takip edin, gerçek zamanlı ROI hesaplamaları yapın ve farklı platformlardaki kazançlarınızı karşılaştırın."
        />
      </Head>

      <div className="px-6 py-20 pb-16 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
        {/* Hero Icon with Float Animation */}
        <div className="text-6xl mb-6 inline-block animate-float">
          🪙
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-black mb-4 text-teal-400">
          Staking & Getiri Takibi
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Stake verilerinizi merkezi bir pano'da takip edin, gerçek zamanlı ROI hesaplamaları yapın ve 
          farklı platformlardaki kazançlarınızı karşılaştırın.
        </p>

        {/* Tags */}
        <div className="flex gap-3 justify-center flex-wrap">
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Anlık Takip
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Çoklu Platform
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            ROI Analizi
          </span>
          <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
            Geleneksel Finans Karşılaştırma
          </span>
        </div>
      </div>
    </>
  );
}