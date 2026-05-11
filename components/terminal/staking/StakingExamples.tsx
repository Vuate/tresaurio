const exampleCards = [
  { label: "Staked Amount", value: "0.5 BTC", sub: "≈ $21,287.50", color: "text-foreground" },
  { label: "Earned Rewards", value: "0.0128 BTC", sub: "≈ $544.96", color: "text-emerald-400" },
  { label: "APR", value: "5.2%", sub: "Campaign boost +1.2%", color: "text-[#2563EB]" },
  { label: "Total Return", value: "+17.2%", sub: "APR 5.2% + Price 12%", color: "text-emerald-400" },
];

const comparisonData = [
  { type: "BTC Staking (Treasurio)", return: "17.2%", risk: "Medium-High", highlighted: true },
  { type: "Time Deposit (TRY)", return: "48%", risk: "Low" },
  { type: "Government Bond", return: "35%", risk: "Low" },
  { type: "S&P 500 (Historical)", return: "~10%", risk: "Medium" },
  { type: "Gold (Historical)", return: "~8%", risk: "Low-Medium" },
];

export default function StakingExamples() {
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
          Examples of how you can view your staking positions
        </p>
      </div>

      <div className="space-y-4">
        {/* BTC Staking Position */}
        <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
          {/* Panel header */}
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-border-sub">
            <h3 className="text-[0.95rem] font-bold text-foreground flex items-center gap-2">
              <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
              BTC Staking Position
            </h3>
            <span
              className="px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase"
              style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}
            >
              Active
            </span>
          </div>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3">
            {exampleCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-border-sub bg-card-alt p-4 hover:border-[#2563EB]/25 transition-colors duration-250"
              >
                <div
                  className="text-[#71717A] mb-1 uppercase"
                  style={{ fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 600 }}
                >
                  {card.label}
                </div>
                <div className={`text-lg font-extrabold mb-0.5 ${card.color}`}>{card.value}</div>
                <div className="text-[0.72rem] text-[#71717A]">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TradFi Comparison */}
        <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-border-sub">
            <h3 className="text-[0.95rem] font-bold text-foreground flex items-center gap-2">
              <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
              TradFi Comparison
            </h3>
          </div>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-2">
            {comparisonData.map((row, i) => (
              <div
                key={i}
                className={[
                  "rounded-xl border border-border-sub p-3.5 transition-colors",
                  row.highlighted ? "bg-[#2563EB]/5 border-[#2563EB]/20" : "bg-card-alt",
                ].join(" ")}
              >
                <div className={`text-[0.85rem] font-semibold mb-2 ${row.highlighted ? "text-foreground" : "text-[#71717A]"}`}>
                  {row.type}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-bold uppercase text-[#71717A]"
                      style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
                    >
                      Return
                    </span>
                    {row.highlighted ? (
                      <span className="px-2 py-0.5 rounded-lg text-[0.72rem] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {row.return}
                      </span>
                    ) : (
                      <span className="text-[0.78rem] text-[#71717A]">{row.return}</span>
                    )}
                  </div>
                  <div className="w-px h-3 bg-border-sub" />
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-bold uppercase text-[#71717A]"
                      style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}
                    >
                      Risk
                    </span>
                    {row.highlighted ? (
                      <span className="px-2 py-0.5 rounded-lg text-[0.72rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {row.risk}
                      </span>
                    ) : (
                      <span className="text-[0.78rem] text-[#71717A]">{row.risk}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block rounded-xl overflow-hidden border border-border-sub">
            {/* Table header */}
            <div
              className="grid px-5 py-3 border-b border-border-sub"
              style={{ gridTemplateColumns: "2fr 1fr 1fr", background: "rgba(37,99,235,0.08)" }}
            >
              <div className="font-bold text-[#71717A] uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                Investment Type
              </div>
              <div className="font-bold text-[#71717A] uppercase text-center" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                Annual Return
              </div>
              <div className="font-bold text-[#71717A] uppercase text-center" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>
                Risk Level
              </div>
            </div>
            {comparisonData.map((row, i) => (
              <div
                key={i}
                className={[
                  "grid px-5 py-3.5 items-center transition-colors",
                  i < comparisonData.length - 1 ? "border-b border-border-sub" : "",
                  row.highlighted ? "bg-[#2563EB]/5" : "hover:bg-foreground/3",
                ].join(" ")}
                style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
              >
                <div className={`text-[0.875rem] ${row.highlighted ? "text-foreground font-semibold" : "text-[#71717A]"}`}>
                  {row.type}
                </div>
                <div className="text-center">
                  {row.highlighted ? (
                    <span className="px-2.5 py-1 rounded-lg text-[0.72rem] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {row.return}
                    </span>
                  ) : (
                    <span className="text-[0.875rem] text-[#71717A]">{row.return}</span>
                  )}
                </div>
                <div className="text-center">
                  {row.highlighted ? (
                    <span className="px-2.5 py-1 rounded-lg text-[0.72rem] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {row.risk}
                    </span>
                  ) : (
                    <span className="text-[0.875rem] text-[#71717A]">{row.risk}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
