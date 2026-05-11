import Navbar from "@/components/landing/navbar/Navbar";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <div className="pt-16 xl:pt-18 2xl:pt-20">
        {children}
      </div>
    </div>
  );
}
