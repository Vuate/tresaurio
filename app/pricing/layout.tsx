import Navbar from "@/components/landing/navbar/Navbar";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full bg-[#031A1C]"
      style={{
        ["--topbar-height" as any]: "80px",
      }}
    >
      <Navbar />

      {/* ✅ Tek kaynak kullanımı */}
      <div className="pt-[var(--topbar-height)] px-6">
        {children}
      </div>
    </div>
  );
}

