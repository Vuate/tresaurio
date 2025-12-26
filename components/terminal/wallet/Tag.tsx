export default function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-teal-400/30 bg-teal-400/10 px-2 py-1 text-[11px] font-bold text-teal-300">
      {label}
    </span>
  );
}
