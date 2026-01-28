export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-[#031A1C] overflow-auto">
      {children}
    </div>
  );
}