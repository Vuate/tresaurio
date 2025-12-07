import Navbar from "@/components/navbar/Navbar";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#0a0b0f]">
      {/* Navbar her terminal sayfasında gözüksün */}
      <Navbar />

      {/* Aşağıdaki boşluk navbar yüksekliğini dengeler */}
      <div className="pt-24 px-6">{children}</div>
    </div>
  );
}
