const steps = [
  {
    number: "1",
    title: "News Aggregation",
    description: "We automatically collect news from 50+ news sources and social media. Real-time feed is continuously updated and duplicate news is filtered out.",
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "Each news article is analyzed with AI. Sentiment scoring, token mention detection, and impact prediction are performed. Bullish/Bearish classification happens automatically.",
  },
  {
    number: "3",
    title: "Price Correlation",
    description: "News is correlated with price changes. Pre/post news price tracking is performed and impact magnitude is calculated. Alerts are sent for high-impact news.",
  },
];

export default function NewsHowItWorks() {
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
          3 steps to start using News Intelligence
        </p>
      </div>

      {/* index.html how-grid: 1fr arrow 1fr arrow 1fr */}
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

      {/* Mobile: single column with arrows */}
      <div className="flex flex-col md:hidden">
        {steps.map((step, i) => (
          <>
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
