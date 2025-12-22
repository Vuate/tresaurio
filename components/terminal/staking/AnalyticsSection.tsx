"use client";

import StrategyRecommendationsSection from "./StrategyRecommendationsSection";

export default function AnalyticsSection() {
  return (
    <div className="space-y-8">
      {/* ANALYTICS */}
      <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6">
        <div className="mb-4">
          <div className="text-lg font-bold">📊 Stake Analitiği</div>
          <div className="text-sm text-gray-400">
            Detaylı performans metrikleri ve trend analizi
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-gray-400">
          APR trend grafiği ve analitik dashboard buraya gelecek
        </div>
      </div>

      {/* STRATEGY RECOMMENDATIONS */}
 
      <StrategyRecommendationsSection />

    </div>
  );
}
