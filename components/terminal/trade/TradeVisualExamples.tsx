const spotStats = [
  { label: "Total Value", value: "$124,567", sub: "≈ 2.83 BTC", color: "text-foreground" },
  { label: "Unrealized PnL", value: "+$12,890", sub: "+11.5% return", color: "text-emerald-400" },
  { label: "Best Performance", value: "SOL", sub: "+42.3% return", color: "text-[#2563EB]" },
  { label: "Total Coins", value: "12", sub: "across 5 exchanges", color: "text-foreground" },
];

const futuresStats = [
  { label: "Open Positions", value: "3", sub: "2 Long, 1 Short", color: "text-foreground" },
  { label: "Total Margin", value: "$8,450", sub: "Average 5x leverage", color: "text-foreground" },
  { label: "Unrealized PnL", value: "+$1,234", sub: "+14.6% gain", color: "text-emerald-400" },
  { label: "Liquidation Risk", value: "Low", sub: "Nearest: -18%", color: "text-emerald-400" },
];

function StatGrid({ title, stats }: { title: string; stats: typeof spotStats }) {
  return (
    <div>
      <h3 className="text-[1.05rem] font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
        {title}
      </h3>
      <div className="grid gap-3 grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border-sub bg-card-alt p-4 hover:border-[#2563EB]/25 transition-colors duration-250"
          >
            <div
              className="text-[#71717A] mb-1 uppercase"
              style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.06em" }}
            >
              {s.label}
            </div>
            <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-[0.72rem] text-[#71717A] mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TradeVisualExamples() {
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
          Sample Dashboard View
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Examples of how you can view your portfolio tools
        </p>
      </div>

      <div className="rounded-xl border border-border-sub p-6 lg:p-8 space-y-8 bg-card">
        {/* Panel header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-border-sub gap-2">
          <div>
            <div className="text-[0.95rem] font-bold text-foreground">Portfolio Overview</div>
            <div className="text-[0.72rem] text-[#71717A] mt-0.5">Live data — refreshed every 30s</div>
          </div>
          <span
            className="px-3 py-1 rounded-full font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25 uppercase"
            style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}
          >
            Live
          </span>
        </div>

        <StatGrid title="Spot Portfolio Summary" stats={spotStats} />
        <div className="border-t border-border-sub" />
        <StatGrid title="Futures Positions" stats={futuresStats} />
      </div>
    </section>
  );
}
