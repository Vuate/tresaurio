import Navbar from "@/components/landing/navbar/Navbar";
import Sidebar from "@/components/terminal/layout/Sidebar";
import { ScrollRestorer } from "@/components/terminal/layout/ScrollRestorer";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-route="terminal" className="min-h-screen bg-background text-foreground">
      <ScrollRestorer />
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] pt-11 md:pt-16">
        <div className="shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-x-auto">
<main className="min-w-full bg-background relative pt-4 sm:pt-6 md:pt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}