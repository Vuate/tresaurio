import { Icon } from "@iconify/react";

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
            <button className="group flex items-center gap-2 cursor-pointer rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 px-8 py-4 font-bold text-black transition">
              <Icon icon="mdi:rocket-launch-outline" className="text-xl" />
              Hemen Başla
            </button>

            {/* SECONDARY */}
            <button className="flex items-center gap-2 cursor-pointer rounded-xl border border-white/15 bg-white/5 px-8 py-4 font-bold transition">
              <Icon
                icon="mdi:book-open-page-variant-outline"
                className="text-xl text-white/80"
              />
              Dokümantasyon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
