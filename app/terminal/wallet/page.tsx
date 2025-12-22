"use client";

import { useState } from "react";

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
    <>
      <LiveFeed onAlertClick={() => setAlertOpen(true)} />
      <InsightCards />
      <TokenTable onAddTokenClick={() => setAddTokenOpen(true)} />
      <SmartMoneyPanel />

      <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />
      <AddTokenModal open={addTokenOpen} onClose={() => setAddTokenOpen(false)} />
    </>
  );
}
