const sentimentData = [
  { label: "Bullish Sentiment", value: "68%", width: 68, color: "bullish" as const },
  { label: "Neutral Sentiment", value: "18%", width: 18, color: "neutral" as const },
  { label: "Bearish Sentiment", value: "14%", width: 14, color: "bearish" as const },
];

export default function NewsSentiment() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Dashboard
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Market Sentiment Dashboard
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Overall market sentiment derived from analyzing all news articles
        </p>
      </div>

      <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
        {/* Panel header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-sub">
          <div className="text-[0.95rem] font-bold text-foreground">Sentiment Overview</div>
          <span className="text-[0.72rem] text-[#71717A]">Based on last 24h</span>
        </div>

        {/* Sentiment metric rows — index.html metric-row pattern */}
        <div className="flex flex-col gap-5 mb-6">
          {sentimentData.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="text-[0.78rem] font-semibold text-[#71717A] shrink-0"
                style={{ minWidth: "100px" }}
              >
                {s.label}
              </div>
              <div className="flex-1 h-1.25 bg-input rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1200 ${
                    s.color === "bullish"
                      ? "bg-emerald-400"
                      : s.color === "neutral"
                      ? "bg-[#71717A]"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${s.width}%` }}
                />
              </div>
              <div
                className={`text-[0.78rem] font-bold shrink-0 text-right ${
                  s.color === "bullish"
                    ? "text-emerald-400"
                    : s.color === "neutral"
                    ? "text-[#71717A]"
                    : "text-red-400"
                }`}
                style={{ minWidth: "38px" }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Overall result card */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
          <div
            className="text-[#71717A] mb-2 uppercase"
            style={{ fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700 }}
          >
            Overall Market Sentiment
          </div>
          <div className="text-3xl font-black text-emerald-400 mb-1">BULLISH</div>
          <div className="text-[0.78rem] text-[#71717A]">Based on 247 news articles in the last 24 hours</div>
        </div>
      </div>
    </section>
  );
}
