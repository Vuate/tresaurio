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
          <div className="mb-6 flex items-center gap-3 text-lg font-bold">
            <span className="text-red-400">✗</span>
            <span>Standart Exchange Arayüzleri</span>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-gray-300"
              >
                <span className="text-red-400">✗</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
