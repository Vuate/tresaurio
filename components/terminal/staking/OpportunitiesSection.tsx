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

        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
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

      {/* ⬇️ LIMITED ARTIK AYRI FILE */}
      <LimitedOffersSection />
    </div>
  );
}

/* ===== LOCAL UI BLOCKS (AYNI) ===== */

interface SectionHeaderProps {
  title: string;
  desc: string;
}

function SectionHeader({ title, desc }: SectionHeaderProps) {
  return (
    <div>
      <div className="text-lg font-bold">{title}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
  );
}

interface StakeCardProps {
  icon: string | React.ReactNode;
  title: string;
  platform: string;
  apr: string;
  items: [string, string | number | React.ReactNode][];
}

function StakeCard({ icon, title, platform, apr, items }: StakeCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-teal-300/40 transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-lg">
            {icon}
          </div>
          <div>
            <div className="font-bold">{title}</div>
            <div className="text-xs text-gray-400">{platform}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase">APR</div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            {apr}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-sm">
        {items.map((i, idx) => (
          <Detail key={idx} label={i[0]} value={i[1]} />
        ))}
      </div>
    </div>
  );
}

interface DetailProps {
  label: string;
  value: string | number | React.ReactNode;
}

function Detail({ label, value }: DetailProps) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

type BadgeType = "success" | "warning" | "danger" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  type: BadgeType;
}

function Badge({ children, type }: BadgeProps) {
  const map: Record<BadgeType, string> = {
    success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    danger: "text-red-400 bg-red-400/10 border-red-400/30",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  };

  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${map[type]}`}>
      {children}
    </span>
  );
}
