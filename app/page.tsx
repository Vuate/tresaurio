import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Connect from "@/components/connect/Connect";

export default function Home() {
  return (
    <main className="bg-[#031A1C] w-full">
      <Navbar />
      <Hero />
      <Connect />
    </main>
  );
}
