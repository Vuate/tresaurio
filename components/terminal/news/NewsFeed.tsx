const newsItems = [
  {
    source: "COINDESK",
    time: "5 min ago",
    title:
      "SEC Approves Bitcoin Spot ETF Applications from BlackRock and Fidelity",
    sentiment: "bullish",
    sentimentScore: "92/100",
    impact: "+3.8% in 5min",
  },
  {
    source: "BLOOMBERG",
    time: "12 min ago",
    title:
      "Ethereum Network Upgrade Successfully Completed, Gas Fees Drop 40%",
    sentiment: "bullish",
    sentimentScore: "87/100",
    impact: "+2.1% in 15min",
  },
  {
    source: "COINTELEGRAPH",
    time: "1 hour ago",
    title:
      "Major Exchange Reports $50M Security Breach, Trading Temporarily Halted",
    sentiment: "bearish",
    sentimentScore: "78/100",
    impact: "-5.2% in 1h",
  },
];

export default function NewsFeed() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Haber Feed Örneği</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          AI-powered sentiment analysis ile haber kartları
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsItems.map((news, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 border border-white/10 rounded-xl p-5 transition-all duration-300 hover:border-teal-400 hover:-translate-y-0.5"
            >
              {/* News Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="text-[11px] text-gray-400 font-semibold">
                  {news.source}
                </div>
                <div className="text-[11px] text-gray-400">{news.time}</div>
              </div>

              {/* News Title */}
              <div className="text-base font-bold mb-4 leading-snug">
                {news.title}
              </div>

              {/* News Footer - Sentiment & Impact */}
              <div className="flex gap-3">
                <span
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                    news.sentiment === "bullish"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {news.sentiment === "bullish" ? "Bullish" : "Bearish"}{" "}
                  {news.sentimentScore}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-teal-500/20 text-teal-400">
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