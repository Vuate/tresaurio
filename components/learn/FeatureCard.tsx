export default function FeatureCard({
  icon,
  title,
  desc,
  tags,
}: {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-[#041F20]/95 p-7 transition hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-[0_8px_32px_rgba(25,216,208,0.15)]">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-400/10 text-2xl">
        {icon}
      </div>

      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{desc}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
