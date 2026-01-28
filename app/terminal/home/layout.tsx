export default function TerminalHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-h-screen overflow-y-auto">
      <div className="px-4 xl:px-5 2xl:px-6 py-4 xl:py-5 2xl:py-6 space-y-10 xl:space-y-11 2xl:space-y-12">
        {children}
      </div>
    </div>
  );
}