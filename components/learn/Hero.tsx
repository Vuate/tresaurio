export default function Hero() {
  return (
    <section className="border-b border-white/10 bg-gradient-to-b from-[#041F20] to-[#031A1C] px-6 py-20 text-center">
      <div className="mx-auto max-w-6xl">
        <h1
          className="
            text-4xl sm:text-5xl lg:text-6xl
            font-black
            leading-tight
            pb-2
            bg-gradient-to-br from-teal-300 to-purple-400
            bg-clip-text text-transparent
          "
        >
          Treasurio'ya Hoş Geldiniz
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-gray-300">
          Kripto piyasaları için profesyonel likidite, risk ve veri analiz platformu.
          Kurumsal seviyede araçlar, tek bir dashboard'da.
        </p>

        <div className="mt-14 flex flex-wrap justify-center gap-x-14 gap-y-10">
          {[
            ["12+", "Güçlü Araç"],
            ["50+", "Analiz Modülü"],
            ["24/7", "Gerçek Zamanlı"],
            ["100%", "Özelleştirilebilir"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono">
                {value}
              </div>
              <div className="mt-2 text-sm text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
