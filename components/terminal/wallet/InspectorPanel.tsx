"use client";

import { useState } from "react";

import WalletSummarySection from "./WalletSummarySection";
import WalletTagsSection from "./WalletTagsSection";
import WalletActivitySection from "./WalletActivitySection";
import WalletActionsSection from "./WalletActionsSection";

export default function InspectorPanel({ onAlertClick }: { onAlertClick?: () => void }) {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`w-[360px] shrink-0 h-full overflow-y-auto border-l border-white/10 bg-[#041f20] p-5 transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="text-[16px] font-bold">Cüzdan Detayı</div>
        <button onClick={() => setOpen(false)}>×</button>
      </div>

      <WalletSummarySection />
      <WalletTagsSection />
      <WalletActivitySection />
      <WalletActionsSection onAlertClick={onAlertClick} />
    </aside>
  );
}