"use client";

export default function WatchlistSection({
  activeItem,
  onSelect,
}: {
  activeItem: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 text-[12px] font-bold uppercase tracking-wide text-gray-400">
        🧩 Watchlist
      </div>

      <Item label="Cüzdanlar" count={8} dot active={activeItem === "Cüzdanlar"} onClick={() => onSelect("Cüzdanlar")} />
      <Item label="Tokenlar" count={24} active={activeItem === "Tokenlar"} onClick={() => onSelect("Tokenlar")} />
      <Item label="Borsalar" count={5} dot active={activeItem === "Borsalar"} onClick={() => onSelect("Borsalar")} />
    </div>
  );
}

function Item({
  label,
  count,
  dot,
  active,
  onClick,
}: {
  label: string;
  count: number;
  dot?: boolean;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition
        ${active ? "border-teal-400 bg-teal-400/10" : "border-white/10 bg-white/5 hover:border-teal-400/40 hover:bg-white/10"}`}
    >
      <div className={`h-2 w-2 rounded-full ${dot ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
      <div className="flex-1 text-[13px] font-medium text-gray-200">{label}</div>
      <div className="rounded border border-teal-400/30 bg-teal-400/10 px-2 py-[2px] text-[10px] font-bold text-teal-300">
        {count}
      </div>
    </div>
  );
}
