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

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full 
        max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl 
        mx-auto 
        px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
        py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14
      ">
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
