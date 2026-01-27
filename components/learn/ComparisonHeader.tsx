import { Icon } from "@iconify/react";

export default function ComparisonHeader() {
  return (
    <section className="section px-6 text-center">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
<span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1 text-sm font-bold text-purple-400">
  <Icon icon="mdi:scale-balance" className="text-base" />
  KARŞILAŞTIRMA
</span>

        <h2 className="mt-4 text-3xl font-extrabold">
          Treasurio vs Exchange Arayüzleri
        </h2>
      </div>
    </section>
  );
}
