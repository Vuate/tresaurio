"use client";

import Sidebar from "@/components/terminal/dashboard/Sidebar";
import Topbar from "@/components/terminal/dashboard/Topbar";
import Watchlist from "@/components/terminal/dashboard/Watchlist";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-[#0a0b0f] text-white">
      {/* <Sidebar /> */}

      {/*  WATCHLIST  */}
      <div className="w-[300px] border-r border-white/10 bg-[#0d0f14] p-4">
        <Watchlist />
      </div>

      {/* ANA DASHBOARD (widget grid + topbar) */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-6 space-y-8">{children}</main>
      </div>
    </div>
  );
}
