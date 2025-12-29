import TopBar from "@/components/terminal/personalized-dashboard/TopBar";
import AddToolPanel from "@/components/terminal/personalized-dashboard/AddToolPanel";
import Canvas from "@/components/terminal/personalized-dashboard/Canvas";
import WorkspaceControls from "@/components/terminal/personalized-dashboard/WorkspaceControls";
import NotesPanel from "@/components/terminal/personalized-dashboard/NotesPanel";

export default function Page() {
  return (
    <>
      <TopBar />
      <AddToolPanel />
      <Canvas />

      <WorkspaceControls />
      <NotesPanel />
    </>
  );
}
