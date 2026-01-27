import FeatureList from "./FeatureList";
import { Icon } from "@iconify/react";

export default function FeatureSection() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
<span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1 text-sm font-bold text-purple-400">
  <Icon icon="mdi:target-variant" className="text-base" />
  ANA ARAÇLAR
</span>

          <h2 className="mt-4 text-3xl font-extrabold">
            Profesyonel Trading & Analiz Araçları
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-400">
            Exchange arayüzlerinin ötesinde, kurumsal trader'ların ihtiyaç duyduğu
            tüm araçlar tek platformda
          </p>
        </div>

        {/* GRID — AYNEN KALDI */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FeatureList />
        </div>
      </div>
    </section>
  );
}
