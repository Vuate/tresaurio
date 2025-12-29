"use client";

type StatusType = "active" | "locked";

interface StatusBadgeProps {
  children: React.ReactNode;
  type: StatusType;
}

export default function StatusBadge({ children, type }: StatusBadgeProps) {
  const map: Record<StatusType, string> = {
    active: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
    locked: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  };

  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${map[type]}`}>
      {children}
    </span>
  );
}
