import CoinCard from "./CoinCard";

type Coin = {
  symbol: string;
  price: number;
  change: number;
  icon: string;
};

export default function CoinTicker({ coins }: { coins: Coin[] }) {
  return (
    <div
      className="
        mx-auto mt-6 flex max-w-[1400px] gap-4
        overflow-x-auto px-6
        scrollbar-hide
      "
    >
      {coins.map((coin) => (
        <CoinCard key={coin.symbol} coin={coin} />
      ))}
    </div>
  );
}
