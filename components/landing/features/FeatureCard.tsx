"use client";

export default function FeatureCard({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div className="rounded-[20px] bg-white/4 p-8">
      <div className="text-[32px]">{icon}</div>

      <h3 className="mt-4 mb-2 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="text-slate-300">
        Professional-grade tools designed for high performance trading.
      </p>
    </div>
  );
}
