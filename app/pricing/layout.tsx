import Navbar from "@/components/landing/navbar/Navbar";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#031A1C]">
      <Navbar />

      <div className="pt-16 xl:pt-18 2xl:pt-20 px-4 xl:px-5 2xl:px-6">
        {children}
      </div>
    </div>
  );
}