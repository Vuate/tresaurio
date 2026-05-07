import { Icon } from "@iconify/react";

const transfers = [
  {
    icon: "mdi:bank-transfer-out",
    type: "EXCHANGE OUTFLOW",
    badgeType: "outflow" as const,
    amount: "320 BTC",
    address: "Binance → 0x7a2b...4f3c (Unknown)",
    usd: "$13.6M",
    time: "2 min ago",
  },
  {
    icon: "mdi:bank-transfer-in",
    type: "EXCHANGE INFLOW",
    badgeType: "inflow" as const,
    amount: "1,250 ETH",
    address: "0x9c4d...8a1b (Unknown) → Coinbase",
    usd: "$3.67M",
    time: "5 min ago",
  },
  {
    icon: "mdi:arrow-expand-horizontal",
    type: "WHALE MOVEMENT",
    badgeType: "outflow" as const,
    amount: "5,000,000 USDT",
    address: "0x3f2a...9d7e → 0x8b1c...4f2a",
    usd: "$5.0M",
    time: "12 min ago",
  },
];

export default function WalletTransferFeed() {
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
          Transfer Feed Example
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Real-time whale transfer view
        </p>
      </div>

      <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
        {/* Panel header */}
        <div className="flex justify-between items-center gap-3 mb-5 pb-4 border-b border-border-sub flex-wrap">
          <div className="text-[0.95rem] font-bold text-foreground">Live Transfer Feed</div>
          <span
            className="px-3 py-1 rounded-full font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/25 uppercase shrink-0 whitespace-nowrap"
            style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}
          >
            Live
          </span>
        </div>

        <div className="space-y-3">
          {transfers.map((transfer, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border-sub bg-card-alt p-4 lg:p-5 transition-all duration-250 hover:-translate-y-0.5 hover:border-[#2563EB]/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              {/* Icon box */}
              <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-[10px] bg-[#2563EB]/10 border border-[#2563EB]/20">
                <Icon icon={transfer.icon} className="text-xl text-[#2563EB]" />
              </div>

              {/* Content + right */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg font-bold uppercase mb-1 border whitespace-nowrap ${
                        transfer.badgeType === "inflow"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                      style={{ fontSize: "0.625rem", letterSpacing: "0.05em" }}
                    >
                      {transfer.type}
                    </span>
                    <div className="text-[0.9rem] font-bold text-foreground">{transfer.amount}</div>
                    <div className="text-[0.72rem] text-[#71717A] font-mono truncate">{transfer.address}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[0.95rem] font-bold text-foreground">{transfer.usd}</div>
                    <div className="text-[0.72rem] text-[#71717A]">{transfer.time}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
