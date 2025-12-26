import Navbar from "@/components/landing/navbar/Navbar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}
