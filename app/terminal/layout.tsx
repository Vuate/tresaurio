import Navbar from "@/components/landing/navbar/Navbar";
import Sidebar from "@/components/terminal/layout/Sidebar";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white pt-20">
      <Navbar />
      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar />
        <div className="flex-1 bg-[#0a0b0f]">{children}</div>
      </div>
    </div>
  );
}
