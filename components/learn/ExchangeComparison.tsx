import { Icon } from "@iconify/react";

const items = [
  "Sadece kendi exchange'lerini gösterirler",
  "Gizli maliyetler (spread, slippage) gösterilmez",
  "Whale tracking yok",
  "Manuel likidite yönetimi gerekir",
  "Temel on-chain data, detay yok",
  "Sınırlı raporlama yetenekleri",
  "Sabit layout, özelleştirme yok",
  "AI insights yok",
  "Basit alert sistemi",
  "Staking comparison yok",
];

export default function ExchangeComparison() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/10 bg-[#041F20]/95 p-8">
<div className="mb-6 flex items-center text-lg font-bold">
  <Icon
    icon="mdi:close-circle-outline"
    className="mr-3 w-5 text-red-400 text-xl"
  />
  <span>Standart Exchange Arayüzleri</span>
</div>

<div className="space-y-4">
  {items.map((item) => (
    <div
      key={item}
      className="flex items-start text-sm text-gray-300"
    >
      <Icon
        icon="mdi:close-circle-outline"
        className="mr-3 mt-[2px] w-5 text-red-400 text-base"
      />
      <span>{item}</span>
    </div>
  ))}
</div>
        </div>
      </div>
    </section>
  );
}
