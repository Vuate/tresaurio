import Navbar from "@/components/landing/navbar/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { WhoIsItForSection } from "@/components/landing/WhoIsItForSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { WhyTreasurioSection } from "@/components/landing/WhyTreasurioSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { EarlyAccessSection } from "@/components/landing/EarlyAccessSection";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTopButton } from "@/components/landing/ScrollToTopButton";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DashboardPreviewSection />
        <WhoIsItForSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <WhyTreasurioSection />
        <TeamSection />
        <EarlyAccessSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
