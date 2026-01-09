import Link from "next/link";

export default function MarketIntelligenceCTA() {
  return (
    <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 rounded-3xl p-16 text-center border border-teal-500/30 mt-20">
      {/* CTA Title */}
      <h2 className="text-4xl font-extrabold mb-4">
        Trading Maliyetlerinizi Optimize Edin
      </h2>

      {/* CTA Description */}
      <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
        Gerçek trading maliyetini hesaplayın, exchange'leri karşılaştırın ve her
        trade'de en ucuz seçeneği kullanarak yıllık binlerce dolar tasarruf edin.
      </p>

      {/* CTA Button */}
      <Link
        href="/personalized-dashboard"
        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-teal-400 to-teal-600 text-[#031A1C] text-lg font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(25,216,208,0.4)]"
      >
        <span>Personalized Pano'a Git</span>
        <span>→</span>
      </Link>
    </div>
  );
}