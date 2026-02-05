const sentimentData = [
  { label: "Bullish Sentiment", value: "68%", width: 68, color: "bullish" },
  { label: "Neutral Sentiment", value: "18%", width: 18, color: "neutral" },
  { label: "Bearish Sentiment", value: "14%", width: 14, color: "bearish" },
];

export default function NewsSentiment() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Market Sentiment Pano
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Tüm haberleri analiz ederek çıkan genel market sentiment'i
        </p>
      </div>

      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {sentimentData.map((sentiment, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 text-center"
            >
              <div className="text-[11px] sm:text-xs lg:text-sm text-gray-400 mb-2 sm:mb-3">
                {sentiment.label}
              </div>

              <div
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-1.5 sm:mb-2 ${
                  sentiment.color === "bullish"
                    ? "text-green-500"
                    : sentiment.color === "neutral"
                    ? "text-gray-400"
                    : "text-red-500"
                }`}
              >
                {sentiment.value}
              </div>

              <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    sentiment.color === "bullish"
                      ? "bg-green-500"
                      : sentiment.color === "neutral"
                      ? "bg-gray-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${sentiment.width}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-7 lg:mt-8 p-4 sm:p-5 lg:p-6 bg-[#041F20]/95 rounded-lg sm:rounded-xl text-center">
          <div className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
            Overall Market Sentiment
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green-500">
            BULLISH
          </div>
          <div className="text-[11px] sm:text-xs lg:text-sm text-gray-300 mt-1.5 sm:mt-2">
            Based on 247 news articles in the last 24 hours
          </div>
        </div>
      </div>
    </section>
  );
}
