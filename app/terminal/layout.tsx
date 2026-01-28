import Navbar from "@/components/landing/navbar/Navbar";
import Sidebar from "@/components/terminal/layout/Sidebar";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      <Navbar />

      <div className="flex min-h-[calc(100vh-64px)] pt-16">
        {/* 🔒 SIDEBAR – SABİT, SCROLL'A DAHİL DEĞİL */}
        <div className="shrink-0">
          <Sidebar />
        </div>

        {/* 👉 SADECE CONTENT SCROLL EDİLEBİLİR */}
        <div className="flex-1 overflow-x-auto">
          {/* ✅ min-w-[1400px] yerine min-w-full kullan */}
          {/* ✅ Padding yok, boş alan kalmaz */}
          <main className="min-w-full bg-[#0a0b0f] relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}