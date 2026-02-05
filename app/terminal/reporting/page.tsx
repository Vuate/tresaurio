import ReportingHero from "@/components/terminal/reporting/ReportingHero";
import ReportingCategories from "@/components/terminal/reporting/ReportingCategories";
import ReportingFeatures from "@/components/terminal/reporting/ReportingFeatures";
import ReportingExample from "@/components/terminal/reporting/ReportingExample";
import ReportingCTA from "@/components/terminal/reporting/ReportingCTA";

export default function ReportingPage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      <ReportingHero />

      <div className="w-full mx-auto px-6 py-8">
        <ReportingCategories />
        <ReportingFeatures />
        <ReportingExample />
        <ReportingCTA />
      </div>
    </div>
  );
}
