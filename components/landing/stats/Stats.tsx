"use client";

export default function Stats() {
  return (
    <section className="bg-[#031a1c] px-6 pt-20 py-20">
      <div
        className="
          mx-auto grid max-w-[1200px] grid-cols-4 gap-8
          max-[900px]:grid-cols-2
          max-[480px]:grid-cols-1

          /* LAPTOP OPTİK DENGE – MİKRO FIX */
          min-[1280px]:pr-10
          min-[1536px]:pr-0
        "
      >
        <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-12 text-center backdrop-blur-md">
          <h3 className="mb-3 text-[48px] font-extrabold text-[#19d8d0]">
            15M+
          </h3>
          <p className="text-base text-gray-200 opacity-90">
            API Calls / Day
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-12 text-center backdrop-blur-md">
          <h3 className="mb-3 text-[48px] font-extrabold text-[#19d8d0]">
            25+
          </h3>
          <p className="text-base text-gray-200 opacity-90">
            Connected Exchanges
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-12 text-center backdrop-blur-md">
          <h3 className="mb-3 text-[48px] font-extrabold text-[#19d8d0]">
            250+
          </h3>
          <p className="text-base text-gray-200 opacity-90">
            Trading Pairs Tracked
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/2 p-12 text-center backdrop-blur-md">
          <h3 className="mb-3 text-[48px] font-extrabold text-[#19d8d0]">
            99.9%
          </h3>
          <p className="text-base text-gray-200 opacity-90">
            Uptime Guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
