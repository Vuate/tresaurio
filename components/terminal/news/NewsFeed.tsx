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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Haber Feed Örneği
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          AI-powered sentiment analysis ile haber kartları
        </p>
      </div>

      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {newsItems.map((news, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 transition-all duration-300 hover:border-teal-400 hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold">
                  {news.source}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400">{news.time}</div>
              </div>

              <div className="text-sm sm:text-base font-bold mb-3 sm:mb-4 leading-snug">
                {news.title}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <span
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold ${
                    news.sentiment === "bullish"
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {news.sentiment === "bullish" ? "Bullish" : "Bearish"}{" "}
                  {news.sentimentScore}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold bg-teal-500/20 text-teal-400">
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
