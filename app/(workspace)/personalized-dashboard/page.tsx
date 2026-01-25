import TopBar from "@/components/terminal/personalized-dashboard/TopBar";
import AddToolPanel from "@/components/terminal/personalized-dashboard/AddToolPanel";
import Canvas from "@/components/terminal/personalized-dashboard/Canvas";
import WorkspaceControls from "@/components/terminal/personalized-dashboard/WorkspaceControls";
import NotesPanel from "@/components/terminal/personalized-dashboard/NotesPanel";
import AlertObserver from "@/components/terminal/personalized-dashboard/AlertObserver";
import PortfolioObserver from "@/components/terminal/personalized-dashboard/PortfolioObserver";

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
