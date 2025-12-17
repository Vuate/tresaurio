type Coin = {
  symbol: string;
  price: number;
  change: number;
  icon: string;
};

export default function CoinCard({ coin }: { coin: Coin }) {
  const isUp = coin.change >= 0;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
      {/* ICON */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20">
        <img
          src={coin.icon}
          alt={coin.symbol}
          className="h-6 w-6"
        />
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-white">
          {coin.symbol}
        </span>

        {/* PRICE */}
        <span
          className={`text-sm font-semibold transition-colors duration-300 ${
            isUp ? "text-[#19d8d0]" : "text-red-500"
          }`}
        >
          ${coin.price.toLocaleString()}
        </span>

        {/* CHANGE */}
        <span
          className={`flex items-center gap-1 text-xs font-semibold transition-colors duration-300 ${
            isUp ? "text-[#19d8d0]" : "text-red-500"
          }`}
        >
          <span>{isUp ? "▲" : "▼"}</span>
          <span>{Math.abs(coin.change).toFixed(2)}%</span>
        </span>
      </div>
    </div>
  );
}
