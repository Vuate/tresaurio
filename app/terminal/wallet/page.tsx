import WalletHero from "@/components/terminal/wallet/WalletHero";
import WalletFeatures from "@/components/terminal/wallet/WalletFeatures";
import WalletPatterns from "@/components/terminal/wallet/WalletPatterns";
import WalletTransferFeed from "@/components/terminal/wallet/WalletTransferFeed";
import WalletHowItWorks from "@/components/terminal/wallet/WalletHowItWorks";
import WalletCTA from "@/components/terminal/wallet/WalletCTA";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* Hero Section */}
      <WalletHero />

      {/* Main Container */}
  <div className="max-w-9xl mx-auto px-6 py-16">
        {/* Ana Özellikler */}
        <WalletFeatures />

        {/* Smart Money Patterns */}
        <WalletPatterns />

        {/* Transfer Feed Örneği */}
        <WalletTransferFeed />

        {/* Nasıl Çalışır */}
        <WalletHowItWorks />

        {/* CTA */}
        <WalletCTA />
      </div>
    </div>
  );
}