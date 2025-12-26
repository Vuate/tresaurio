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
          <div className="mb-6 flex items-center gap-3 text-lg font-bold">
            <span className="text-emerald-400">✓</span>
            <span>Treasurio</span>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <span className="text-emerald-400">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
