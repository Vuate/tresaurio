import { Button } from "@/components/ui/button";
import Globe from "@/components/globe/Globe";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Başlık */}
      <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight z-10">
        Manage your treasury with Treasurio
        <br />
        with <span className="text-teal-400">Treasurio</span>
      </h1>

      {/* Açıklama */}
      <p className="mt-4 max-w-xl text-gray-300 z-10">
        A high-performance trading terminal that doesn’t slow you down.
      </p>

      {/* CTA Buttons */}
      <div className="mt-6 flex gap-4 z-10">
        <Button className="bg-teal-400 text-black hover:bg-teal-300">
          START TRADING FOR FREE
        </Button>
        <Button variant="outline" className="text-black-200 border-gray-400">
          LEARN HOW TO TRADE
        </Button>
      </div>

      {/* YAZILAR İLE DÜNYA ARASINA BOŞLUK EKLEDİK */}
      <div className="h-[140px] z-10" />

      {/* Globe Animation */}
      <div className="absolute bottom-[-260px] left-1/2 -translate-x-1/2 z-0 scale-[0.9] opacity-90">
        <Globe />
      </div>

      {/* Alt Gradient */}
      <div className="absolute bottom-[-40px] w-full h-[220px] bg-gradient-to-b from-transparent/0 to-[#06302f]/100" />
    </section>
  );
}
