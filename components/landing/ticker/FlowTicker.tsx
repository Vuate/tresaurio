import FlowItem from "./FlowItem";

interface FlowItemData {
  name: string;
  price: string | number;
  change: number;
}

export default function FlowTicker({ items }: { items: FlowItemData[] }) {
  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((item, i) => (
          <FlowItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
