"use client";

import TradFiCard from "./TradFiCard";
import TradFiTable from "./TradFiTable";
import TradFiInfoAlert from "./TradFiInfoAlert";

export default function TradFiSection() {
  return (
    <div className="space-y-8">
      {/* INFO ALERT */}
      <TradFiInfoAlert />
    

      {/* SECTION */}
      <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6">
        {/* HEADER */}
        <div className="mb-6">
          <div className="text-lg font-bold">
            🌍 Geleneksel Finans Karşılaştırması
          </div>
          <div className="text-sm text-gray-400">
            Tahvil, faiz ve sabit getirili ürünler
          </div>
        </div>

        {/* GRID (trad-fi-grid) */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          <TradFiCard
            icon="🇺🇸"
            title="ABD Hazine Bonosu"
            sub="10 Yıllık"
            rate="4.2%"
            vs="BTC"
            text="+1.0% daha düşük"
            positive
          />

          <TradFiCard
            icon="🇬🇧"
            title="UK Gilt"
            sub="10 Yıllık"
            rate="4.5%"
            vs="ETH"
            text="+4.0% daha düşük"
            positive
          />

          <TradFiCard
            icon="🇹🇷"
            title="Türkiye Devlet Tahvili"
            sub="1 Yıllık"
            rate="48.5%"
            vs="USDT"
            text="+33.3% daha yüksek"
            negative
          />

          <TradFiCard
            icon="🏦"
            title="ABD Tasarruf Hesabı"
            sub="Yüksek Faizli"
            rate="5.1%"
            vs="BTC"
            text="+0.1% daha düşük"
            positive
          />

          <TradFiCard
            icon="📊"
            title="S&P 500 Ort. Getiri"
            sub="Yıllık Ortalama"
            rate="10.5%"
            vs="SOL"
            text="+2.3% daha düşük"
            positive
          />

          <TradFiCard
            icon="🏠"
            title="Gayrimenkul REIT"
            sub="Temettü Getirisi"
            rate="3.8%"
            vs="USDT"
            text="+11.4% daha düşük"
            positive
          />
        </div>
      </div>

      {/* DETAILED TABLE (ayrı section, HTML’deki gibi) */}
      <TradFiTable />
    </div>
  );
}
