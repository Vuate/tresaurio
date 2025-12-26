export default function InfoRow({
  label,
  value,
  valueColor = "text-white",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between border-b border-white/10 py-2 text-[12px] last:border-b-0">
      <span className="text-gray-400">{label}</span>
      <span className={`font-mono font-semibold ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}
