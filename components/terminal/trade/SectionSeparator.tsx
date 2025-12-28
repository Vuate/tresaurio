interface SectionSeparatorProps {
  icon: string;
  title: string;
  variant?: 'cyan' | 'pink';
}

export default function SectionSeparator({ icon, title, variant = 'cyan' }: SectionSeparatorProps) {
  const gradientClasses = {
    cyan: 'from-slate-800/50 via-slate-700/50 to-slate-800/50 border-slate-700/50',
    pink: 'from-red-500/12 via-purple-500/12 to-red-500/12 border-red-500/25',
  };

  const titleClasses = {
    cyan: 'text-cyan-400',
    pink: 'bg-gradient-to-br from-red-500 to-purple-500 bg-clip-text text-transparent',
  };

  return (
    <div className={`bg-gradient-to-r ${gradientClasses[variant]} border rounded-xl p-6`}>
      <h2 className={`text-2xl font-extrabold text-center flex items-center justify-center gap-3 ${titleClasses[variant]}`}>
        <span className="text-3xl">{icon}</span>
        {title}
      </h2>
    </div>
  );
}