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

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full 
        max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl 
        mx-auto 
        px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
        py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14
      ">
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
