import Navbar from "@/components/landing/navbar/Navbar";
import Hero from "@/components/landing/hero/Hero";
import Connect from "@/components/landing/connect/Connect";
import ComparisonTable from "@/components/landing/pricing/ComparisonTable";

export default function Home() {
  return (
    <main className="bg-[#031A1C] w-full">
      <Navbar />
      <Hero />
      <ComparisonTable />
      <Connect />
    </main>
  );
}
