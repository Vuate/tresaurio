"use client";

import dynamic from "next/dynamic";

// Dynamic imports to prevent SSR issues with browser-only APIs
const TopBar = dynamic(() => import("@/components/terminal/personalized-dashboard/TopBar"), { ssr: false });
const AddToolPanel = dynamic(() => import("@/components/terminal/personalized-dashboard/AddToolPanel"), { ssr: false });
const Canvas = dynamic(() => import("@/components/terminal/personalized-dashboard/Canvas"), { ssr: false });
const WorkspaceControls = dynamic(() => import("@/components/terminal/personalized-dashboard/WorkspaceControls"), { ssr: false });
const NotesPanel = dynamic(() => import("@/components/terminal/personalized-dashboard/NotesPanel"), { ssr: false });
const AlertObserver = dynamic(() => import("@/components/terminal/personalized-dashboard/AlertObserver"), { ssr: false });
const PortfolioObserver = dynamic(() => import("@/components/terminal/personalized-dashboard/PortfolioObserver"), { ssr: false });

export default function Page() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#041F20]">
      <PortfolioObserver />
      <AlertObserver />
      <TopBar />
      <AddToolPanel />
      <Canvas />

      <WorkspaceControls />
      <NotesPanel />
    </div>
  );
}
