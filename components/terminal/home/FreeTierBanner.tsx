"use client";

export default function FreeTierBanner() {
  return (
    <div className="relative w-full py-8 xl:py-9 2xl:py-10">
      {/* CONTAINER */}
      <div className="max-w-7xl xl:max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 xl:px-8 2xl:px-12">
        {/* CONTENT */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 xl:gap-9 2xl:gap-10">
          {/* LEFT TEXT */}
          <div className="max-w-2xl">
            <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-white tracking-wide">
              Trader (Free) Planını Kullanıyorsunuz
            </h3>

            <p className="text-gray-300 text-xs xl:text-sm 2xl:text-[15px] leading-relaxed mt-2 xl:mt-2.5 2xl:mt-3">
              Gelişmiş piyasa araçları, derin analizler ve risk yönetimi 
              özellikleri için Pro planına geçiş yapabilirsiniz.
            </p>
          </div>

          <div className="group">
            <button
              className="
                relative overflow-hidden
                px-8 xl:px-10 2xl:px-12
                py-3 xl:py-3.5 2xl:py-4
                rounded-xl xl:rounded-2xl 2xl:rounded-2xl
                text-sm xl:text-[15px] 2xl:text-base
                font-semibold text-white
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