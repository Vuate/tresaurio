export default function StakingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-6">
      {children}
    </div>
  );
}
