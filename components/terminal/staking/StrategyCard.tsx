interface StrategyCardProps {
  icon: string | React.ReactNode;
  title: string;
  subtitle: string;
  recommendation: string;
}

export default function StrategyCard({
  icon,
  title,
  subtitle,
  recommendation,
}: StrategyCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-teal-300/40 transition">
      <div className="flex gap-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
      </div>

      <div className="text-sm">
        <div className="text-xs text-gray-400 mb-1">Öneri</div>
        <div className="text-gray-200">{recommendation}</div>
      </div>
    </div>
  );
}
