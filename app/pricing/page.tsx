import ComparisonTable from "@/components/pricing/ComparisonTable";
import { Footer } from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <section className="w-full px-4 xl:px-6 pb-24 flex-1">
        <ComparisonTable />
      </section>
      <Footer />
    </main>
  );
}
