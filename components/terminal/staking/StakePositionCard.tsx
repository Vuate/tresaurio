"use client";

interface StakePositionCardProps {
  icon: string | React.ReactNode;
  title: string;
  platform: string;
  apr: string;
  items: [string, string | number][];
}

export default function StakePositionCard({
  icon,
  title,
  platform,
  apr,
  items,
}: StakePositionCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-teal-300/40">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-teal-600 text-lg">
            {icon}
          </div>
          <div>
            <div className="font-bold">{title}</div>
            <div className="text-sm text-gray-400">{platform}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400">APR</div>
          <div className="text-xl font-mono font-bold text-emerald-400">
            {apr}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
        {items.map((i, idx) => (
          <div key={idx}>
            <div className="text-xs text-gray-400">{i[0]}</div>
            <div className="font-semibold">{i[1]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
