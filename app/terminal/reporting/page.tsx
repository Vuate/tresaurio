import ReportingHero from "@/components/terminal/reporting/ReportingHero";
import ReportingCategories from "@/components/terminal/reporting/ReportingCategories";
import ReportingFeatures from "@/components/terminal/reporting/ReportingFeatures";
import ReportingExample from "@/components/terminal/reporting/ReportingExample";
import ReportingCTA from "@/components/terminal/reporting/ReportingCTA";

export default function ReportingPage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* Hero Section */}
      <ReportingHero />

      {/* Main Container */}
      <div className="max-w-9xl mx-auto px-6 py-16">
        {/* 8 Rapor Kategorisi */}
        <ReportingCategories />

        {/* Öne Çıkan Özellikler */}
        <ReportingFeatures />

        {/* Örnek Rapor Görünümü */}
        <ReportingExample />

        {/* CTA */}
        <ReportingCTA />
      </div>
    </div>
  );
}