"use client";

export default function FreeTierBanner() {
  return (
    <div className="relative w-full py-10">

      {/* GENİŞ CONTAINER — bütün ekranlarda dengeli yayılır */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

          {/* LEFT TEXT */}
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-wide">
              Trader (Free) Planını Kullanıyorsunuz
            </h3>

            <p className="text-gray-300 text-sm md:text-[15px] leading-relaxed mt-3">
              Gelişmiş piyasa araçları, derin analizler ve risk yönetimi 
              özellikleri için Pro planına geçiş yapabilirsiniz.
            </p>
          </div>

          {/* CTA BUTTON */}
          <div className="group">
            <button
              className="
                relative overflow-hidden
                px-8 md:px-12 lg:px-16 
                py-3 md:py-4
                rounded-2xl font-semibold text-white
                bg-gradient-to-br from-[#1FA2FF] via-[#007ADF] to-[#0052D4]
                transition-all duration-300
                hover:scale-[1.01]
                active:scale-100
                cursor-pointer
              "
            >
              <span
                className="
                  absolute inset-0 
                  translate-x-[-130%]
                  bg-gradient-to-r from-transparent via-white/60 to-transparent
                  opacity-0
                  transition-all duration-700 ease-out
                  pointer-events-none
                  group-hover:opacity-70 group-hover:translate-x-[130%]
                "
              />
              Pro'ya Yükselt
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
