const metrics = [
  { label: "Total Portfolio", value: "$124,567", color: "text-foreground" },
  { label: "24h Change", value: "+$3,245", color: "text-emerald-400" },
  { label: "Unrealized PnL", value: "+$12,890", color: "text-emerald-400" },
  { label: "Total Fees (24h)", value: "$89", color: "text-[#71717A]" },
  { label: "Best Performer", value: "SOL +12.4%", color: "text-[#2563EB]" },
  { label: "Market Sentiment", value: "Bullish", color: "text-emerald-400" },
];

export default function ReportingExample() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Preview
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Sample Report View
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Daily Performance Report example
        </p>
      </div>

      <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
        {/* Report header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 pb-4 border-b border-border-sub gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
            <div>
              <div className="text-[0.95rem] font-bold text-foreground">Daily Performance Report</div>
              <div className="text-[0.72rem] text-[#71717A] mt-0.5">December 28, 2024 — 10:30 AM</div>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-full font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25 uppercase"
            style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}
          >
            Auto-Generated
          </span>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="rounded-xl border border-border-sub bg-card-alt p-4 hover:border-[#2563EB]/25 transition-colors duration-250"
            >
              <div
                className="text-[#71717A] mb-1 uppercase"
                style={{ fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 600 }}
              >
                {metric.label}
              </div>
              <div className={`text-xl font-extrabold ${metric.color}`}>{metric.value}</div>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="p-4 bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-xl">
          <div
            className="font-bold text-[#2563EB] uppercase mb-1.5"
            style={{ fontSize: "0.625rem", letterSpacing: "0.1em" }}
          >
            AI Insight
          </div>
          <p className="text-[0.8rem] text-[#71717A] leading-[1.65]">
            Portfolio showing strong momentum. SOL accumulation detected.
            Consider taking partial profits above $130 resistance level.
          </p>
        </div>
      </div>
    </section>
  );
}
