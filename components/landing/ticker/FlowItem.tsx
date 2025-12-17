export default function FlowItem({ item }: { item: any }) {
  return (
    <div className="ticker-item">
      <span className="ticker-name">{item.name}</span>
      <span className="ticker-price">{item.price}</span>
      <span
        className={`ticker-change ${
          item.change >= 0 ? "positive" : "negative"
        }`}
      >
        {item.change}%
      </span>
    </div>
  );
}
