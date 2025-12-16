import CoverageOverview from "@/components/terminal/dashboard/CoverageOverview";
import ActiveWatchlistSummary from "@/components/terminal/dashboard/ActiveWatchlistSummary"; // YENŽø KOMPONENT
import StatsOverview from "@/components/terminal/dashboard/StatsOverview";
import ActiveAlerts from "@/components/terminal/dashboard/ActiveAlerts";
import LiquidityTable from "@/components/terminal/dashboard/LiquidityTable";
import SystemStatus from "@/components/terminal/dashboard/SystemStatus";
import MarketComparison from "@/components/terminal/dashboard/MarketComparison";
import NewsSection from "@/components/terminal/dashboard/NewsSection";
import DataQuality from "@/components/terminal/dashboard/DataQuality";
import NetFlow from "@/components/terminal/dashboard/NetFlow";
import ActiveAssets from "@/components/terminal/dashboard/ActiveAssets";
import WalletMovements from "@/components/terminal/dashboard/WalletMovements";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ROW 1 ƒ?" Coverage + Active Watchlist */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CoverageOverview />
        <ActiveWatchlistSummary />
      </div>

      {/* ROW 2 ƒ?" Stats + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StatsOverview />
        <ActiveAlerts />
      </div>

      {/* ROW 3 ƒ?" Liquidity + System Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LiquidityTable />
        <SystemStatus />
      </div>

      {/* ROW 4 ƒ?" Market Comparison */}
      <MarketComparison />

      {/* ROW 5 ƒ?" Data Quality, Netflow, Active Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataQuality />
        <NetFlow />
        <ActiveAssets />
      </div>

      {/* ROW 6 ƒ?" Wallets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <WalletMovements />
      </div>

      {/* ROW 7 ƒ?" News */}
      <NewsSection />
    </div>
  );
}
