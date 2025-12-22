"use client";

import StrategyCard from "./StrategyCard";

export default function StrategyRecommendationsSection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6">
      <div className="mb-6">
        <div className="text-lg font-bold">💡 Strateji Önerileri</div>
        <div className="text-sm text-gray-400">
          Portföyünüz için optimize edilmiş öneriler
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        <StrategyCard
          icon="📈"
          title="Uzun Vadeli Strateji"
          subtitle="Düşük Risk, Sabit Getiri"
          recommendation="BTC ve ETH'yi locked stake'e alın. Ortalama %6 getiri ile risk minimize edilir."
        />

        <StrategyCard
          icon="⚡"
          title="Kısa Vadeli Strateji"
          subtitle="Orta Risk, Yüksek Getiri"
          recommendation="Launchpool ve kampanyalı havuzları değerlendirin. 30 günlük kilitleme ile %15+ getiri."
        />
      </div>
    </div>
  );
}
