"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";

// Dynamic imports to prevent SSR issues with browser-only APIs
const TopBar = dynamic(() => import("@/components/terminal/personalized-dashboard/TopBar"), { ssr: false });
const AddToolPanel = dynamic(() => import("@/components/terminal/personalized-dashboard/AddToolPanel"), { ssr: false });
const Canvas = dynamic(() => import("@/components/terminal/personalized-dashboard/Canvas"), { ssr: false });
const WorkspaceControls = dynamic(() => import("@/components/terminal/personalized-dashboard/WorkspaceControls"), { ssr: false });
const NotesPanel = dynamic(() => import("@/components/terminal/personalized-dashboard/NotesPanel"), { ssr: false });
const AlertObserver = dynamic(() => import("@/components/terminal/personalized-dashboard/AlertObserver"), { ssr: false });
const PortfolioObserver = dynamic(() => import("@/components/terminal/personalized-dashboard/PortfolioObserver"), { ssr: false });
const TemplatePanel = dynamic(() => import("@/components/terminal/personalized-dashboard/TemplatePanel"), { ssr: false });

export default function Page() {
  const loadFromDB = usePersonalizedDashboardStore((s) => s.loadFromDB);

  useEffect(() => {
    loadFromDB();
  }, [loadFromDB]);
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#041F20]">
      <PortfolioObserver />
      <AlertObserver />
      <TopBar />
      <AddToolPanel />
      <TemplatePanel />
      <Canvas />

      <WorkspaceControls />
      <NotesPanel />
    </div>
  );
}
