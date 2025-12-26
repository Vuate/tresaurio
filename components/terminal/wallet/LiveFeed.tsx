"use client";

interface LiveFeedProps {
  onAlertClick?: () => void;
}

export default function LiveFeed({ onAlertClick }: LiveFeedProps) {
  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-[#041f20]/95 p-5">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[16px] font-bold">
          🔄 Anlık Transfer Akışı
          <div className="flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-[2px] text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            CANLI
          </div>
        </div>
      </div>

      {/* TRANSFER LIST */}
      <div className="space-y-2 overflow-x-auto local-scrollbar">
        <TransferItem
          time="12:42"
          from="0x742d...8f3a (Whale)"
          to="Binance Hot"
          token="BTC"
          amount="320 BTC"
          type="sell"
          onAlertClick={onAlertClick}
        />

        <TransferItem
          time="12:38"
          from="Binance Cold"
          to="0x9a2f...4bc7 (Unknown)"
          token="ETH"
          amount="1,250 ETH"
          type="buy"
          onAlertClick={onAlertClick}
        />

        <TransferItem
          time="12:35"
          from="0x3f8d...2e9b (Whale)"
          to="OKX Hot"
          token="BNB"
          amount="45,000 BNB"
          type="sell"
          onAlertClick={onAlertClick}
        />

        <TransferItem
          time="12:31"
          from="Coinbase"
          to="0x7c4e...9d2a (Whale)"
          token="SOL"
          amount="25,000 SOL"
          type="buy"
          onAlertClick={onAlertClick}
        />

        <TransferItem
          time="12:28"
          from="0x1a5b...3f7c (Whale)"
          to="0x8d2c...6e1b (Whale)"
          token="USDT"
          amount="10M USDT"
          type="neutral"
          onAlertClick={onAlertClick}
        />
      </div>

      {/* LOCAL SCROLLBAR STYLE */}
      <style jsx>{`
        .local-scrollbar::-webkit-scrollbar {
          height: 8px;
        }

        .local-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .local-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45, 212, 191, 0.35);
          border-radius: 9999px;
        }

        .local-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 212, 191, 0.6);
        }

        /* Firefox */
        .local-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(45, 212, 191, 0.4) transparent;
        }
      `}</style>
    </section>
  );
}

/* ================= TRANSFER ITEM ================= */

function TransferItem({
  time,
  from,
  to,
  token,
  amount,
  type,
  onAlertClick,
}: {
  time: string;
  from: string;
  to: string;
  token: string;
  amount: string;
  type: "buy" | "sell" | "neutral";
  onAlertClick?: () => void;
}) {
  const typeStyles = {
    buy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
    sell: "border-red-400/30 bg-red-400/10 text-red-400",
    neutral: "border-gray-400/30 bg-gray-400/10 text-gray-300",
  };

  const typeLabel = {
    buy: "📈 Accumulation",
    sell: "📉 Sell Pressure",
    neutral: "↔️ Neutral",
  };

  return (
    <div className="grid grid-cols-[60px_200px_40px_200px_80px_120px_120px_40px] min-w-max items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[12px] transition hover:translate-x-1 hover:border-teal-400/40 hover:bg-white/10">
      <div className="font-mono text-[11px] text-gray-400">{time}</div>
      <div className="font-mono text-gray-300">{from}</div>
      <div className="text-center text-gray-400">→</div>
      <div className="font-mono text-gray-300">{to}</div>
      <div className="font-bold text-teal-300">{token}</div>
      <div className="font-mono font-bold text-white">{amount}</div>

      <div
        className={`rounded border px-2 py-[2px] text-[10px] font-bold ${typeStyles[type]}`}
      >
        {typeLabel[type]}
      </div>

      {/* 🔔 ALERT */}
      <button
        onClick={onAlertClick}
        className="cursor-pointer text-center text-gray-400 transition hover:scale-110 hover:text-yellow-400"
      >
        🔔
      </button>
    </div>
  );
}
