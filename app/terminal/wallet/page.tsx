import WalletHero from "@/components/terminal/wallet/WalletHero";
import WalletFeatures from "@/components/terminal/wallet/WalletFeatures";
import WalletPatterns from "@/components/terminal/wallet/WalletPatterns";
import WalletTransferFeed from "@/components/terminal/wallet/WalletTransferFeed";
import WalletHowItWorks from "@/components/terminal/wallet/WalletHowItWorks";
import WalletCTA from "@/components/terminal/wallet/WalletCTA";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <WalletHero />

      <div className="w-full mx-auto px-3 sm:px-6 py-8">
        <WalletFeatures />
        <WalletPatterns />
        <WalletTransferFeed />
        <WalletHowItWorks />
        <WalletCTA />
      </div>
    </div>
  );
}
