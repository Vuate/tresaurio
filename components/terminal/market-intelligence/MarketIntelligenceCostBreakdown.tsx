const costItems = [
  { label: "Trading Fee", value: "$40", percent: "0.040%" },
  { label: "Spread", value: "$15", percent: "0.015%" },
  { label: "Slippage", value: "$7", percent: "0.007%" },
  { label: "Funding (8h)", value: "$0", percent: "0.000%" },
];

export default function MarketIntelligenceCostBreakdown() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Example
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          All-in Cost Example
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Cost breakdown for a $100,000 BTC trade
        </p>
      </div>

      <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border-sub">
          <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
          <span className="text-[0.95rem] font-bold text-foreground">Binance — BTC/USDT Perpetual</span>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {costItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border-sub bg-card-alt p-4 hover:border-[#2563EB]/25 transition-colors duration-250"
            >
              <div
                className="text-[#71717A] mb-1 uppercase"
                style={{ fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: 600 }}
              >
                {item.label}
              </div>
              <div className="text-xl font-extrabold text-foreground mb-0.5">{item.value}</div>
              <div className="text-[0.72rem] text-[#71717A]">{item.percent}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#2563EB]/40 bg-[#2563EB]/5 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div
              className="uppercase text-[#71717A] mb-1 font-bold"
              style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}
            >
              ALL-IN COST
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              $62 <span className="text-lg font-semibold text-[#71717A]">(0.062%)</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-[0.72rem] text-[#71717A] mb-1">Annual Savings Potential</div>
            <div className="text-2xl font-bold text-[#2563EB]">$22,680</div>
          </div>
        </div>
      </div>
    </section>
  );
}
