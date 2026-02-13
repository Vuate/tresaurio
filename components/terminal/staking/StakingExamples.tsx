const exampleCards = [
  {
    label: "Staked Amount",
    value: "0.5 BTC",
    subvalue: "≈ $21,287.50",
  },
  {
    label: "Earned Rewards",
    value: "0.0128 BTC",
    subvalue: "≈ $544.96",
  },
  {
    label: "APR",
    value: "5.2%",
    subvalue: "Campaign boost +1.2%",
  },
  {
    label: "Total Return",
    value: "+17.2%",
    subvalue: "APR 5.2% + Price 12%",
  },
];

const comparisonData = [
  {
    type: "BTC Staking (Treasurio)",
    return: "17.2%",
    risk: "Orta-Yüksek",
    highlighted: true,
  },
  {
    type: "Time Deposit (TRY)",
    return: "48%",
    risk: "Low",
  },
  {
    type: "Government Bond",
    return: "35%",
     risk: "Low",
  },
  {
    type: "S&P 500 (Historical)",
    return: "~10%",
    risk: "Medium",
  },
  {
    type: "Gold (Historical)",
    return: "~8%",
    risk: "Low-Medium",
  },
];

export default function StakingExamples() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Sample Dashboard View
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Examples of how you can view your staking positions
        </p>
      </div>

      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <h3 className="mb-4 sm:mb-5 lg:mb-6 text-base sm:text-lg lg:text-xl font-bold">
          BTC Staking Position
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {exampleCards.map((card, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-white/10"
            >
              <div className="text-[10px] sm:text-[11px] uppercase text-gray-400 tracking-wider mb-1.5 sm:mb-2">
                {card.label}
              </div>
              <div className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-teal-400 mb-0.5 sm:mb-1">
                {card.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-300">{card.subvalue}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10 mt-5 sm:mt-6">
        <h3 className="mb-4 sm:mb-5 lg:mb-6 text-base sm:text-lg lg:text-xl font-bold">
          TradFi Comparison
        </h3>
        <div className="bg-[#041F20]/95 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 sm:gap-5 lg:gap-6 p-4 sm:p-5 md:px-6 lg:px-8 border-b border-white/10 bg-teal-500/10 font-bold">
            <div className="text-xs sm:text-sm lg:text-[15px]">Investment Type</div>
            <div className="text-xs sm:text-sm lg:text-[14px] text-gray-300 text-center">
              Annual Return
            </div>
            <div className="text-xs sm:text-sm lg:text-[14px] text-gray-300 text-center">
              Risk Level
            </div>
          </div>

          {comparisonData.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 sm:gap-5 lg:gap-6 p-4 sm:p-5 md:px-6 lg:px-8 items-center ${
                index !== comparisonData.length - 1
                  ? "border-b border-white/10"
                  : ""
              }`}
            >
              <div className="text-xs sm:text-sm lg:text-[15px]">
                {row.highlighted ? <strong>{row.type}</strong> : row.type}
              </div>
              <div className="text-xs sm:text-sm lg:text-[14px] text-gray-300 text-center">
                {row.highlighted ? (
                  <span className="inline-block px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-green-500/20 text-green-500">
                    {row.return}
                  </span>
                ) : (
                  row.return
                )}
              </div>
              <div className="text-xs sm:text-sm lg:text-[14px] text-gray-300 text-center">
                {row.highlighted ? (
                  <span className="inline-block px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold bg-amber-500/20 text-amber-500">
                    {row.risk}
                  </span>
                ) : (
                  row.risk
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
