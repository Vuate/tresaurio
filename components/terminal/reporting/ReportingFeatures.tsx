import { Icon } from "@iconify/react";

const features = [
  {
    icon: "mdi:database-sync-outline",
    title: "Automatic Data Collection",
    description: "All data is collected automatically. Exchange APIs, blockchain data, and news sources are brought together to prepare your report.",
    variant: "blue" as const,
  },
  {
    icon: "mdi:palette-outline",
    title: "Custom Templates",
    description: "Create your own report template. Customize which modules to include, their order, and visual layout.",
    variant: "neutral" as const,
  },
  {
    icon: "mdi:calendar-clock-outline",
    title: "Scheduled Reports",
    description: "Daily, weekly, or monthly automated reports. Automatic email delivery or PDF export support.",
    variant: "neutral" as const,
  },
  {
    icon: "mdi:brain",
    title: "AI-Powered Insights",
    description: "AI-generated insights in every module. Anomaly detection, trend spotting, and actionable recommendations.",
    variant: "blue" as const,
  },
  {
    icon: "mdi:chart-multiple",
    title: "Visual Charts",
    description: "Visual charts for every metric. Line charts, bar charts, pie charts, and heatmaps are automatically generated.",
    variant: "neutral" as const,
  },
  {
    icon: "mdi:file-export-outline",
    title: "Export Options",
    description: "Export in PDF, Excel, and CSV formats. Share or archive your reports.",
    variant: "neutral" as const,
  },
];

export default function ReportingFeatures() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Capabilities
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Key Features
        </h2>
        <p className="text-[#71717A] max-w-xl text-[0.875rem] leading-[1.7]">
          Capabilities that power the Reporting Engine
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
        {features.map((feature, i) => (
          <div
            key={i}
            className={[
              "rounded-xl p-7 border transition-all duration-250",
              "hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)]",
              feature.variant === "blue"
                ? "border-[#2563EB]/20"
                : "bg-card border-border-sub",
            ].join(" ")}
            style={
              feature.variant === "blue"
                ? { background: "linear-gradient(145deg, rgba(37,99,235,0.08) 0%, var(--card) 60%)" }
                : undefined
            }
          >
            <div
              className={[
                "w-10.5 h-10.5 rounded-[10px] flex items-center justify-center mb-4",
                feature.variant === "blue"
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "bg-input text-[#71717A]",
              ].join(" ")}
            >
              <Icon icon={feature.icon} className="text-xl" />
            </div>
            <h3 className="text-[0.95rem] font-bold text-foreground mb-2">{feature.title}</h3>
            <p className="text-[0.845rem] text-[#71717A] leading-[1.65]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
