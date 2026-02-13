import { Icon } from "@iconify/react";

const transfers = [
  {
    icon: "mdi:bank-transfer-out",
    type: "EXCHANGE OUTFLOW",
    badgeType: "outflow",
    amount: "320 BTC",
    address: "Binance → 0x7a2b...4f3c (Unknown)",
    usd: "$13.6M",
    time: "2 min ago",
  },
  {
    icon: "mdi:bank-transfer-in",
    type: "EXCHANGE INFLOW",
    badgeType: "inflow",
    amount: "1,250 ETH",
    address: "0x9c4d...8a1b (Unknown) → Coinbase",
    usd: "$3.67M",
    time: "5 min ago",
  },
  {
    icon: "mdi:arrow-expand-horizontal",
    type: "WHALE MOVEMENT",
    badgeType: "outflow",
    amount: "5,000,000 USDT",
    address: "0x3f2a...9d7e → 0x8b1c...4f2a",
    usd: "$5.0M",
    time: "12 min ago",
  },
];

export default function WalletTransferFeed() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Transfer Feed Example
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Real-time whale transfer view
        </p>
      </div>

      <div className="bg-[#041F20] rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-white/10">
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {transfers.map((transfer, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 sm:gap-5 items-center"
            >
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal-500/10 rounded-lg sm:rounded-xl">
                <Icon
                  icon={transfer.icon}
                  className="text-teal-400 text-xl sm:text-2xl"
                />
              </div>

              <div className="flex-1">
                <div className="mb-1">
                  <span
                    className={`inline-block px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold uppercase ${
                      transfer.badgeType === "inflow"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {transfer.type}
                  </span>
                </div>

                <div className="text-base sm:text-lg font-bold text-white mb-0.5 sm:mb-1">
                  {transfer.amount}
                </div>

                <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono">
                  {transfer.address}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold text-teal-400">
                  {transfer.usd}
                </div>

                <div className="text-[10px] sm:text-[11px] text-gray-400">{transfer.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
