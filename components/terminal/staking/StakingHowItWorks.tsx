const steps = [
  {
    number: "1",
    title: "Platform Connection",
    description: "Connect your staking platforms (Binance, Kraken, Coinbase, etc.) via API or manually enter your positions.",
  },
  {
    number: "2",
    title: "Position Tracking",
    description: "All your staking positions are automatically loaded to the dashboard. Real-time values, rewards, and ROI calculations are updated in real-time.",
  },
  {
    number: "3",
    title: "Analysis & Insights",
    description: "Review APR comparisons, TradFi comparisons, and historical performance reports to identify the best strategies.",
  },
  {
    number: "4",
    title: "Optimization",
    description: "Identify underperforming stakes, discover better APR opportunities, and optimize your portfolio.",
  },
];

export default function StakingHowItWorks() {
  return (
    <section className="mb-12 lg:mb-16 rounded-xl bg-surface border border-border-sub py-12 lg:py-14 px-6 lg:px-10">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Process
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          How It Works?
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          4 simple steps to start using Staking &amp; Yield Tracking
        </p>
      </div>

      {/* Desktop: 4 steps with arrows */}
      <div
        className="items-start hidden xl:grid"
        style={{ gridTemplateColumns: "1fr 32px 1fr 32px 1fr 32px 1fr" }}
      >
        {steps.map((step, i) => (
          <>
            <div key={step.number} className="text-center px-5">
              <div className="w-17 h-17 rounded-[18px] flex items-center justify-center mx-auto mb-5 bg-[#2563EB]/10 border border-[#2563EB]/25">
                <span className="text-2xl font-black text-[#2563EB]">{step.number}</span>
              </div>
              <div
                className="font-bold uppercase text-[#71717A] mb-2"
                style={{ fontSize: "0.67rem", letterSpacing: "0.1em" }}
              >
                Step 0{step.number}
              </div>
              <h3 className="text-[1.05rem] font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-[0.875rem] text-[#71717A] leading-[1.7]">{step.description}</p>
            </div>

            {i < steps.length - 1 && (
              <div key={`arrow-${i}`} className="flex items-start justify-center pt-8.5 opacity-35">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )}
          </>
        ))}
      </div>

      {/* Tablet: 2x2 with arrows */}
      <div className="hidden sm:block xl:hidden">
        <div className="grid items-start" style={{ gridTemplateColumns: "1fr 32px 1fr" }}>
          {steps.slice(0, 2).map((step, i) => (
            <>
              <div key={step.number} className="text-center px-5">
                <div className="w-17 h-17 rounded-[18px] flex items-center justify-center mx-auto mb-5 bg-[#2563EB]/10 border border-[#2563EB]/25">
                  <span className="text-2xl font-black text-[#2563EB]">{step.number}</span>
                </div>
                <div className="font-bold uppercase text-[#71717A] mb-2" style={{ fontSize: "0.67rem", letterSpacing: "0.1em" }}>Step 0{step.number}</div>
                <h3 className="text-[1.05rem] font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-[0.875rem] text-[#71717A] leading-[1.7]">{step.description}</p>
              </div>
              {i === 0 && (
                <div className="flex items-start justify-center pt-8.5 opacity-35">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </>
          ))}
        </div>
        <div className="py-5" />
        <div className="grid items-start" style={{ gridTemplateColumns: "1fr 32px 1fr" }}>
          {steps.slice(2).map((step, i) => (
            <>
              <div key={step.number} className="text-center px-5">
                <div className="w-17 h-17 rounded-[18px] flex items-center justify-center mx-auto mb-5 bg-[#2563EB]/10 border border-[#2563EB]/25">
                  <span className="text-2xl font-black text-[#2563EB]">{step.number}</span>
                </div>
                <div className="font-bold uppercase text-[#71717A] mb-2" style={{ fontSize: "0.67rem", letterSpacing: "0.1em" }}>Step 0{step.number}</div>
                <h3 className="text-[1.05rem] font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-[0.875rem] text-[#71717A] leading-[1.7]">{step.description}</p>
              </div>
              {i === 0 && (
                <div className="flex items-start justify-center pt-8.5 opacity-35">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      {/* Mobile: single column with arrows */}
      <div className="flex flex-col sm:hidden">
        {steps.map((step, i) => (
          <>
            <div key={step.number} className="text-center px-2">
              <div className="w-17 h-17 rounded-[18px] flex items-center justify-center mx-auto mb-5 bg-[#2563EB]/10 border border-[#2563EB]/25">
                <span className="text-2xl font-black text-[#2563EB]">{step.number}</span>
              </div>
              <div className="font-bold uppercase text-[#71717A] mb-2" style={{ fontSize: "0.67rem", letterSpacing: "0.1em" }}>Step 0{step.number}</div>
              <h3 className="text-[1.05rem] font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-[0.875rem] text-[#71717A] leading-[1.7]">{step.description}</p>
            </div>
            {i < steps.length - 1 && (
              <div key={`arrow-mob-${i}`} className="flex justify-center py-5 opacity-35">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
}
