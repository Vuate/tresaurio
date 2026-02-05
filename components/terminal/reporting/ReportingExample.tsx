const metrics = [
  { label: "Total Portfolio", value: "$124,567", color: "text-teal-400" },
  { label: "24h Change", value: "+$3,245", color: "text-green-500" },
  { label: "Unrealized PnL", value: "+$12,890", color: "text-teal-400" },
  { label: "Total Fees (24h)", value: "$89", color: "text-teal-400" },
  { label: "Best Performer", value: "SOL +12.4%", color: "text-teal-400" },
  { label: "Market Sentiment", value: "Bullish", color: "text-green-500" },
];

export default function ReportingExample() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Örnek Rapor Görünümü
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Daily Performance Report örneği
        </p>
      </div>

      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <div className="bg-[#041F20]/95 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 xl:p-8 border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-5 lg:mb-6 pb-3 sm:pb-4 border-b border-white/10 gap-2 sm:gap-0">
            <div>
              <div className="text-base sm:text-lg lg:text-xl font-bold">Daily Performance Report</div>
              <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                28 Aralık 2024 - 10:30 AM
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-[#041F20] p-4 sm:p-5 rounded-lg sm:rounded-xl border border-white/10"
              >
                <div className="text-[10px] sm:text-[11px] uppercase text-gray-400 tracking-wider mb-1.5 sm:mb-2">
                  {metric.label}
                </div>
                <div className={`text-xl sm:text-2xl font-extrabold ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:mt-5 lg:mt-6 p-3 sm:p-4 bg-teal-500/10 rounded-lg border-l-4 border-teal-400">
            <div className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">AI INSIGHT</div>
            <div className="text-xs sm:text-sm text-white">
              Portfolio showing strong momentum. SOL accumulation detected.
              Consider taking partial profits above $130 resistance level.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
