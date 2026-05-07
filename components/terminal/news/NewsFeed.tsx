const newsItems = [
  {
    source: "COINDESK",
    time: "5 min ago",
    title: "SEC Approves Bitcoin Spot ETF Applications from BlackRock and Fidelity",
    sentiment: "bullish" as const,
    sentimentScore: "92/100",
    impact: "+3.8% in 5min",
  },
  {
    source: "BLOOMBERG",
    time: "12 min ago",
    title: "Ethereum Network Upgrade Successfully Completed, Gas Fees Drop 40%",
    sentiment: "bullish" as const,
    sentimentScore: "87/100",
    impact: "+2.1% in 15min",
  },
  {
    source: "COINTELEGRAPH",
    time: "1 hour ago",
    title: "Major Exchange Reports $50M Security Breach, Trading Temporarily Halted",
    sentiment: "bearish" as const,
    sentimentScore: "78/100",
    impact: "-5.2% in 1h",
  },
];

export default function NewsFeed() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Live Preview
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Sample News Feed
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          News cards with AI-powered sentiment analysis
        </p>
      </div>

      <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
        {/* Panel header */}
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-border-sub">
          <div className="text-[0.95rem] font-bold text-foreground">Live News Feed</div>
          <span
            className="px-3 py-1 rounded-full font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25 uppercase"
            style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}
          >
            Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {newsItems.map((news, i) => (
            <div
              key={i}
              className="rounded-xl border border-border-sub bg-card-alt p-5 transition-all duration-250 hover:-translate-y-0.5 hover:border-[#2563EB]/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <div className="flex justify-between items-center mb-3">
                <span
                  className="font-bold text-[#2563EB] tracking-widest"
                  style={{ fontSize: "0.68rem" }}
                >
                  {news.source}
                </span>
                <span className="text-[0.72rem] text-[#71717A]">{news.time}</span>
              </div>

              <p className="text-[0.875rem] font-semibold text-foreground leading-snug mb-4">{news.title}</p>

              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[0.72rem] font-bold border ${
                    news.sentiment === "bullish"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {news.sentiment === "bullish" ? "Bullish" : "Bearish"} {news.sentimentScore}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[0.72rem] font-bold bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
                  {news.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
