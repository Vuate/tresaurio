"use client";

import { useState } from "react";
import WalletTopBar from "@/components/terminal/wallet/WalletTopBar";
import WalletSidebar from "@/components/terminal/wallet/WalletSidebar";
import InspectorPanel from "@/components/terminal/wallet/InspectorPanel";
import AlertModal from "@/components/terminal/wallet/AlertModal";
import AddWalletModal from "@/components/terminal/wallet/AddWalletModal";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [addWalletOpen, setAddWalletOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#031a1c] text-white">
      <WalletTopBar
        onAlertClick={() => setAlertOpen(true)}
        onAddWalletClick={() => setAddWalletOpen(true)}
      />

      <div className="flex min-h-[calc(100vh-61px)]">
        <WalletSidebar />
        <main className="flex-1 overflow-y-auto bg-[#031a1c]">
          {children}
        </main>
        <InspectorPanel />
      </div>

      <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />
      <AddWalletModal
        open={addWalletOpen}
        onClose={() => setAddWalletOpen(false)}
      />
    </div>
  );
}
