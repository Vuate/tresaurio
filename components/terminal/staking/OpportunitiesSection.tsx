"use client";

import LimitedOffersSection from "./LimitedOffersSection";
import OpportunitiesSuccessAlert from "./OpportunitiesSuccessAlert";

export default function OpportunitiesSection() {
  return (
    <div className="space-y-8">
      {/* SUCCESS ALERT */}
      <OpportunitiesSuccessAlert />

      {/* NEW POOLS */}
      <section className="space-y-5">
        <SectionHeader
          title="🆕 Yeni Açılan Havuzlar"
          desc="Son 7 günde eklenen stake fırsatları"
        />

        {/* ✅ COMPACT GRID - Her detail ayrı kutucuk */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          <StakeCard
            icon="₿"
            title="BTC Flexible"
            platform="Binance • Yeni"
            apr="5.2%"
            items={[
              ["Min. Miktar", "0.001 BTC"],
              ["Kilit Süresi", "Esnek"],
              ["Reward", "Günlük"],
              ["Risk", <Badge type="success">Düşük</Badge>],
            ]}
          />

          <StakeCard
            icon="Ξ"
            title="ETH Staking 2.0"
            platform="OKX • Kampanya"
            apr="8.5%"
            items={[
              ["Min. Miktar", "0.1 ETH"],
              ["Kilit Süresi", "60 gün"],
              ["Boost", <Badge type="purple">+2% Bonus</Badge>],
              ["Risk", <Badge type="warning">Orta</Badge>],
            ]}
          />

          <StakeCard
            icon="💎"
            title="SOL DeFi Pool"
            platform="Bybit • Sınırlı"
            apr="12.8%"
            items={[
              ["Min. Miktar", "10 SOL"],
              ["Kalan Kota", "2,450 SOL"],
              ["Süre", "30 gün"],
              ["Risk", <Badge type="danger">Yüksek</Badge>],
            ]}
          />
        </div>
      </section>

      {/* LIMITED OFFERS */}
      <LimitedOffersSection />
    </div>
  );
}

/* ===== LOCAL UI BLOCKS ===== */

function SectionHeader({ title, desc }: any) {
  return (
    <div>
      <div className="text-lg font-bold">{title}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
  );
}

function StakeCard({ icon, title, platform, apr, items }: any) {
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
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">APR</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 leading-tight">
            {apr}
          </div>
        </div>
      </div>

      {/* DETAILS - Her biri ayrı kutucuk, yan yana grid */}
      <div className="grid grid-cols-2 gap-5">
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

function Badge({ children, type }: any) {
  const map: any = {
    success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    danger: "text-red-400 bg-red-400/10 border-red-400/30",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${map[type]}`}
    >
      {children}
    </span>
  );
}