import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Navbar from "@/components/landing/navbar/Navbar";
import Hero from "@/components/landing/hero/Hero";
import Features from "@/components/landing/features/Features";
import ExchangeFlow from "@/components/landing/exchange/ExchangeFlow";
import Stats from "@/components/landing/stats/Stats";
import Footer from "@/components/landing/footer/Footer";
import TickerBar from "@/components/landing/ticker/TickerBar";

export default async function Page() {
  const session = await auth();

  if (session?.user) {
    redirect("/terminal/home");
  }

  return (
    <>
      <Navbar />
      <Hero />
      <TickerBar />
      <Features />
      <ExchangeFlow />
      <Stats />
      <Footer />
    </>
  );
}
