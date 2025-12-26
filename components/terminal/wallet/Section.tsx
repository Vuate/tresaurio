export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-[12px] font-bold uppercase tracking-wide text-gray-400">
        {title}
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        {children}
      </div>
    </div>
  );
}
