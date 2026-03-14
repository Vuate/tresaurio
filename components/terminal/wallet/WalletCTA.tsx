import Link from "next/link";

export default function WalletCTA() {
  return (
    <div
      className="
        cta-section
        mt-10 sm:mt-12 lg:mt-14 xl:mt-16 2xl:mt-18
        rounded-xl sm:rounded-2xl lg:rounded-3xl
        border border-teal-500/30
        bg-[#041F20]/95
        px-6 sm:px-8 lg:px-10 xl:px-12
        py-10 sm:py-12 lg:py-14 xl:py-16
        text-center
      "
    >
      <h2 className="cta-title text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-white mb-2 sm:mb-3 lg:mb-4">
        Track Smart Money
      </h2>

      <p className="cta-description mx-auto mt-2 sm:mt-3 lg:mt-4 xl:mt-5 max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed text-gray-300 px-4 mb-5 sm:mb-6 lg:mb-7 xl:mb-8">
        Monitor whale movements in real-time, identify smart money patterns, and stay one step ahead in the market.
      </p>

      <Link
        href="/personalized-dashboard"
        className="
          cta-button
          inline-flex items-center gap-2 sm:gap-2.5 lg:gap-3
          rounded-lg sm:rounded-xl lg:rounded-2xl
          bg-[#1A73E8]
          px-5 sm:px-6 lg:px-7 xl:px-8
          py-2.5 sm:py-3 lg:py-3.5 xl:py-4
          text-sm sm:text-base lg:text-lg xl:text-xl
          font-bold
          text-white
          transition-all duration-300
          hover:-translate-y-[3px]
        "
      >
        <span>Go to Personalized Dashboard</span>
        <span className="text-base sm:text-lg lg:text-xl xl:text-2xl">→</span>
      </Link>
    </div>
  );
}
