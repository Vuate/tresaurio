"use client";

import PortfolioHeader from "./PortfolioHeader";
import StakePositionCard from "./StakePositionCard";
import PortfolioPerformance from "./PortfolioPerformance";
import StatusBadge from "./StatusBadge";

export default function PortfolioSection() {
  return (
    <div className="space-y-8">
      <PortfolioHeader />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
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
