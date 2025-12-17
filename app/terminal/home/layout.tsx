export default function TerminalHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-h-screen overflow-y-auto">
      <div className="px-6 py-6 space-y-12">{children}</div>
    </div>
  );
}
