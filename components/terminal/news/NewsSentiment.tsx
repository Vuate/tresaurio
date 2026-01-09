const sentimentData = [
  { label: "Bullish Sentiment", value: "68%", width: 68, color: "bullish" },
  { label: "Neutral Sentiment", value: "18%", width: 18, color: "neutral" },
  { label: "Bearish Sentiment", value: "14%", width: 14, color: "bearish" },
];

export default function NewsSentiment() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Market Sentiment Pano</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Tüm haberleri analiz ederek çıkan genel market sentiment'i
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        {/* Sentiment Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sentimentData.map((sentiment, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 rounded-xl p-6 text-center"
            >
              {/* Label */}
              <div className="text-[13px] text-gray-400 mb-3">
                {sentiment.label}
              </div>

              {/* Value */}
              <div
                className={`text-4xl font-extrabold mb-2 ${
                  sentiment.color === "bullish"
                    ? "text-green-500"
                    : sentiment.color === "neutral"
                    ? "text-gray-400"
                    : "text-red-500"
                }`}
              >
                {sentiment.value}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
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

        {/* Overall Sentiment Summary */}
        <div className="mt-8 p-6 bg-[#041F20]/95 rounded-xl text-center">
          <div className="text-sm text-gray-400 mb-2">
            Overall Market Sentiment
          </div>
          <div className="text-[32px] font-extrabold text-green-500">
            BULLISH
          </div>
          <div className="text-[13px] text-gray-300 mt-2">
            Based on 247 news articles in the last 24 hours
          </div>
        </div>
      </div>
    </section>
  );
}