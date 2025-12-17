import FlowItem from "./FlowItem";

export default function FlowTicker({ items }: { items: any[] }) {
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
