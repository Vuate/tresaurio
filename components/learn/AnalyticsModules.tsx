import AnalyticsModulesList from "./AnalyticsModulesList";

export default function AnalyticsModules() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1 text-sm font-bold text-purple-400">
            📈 ANALİZ MODÜLLERİ
          </span>

          <h2 className="mt-4 text-3xl font-extrabold">
            50+ Detaylı Analiz Modülü
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-400">
            Her modül profesyonel trading için gerekli spesifik bir bilgiyi sağlar
          </p>
        </div>

        {/* LIST — AYNEN KALDI */}
        <div className="space-y-4">
          <AnalyticsModulesList />
        </div>
      </div>
    </section>
  );
}
