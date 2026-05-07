import ComparisonTable from "@/components/pricing/ComparisonTable";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="w-full px-4 xl:px-6 pb-24">
        <ComparisonTable />
      </section>
    </main>
  );
}
