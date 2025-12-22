export default function StatCard({
  label,
  value,
  change,
  positive,
}: any) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041f20]/95 p-5">
      {/* LABEL */}
      <div className="text-sm text-gray-400 mb-2">
        {label}
      </div>

      {/* VALUE */}
      <div className="text-2xl font-bold text-white mb-1">
        {value}
      </div>

      {/* CHANGE */}
      <div
        className={`text-sm ${
          positive ? "text-emerald-400" : "text-gray-400"
        }`}
      >
        {positive && "↑ "}
        {change}
      </div>
    </div>
  );
}
