interface SectionHeadProps {
  label: string;
  title: string;
  sub?: string;
  center?: boolean;
}

export function SectionHead({ label, title, sub, center }: SectionHeadProps) {
  const align = center ? "text-center items-center" : "";
  return (
    <div className={`flex flex-col gap-3 mb-12 ${align}`}>
      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-brand">
        {label}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
        {title}
      </h2>
      {sub && (
        <p className="text-base text-muted-foreground max-w-[600px] leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}
