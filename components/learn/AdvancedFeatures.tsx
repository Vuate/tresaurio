import AdvancedFeaturesList from "./AdvancedFeaturesList";

export default function AdvancedFeatures() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1 text-sm font-bold text-purple-400">
            ⚡ GELİŞMİŞ ÖZELLİKLER
          </span>

          <h2 className="mt-4 text-3xl font-extrabold">
            Derinlemesine Analiz & Otomasyon
          </h2>
        </div>

        {/* GRID — AYNEN KALDI */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AdvancedFeaturesList />
        </div>
      </div>
    </section>
  );
}
