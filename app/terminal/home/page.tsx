import Header from "@/components/terminal/home/Header";
import LivePrices from "@/components/terminal/home/LivePrices";
import QuickStats from "@/components/terminal/home/QuickStats";
import Movers from "@/components/terminal/home/Movers";
import FearGreed from "@/components/terminal/home/FearGreed";
import FreeTierBanner from "@/components/terminal/home/FreeTierBanner";

export default function TerminalHome() {
  return (
    <>
      <Header />
      <LivePrices />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2">
          <QuickStats />
        </div>
        <FearGreed />
      </div>

      <Movers />
      <FreeTierBanner />
    </>
  );
}
