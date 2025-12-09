import CoverageOverview from "./components/CoverageOverview";
import ActiveWatchlistSummary from "./components/ActiveWatchlistSummary"; // YENİ KOMPONENT
import StatsOverview from "./components/StatsOverview";
import ActiveAlerts from "./components/ActiveAlerts";
import LiquidityTable from "./components/LiquidityTable";
import SystemStatus from "./components/SystemStatus";
import MarketComparison from "./components/MarketComparison";
import NewsSection from "./components/NewsSection";
import DataQuality from "./components/DataQuality";
import NetFlow from "./components/NetFlow";
import ActiveAssets from "./components/ActiveAssets";
import WalletMovements from "./components/WalletMovements";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* ROW 1 — Coverage + Active Watchlist */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CoverageOverview />
        <ActiveWatchlistSummary />
      </div>

      {/* ROW 2 — Stats + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StatsOverview />
        <ActiveAlerts />
      </div>

      {/* ROW 3 — Liquidity + System Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LiquidityTable />
        <SystemStatus />
      </div>

      {/* ROW 4 — Market Comparison */}
      <MarketComparison />

      {/* ROW 5 — Data Quality, Netflow, Active Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataQuality />
        <NetFlow />
        <ActiveAssets />
      </div>

      {/* ROW 6 — Wallets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <WalletMovements />
      </div>

      {/* ROW 7 — News */}
      <NewsSection />
    </div>
  );
}
