// components/terminal/wallet/WalletHero.tsx
import { Icon } from "@iconify/react";

export default function WalletHero() {
  return (
    <div className="px-6 py-20 pb-16 text-center bg-gradient-to-b from-teal-500/5 to-transparent border-b border-white/10">
      <div className="text-6xl mb-6 inline-block animate-float">
<Icon icon="lucide:wallet" className="text-white-400" />
      </div>

      <h1 className="text-5xl font-black mb-4 text-teal-400">
        Piyasa Cüzdan Takipçisi
      </h1>

      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
        Whale hareketlerini ve smart money akışlarını gerçek zamanlı takip edin. Büyük transferleri, 
        exchange in/out flow'larını ve piyasa manipülasyon sinyallerini yakalayın.
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
          Anlık Takip
        </span>
        <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
          Balina Uyarıları
        </span>
        <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
          Akıllı Para Analizi
        </span>
        <span className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-[13px] font-semibold text-teal-400">
          16 Örüntü Tespiti
        </span>
      </div>
    </div>
  );
}