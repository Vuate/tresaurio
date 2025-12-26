export default function CTA() {
  return (
    <section className="section px-6">
      {/* SADECE CONTAINER FIX */}
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-teal-400/10 to-purple-400/10 px-10 py-16 text-center">
          
          {/* SUBTLE GLOW – BOYUT ETKİLEMEZ */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.12),transparent_65%)]" />

          <h2 className="relative text-3xl font-extrabold">
            Hazır mısınız?
          </h2>

          <p className="relative mx-auto mt-4 max-w-2xl text-gray-300">
            Treasurio ile trading ve yatırım yönetiminizi bir üst seviyeye taşıyın.
              Kurumsal seviye araçlar, şimdi herkes için.
          </p>

          <div className="relative mt-8 flex justify-center gap-4">
            {/* PRIMARY */}
            <button className="group cursor-pointer rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 px-8 py-4 font-bold text-black transition hover:shadow-[0_0_24px_rgba(45,212,191,0.4)]">
              🚀 Hemen Başla
            </button>

            {/* SECONDARY */}
            <button className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold transition hover:bg-white/10">
              📖 Dokümantasyon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
