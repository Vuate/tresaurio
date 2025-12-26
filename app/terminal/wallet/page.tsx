"use client";

import { useState } from "react";

import WalletSidebar from "@/components/terminal/wallet/WalletSidebar";
import LiveFeed from "@/components/terminal/wallet/LiveFeed";
import InsightCards from "@/components/terminal/wallet/InsightCards";
import TokenTable from "@/components/terminal/wallet/TokenTable";
import SmartMoneyPanel from "@/components/terminal/wallet/SmartMoneyPanel";
import AlertModal from "@/components/terminal/wallet/AlertModal";
import AddTokenModal from "@/components/terminal/wallet/AddTokenModal";

export default function WalletPage() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [addTokenOpen, setAddTokenOpen] = useState(false);

  return (
    <div className="relative h-full min-h-0">
      {/* 🔒 WALLET SIDEBAR – FLEX'E GİRMEZ */}
      <div className="absolute left-0 top-0 h-full">
        <WalletSidebar />
      </div>

      {/* 📌 CONTENT – SIDEBAR KADAR OFFSET */}
      <div className="ml-[240px] h-full overflow-y-auto px-4">
        <LiveFeed onAlertClick={() => setAlertOpen(true)} />
        <InsightCards />

        <TokenTable
          onAddTokenClick={() => setAddTokenOpen(true)}
          onAlertClick={() => setAlertOpen(true)}
        />

        <SmartMoneyPanel />
      </div>

      {/* MODALS */}
      <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />
      <AddTokenModal open={addTokenOpen} onClose={() => setAddTokenOpen(false)} />
    </div>
  );
}
