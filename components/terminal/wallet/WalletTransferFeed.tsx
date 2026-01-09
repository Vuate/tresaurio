const transfers = [
  {
    icon: "🐋",
    type: "EXCHANGE OUTFLOW",
    badgeType: "outflow",
    amount: "320 BTC",
    address: "Binance → 0x7a2b...4f3c (Unknown)",
    usd: "$13.6M",
    time: "2 min ago",
  },
  {
    icon: "📊",
    type: "EXCHANGE INFLOW",
    badgeType: "inflow",
    amount: "1,250 ETH",
    address: "0x9c4d...8a1b (Unknown) → Coinbase",
    usd: "$3.67M",
    time: "5 min ago",
  },
  {
    icon: "⚡",
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
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Transfer Feed Örneği</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Gerçek zamanlı whale transfer görünümü
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        <div className="flex flex-col gap-3">
          {transfers.map((transfer, index) => (
            <div
              key={index}
              className="bg-[#041F20]/95 border border-white/10 rounded-xl p-5 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-5 items-center"
            >
              {/* Transfer Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-teal-500/10 rounded-xl text-2xl">
                {transfer.icon}
              </div>

              {/* Transfer Info */}
              <div className="flex-1">
                {/* Badge */}
                <div className="mb-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl text-[11px] font-bold uppercase ${
                      transfer.badgeType === "inflow"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {transfer.type}
                  </span>
                </div>

                {/* Amount */}
                <div className="text-lg font-bold text-white mb-1">
                  {transfer.amount}
                </div>

                {/* Address */}
                <div className="text-[11px] text-gray-400 font-mono">
                  {transfer.address}
                </div>
              </div>

              {/* Transfer Value */}
              <div className="text-right">
                {/* USD Value */}
                <div className="text-xl font-bold text-teal-400">
                  {transfer.usd}
                </div>

                {/* Time */}
                <div className="text-[11px] text-gray-400">{transfer.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}