import Navbar from "@/components/landing/navbar/Navbar";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#031A1C]">
      {/* Navbar pricing sayfasında gözüksün */}
      <Navbar />

      {/* Navbar yüksekliği için boşluk */}
      <div className="pt-24 px-6">
        {children}
      </div>
    </div>
  );
}



