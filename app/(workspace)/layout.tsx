export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen bg-[#031A1C] overflow-hidden">
      {children}
    </div>
  );
}
