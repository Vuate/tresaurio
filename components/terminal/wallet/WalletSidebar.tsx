"use client";

import { useState } from "react";
import WatchlistSection from "./WatchlistSection";

export default function WalletSidebar() {
  const [activeItem, setActiveItem] = useState("Whale"); // ✅ default seçili

  return (
    <aside className=" fixed left-0 top-0 z-40 w-[240px] h-full overflow-y-auto border-r border-white/10 bg-[#041f20] p-5 transition-transform md:static md:translate-x-0">

      <div className="mb-7">
        <div className="mb-3 text-[12px] font-bold uppercase tracking-wide text-gray-400">
          🧭 İzlenen Cüzdanlar
        </div>

        <SidebarItem label="Whale" count={42} dot active={activeItem === "Whale"} onClick={() => setActiveItem("Whale")} />
        <SidebarItem label="Exchange Hot" count={128} dot active={activeItem === "Exchange Hot"} onClick={() => setActiveItem("Exchange Hot")} />
        <SidebarItem label="Exchange Cold" count={8} active={activeItem === "Exchange Cold"} onClick={() => setActiveItem("Exchange Cold")} />
        <SidebarItem label="Kurumsal / Fon" count={15} dot active={activeItem === "Kurumsal / Fon"} onClick={() => setActiveItem("Kurumsal / Fon")} />
        <SidebarItem label="Kamu Cüzdanları" count={6} active={activeItem === "Kamu Cüzdanları"} onClick={() => setActiveItem("Kamu Cüzdanları")} />
        <SidebarItem label="Kullanıcı Eklendi" count={12} dot active={activeItem === "Kullanıcı Eklendi"} onClick={() => setActiveItem("Kullanıcı Eklendi")} />
      </div>

      <WatchlistSection activeItem={activeItem} onSelect={setActiveItem} />
    </aside>
  );
}

/* ================= ITEM ================= */

function SidebarItem({
  label,
  count,
  dot,
  active,
  onClick,
}: {
  label: string;
  count: number;
  dot?: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition
        ${active ? "border-teal-400 bg-teal-400/10" : "border-white/10 bg-white/5 hover:border-teal-400/40 hover:bg-white/10"}`}
    >
      <div className={`h-2 w-2 rounded-full ${dot ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
      <div className="flex-1 text-[13px] font-medium text-gray-200">{label}</div>
      <div className="rounded border border-teal-400/30 bg-teal-400/10 px-2 py-[2px] text-[10px] font-bold text-teal-300">
        {count}
      </div>
    </div>
  );
}
