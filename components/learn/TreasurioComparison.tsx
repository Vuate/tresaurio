import { Icon } from "@iconify/react";

const items = [
  "Tüm exchange'leri tek yerde görüntüleyin",
  "Gerçek işlem maliyetini hesaplayın (fee+spread+slippage+funding)",
  "Smart money hareketlerini takip edin",
  "Otomatik likidite yönetimi (Autobalancer)",
  "16+ smart money davranış pattern'i",
  "Kapsamlı reporting ve analytics",
  "Özelleştirilebilir infinite canvas dashboard",
  "AI-powered insights ve öneriler",
  "Multi-channel alert sistemi",
  "Staking fırsatlarını karşılaştırın",
];

export default function TreasurioComparison() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-white/10 bg-[#041F20]/95 p-8">
<div className="mb-6 flex items-center text-lg font-bold">
  <Icon
    icon="mdi:check-circle-outline"
    className="mr-3 w-5 text-emerald-400 text-xl"
  />
  <span>Treasurio</span>
</div>

<div className="space-y-4">
  {items.map((item) => (
    <div
      key={item}
      className="flex items-start text-sm text-gray-300"
    >
      <Icon
        icon="mdi:check-circle-outline"
        className="mr-3 mt-[2px] w-5 text-emerald-400 text-base"
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
