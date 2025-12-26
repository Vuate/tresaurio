"use client";

import { useState } from "react";
import WalletTopBar from "@/components/terminal/wallet/WalletTopBar";
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
    <div className="flex h-full flex-col bg-[#031a1c] text-white">
      
      {/* TOP BAR */}
      <WalletTopBar
        onAlertClick={() => setAlertOpen(true)}
        onAddWalletClick={() => setAddWalletOpen(true)}
      />

      {/* BODY */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* PAGE CONTENT (Wallet page kendi içinde sidebar açacak) */}
        <main className="flex-1 min-w-0 overflow-hidden">
          {children}
        </main>

        {/* RIGHT – INSPECTOR */}
        <InspectorPanel onAlertClick={() => setAlertOpen(true)} />
      </div>

      {/* MODALS */}
      <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />
      <AddWalletModal
        open={addWalletOpen}
        onClose={() => setAddWalletOpen(false)}
      />
    </div>
  );
}
