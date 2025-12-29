"use client";

import PortfolioHeader from "./PortfolioHeader";
import PortfolioPerformance from "./PortfolioPerformance";
import StatusBadge from "./StatusBadge";

export default function PortfolioSection() {
  return (
    <div className="space-y-8">
      <PortfolioHeader />

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
        <StakePositionCard
          icon="₿"
          title="0.5 BTC"
          platform="Binance Flexible"
          apr="5.2%"
          items={[
            ["Başlangıç", "15 Kas 2024"],
            ["Kazanılan", "0.0021 BTC"],
            ["Değer", "$46,050"],
            ["Durum", <StatusBadge type="active">Aktif</StatusBadge>],
          ]}
        />

        <StakePositionCard
          icon="Ξ"
          title="12 ETH"
          platform="OKX Locked 60d"
          apr="8.5%"
          items={[
            ["Kalan Süre", "42 gün"],
            ["Kazanılan", "0.28 ETH"],
            ["Değer", "$44,280"],
            ["Durum", <StatusBadge type="locked">Kilitli</StatusBadge>],
          ]}
        />
      </div>

      <PortfolioPerformance />
    </div>
  );
}

/* ===== LOCAL COMPONENT ===== */

function StakePositionCard({ icon, title, platform, apr, items }: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-teal-300/40 transition w-full">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-lg font-bold">
            {icon}
          </div>
          <div>
            <div className="font-bold text-base">{title}</div>
            <div className="text-xs text-gray-400">{platform}</div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">
            APR
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 leading-tight">
            {apr}
          </div>
        </div>
      </div>

      {/* DETAILS - Her biri ayrı kutucuk, yan yana grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((i: any, idx: number) => (
          <div
            key={idx}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
          >
            <div className="text-[10px] text-gray-400 mb-1">{i[0]}</div>
            <div className="font-semibold text-sm">{i[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}