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
            <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-extrabold text-foreground tracking-wide">
                You're Using the Trader (Free) Plan
            </h3>

            <p className="text-foreground/70 text-xs xl:text-sm 2xl:text-[15px] leading-relaxed mt-2 xl:mt-2.5 2xl:mt-3">
              Upgrade to the Pro plan for advanced market tools, deep analytics, 
              and risk management features.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              disabled
              className="
                relative flex items-center gap-3
                px-7 xl:px-9 2xl:px-10
                py-3 xl:py-3.5 2xl:py-4
                rounded-xl xl:rounded-2xl
                cursor-not-allowed
                bg-foreground/6 border border-border
                transition-all duration-300
              "
            >
              <svg className="w-4 h-4 text-foreground/35 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="flex flex-col items-start">
                <span className="text-[0.65rem] xl:text-[0.7rem] font-semibold uppercase tracking-widest text-foreground/35 leading-none mb-0.5">
                  Upgrade to Pro
                </span>
                <span className="text-sm xl:text-[15px] font-bold text-foreground/50 leading-none">
                  Coming Soon
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}