import Link from "next/link";

export default function TradeCTA() {
  return (
    <div
      className="
        cta-section
        mt-24
        rounded-[24px]
        border border-teal-400/30
        bg-[linear-gradient(135deg,rgba(25,216,208,0.1),rgba(14,168,158,0.05))]
        px-12 py-16
        text-center
      "
    >
      {/* TITLE */}
      <h2 className="cta-title text-[36px] font-extrabold text-white">
        Portföyünüzü Profesyonel Şekilde Yönetin
      </h2>

      {/* DESCRIPTION */}
      <p className="cta-description mx-auto mt-4 max-w-[600px] text-[18px] leading-relaxed text-gray-300">
        Tüm spot ve futures pozisyonlarınızı tek bir panoda görüntüleyin, PnL
        takibi yapın ve risk yönetimi ile portföyünüzü optimize edin.
      </p>

      {/* BUTTON */}
      <Link
        href="/personalized-dashboard"
        className="
          cta-button
          mt-8 inline-flex items-center gap-3
          rounded-xl
          bg-[linear-gradient(135deg,#19D8D0,#0ea89e)]
          px-8 py-4
          text-[18px] font-bold
          text-[#031A1C]
          transition-all duration-300
          hover:-translate-y-[2px]
          hover:shadow-[0_12px_32px_rgba(25,216,208,0.4)]
        "
      >
        <span>Kişiselleştirilmiş Pano&apos;ya Git</span>
        <span className="text-xl">→</span>
      </Link>
    </div>
  );
}
