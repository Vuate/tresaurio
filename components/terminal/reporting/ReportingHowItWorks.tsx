const steps = [
  {
    number: "1",
    title: "Configure Your Report",
    description: "Choose which modules to include. Select from 39 modules across 8 categories and customize your template layout.",
  },
  {
    number: "2",
    title: "Automatic Data Collection",
    description: "All data is automatically pulled from exchange APIs, blockchain networks, and news sources in real-time.",
  },
  {
    number: "3",
    title: "Generate & Export",
    description: "Your report is generated with AI-powered insights. Export as PDF, Excel, or schedule for automatic delivery.",
  },
];

export default function ReportingHowItWorks() {
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
          3 steps to create your professional crypto report
        </p>
      </div>

      {/* Desktop: 3-column arrow layout */}
      <div
        className="items-start hidden md:grid"
        style={{ gridTemplateColumns: "1fr 32px 1fr 32px 1fr" }}
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

      {/* Mobile: single column */}
      <div className="flex flex-col gap-10 md:hidden">
        {steps.map((step) => (
          <div key={step.number} className="text-center px-2">
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
        ))}
      </div>
    </section>
  );
}
