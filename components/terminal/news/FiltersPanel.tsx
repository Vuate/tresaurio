"use client";

import { useState } from "react";

const newsTypes = [
  { label: "Tümü", count: 248 },
  { label: "Piyasa Haberleri", count: 84 },
  { label: "Token / Coin", count: 62 },
  { label: "Borsa Haberleri", count: 45 },
  { label: "Regülasyon & Hukuk", count: 28 },
  { label: "On-chain Haberler", count: 22 },
  { label: "Hack / Güvenlik", count: 12 },
  { label: "Balina Hareketleri", count: 15 },
];

const impactLevels = [
  { label: "Yüksek Etki", count: 18 },
  { label: "Orta Etki", count: 92 },
  { label: "Düşük Etki", count: 138 },
];

export default function FiltersPanel() {
  const [activeTypes, setActiveTypes] = useState<string[]>(["Tümü"]);
  const [activeImpact, setActiveImpact] = useState<string[]>([]);

  function toggle(
    list: string[],
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  }

  return (
    <aside className="terminal-scroll h-full overflow-y-auto border-r border-white/10 bg-[#041F20] p-6">
      {/* Haber Türü */}
      <FilterSection title="📂 Haber Türü">
        {newsTypes.map((item) => (
          <FilterItem
            key={item.label}
            label={item.label}
            count={item.count}
            active={activeTypes.includes(item.label)}
            onClick={() => toggle(activeTypes, item.label, setActiveTypes)}
          />
        ))}
      </FilterSection>

      {/* Etki Seviyesi */}
      <FilterSection title="⚡ Etki Seviyesi">
        {impactLevels.map((item) => (
          <FilterItem
            key={item.label}
            label={item.label}
            count={item.count}
            active={activeImpact.includes(item.label)}
            onClick={() => toggle(activeImpact, item.label, setActiveImpact)}
          />
        ))}
      </FilterSection>

      {/* Zaman Aralığı */}
      <FilterSection title="⏱️ Zaman Aralığı">
        <Select defaultValue="24h">
          <option value="1h">Son 1 saat</option>
          <option value="today">Bugün</option>
          <option value="24h">Son 24 saat</option>
          <option value="7d">Son 7 gün</option>
          <option value="30d">Son 30 gün</option>
        </Select>
      </FilterSection>

      {/* Token */}
      <FilterSection title="🪙 İlgili Token">
        <Select defaultValue="all">
          <option value="all">Tüm Tokenlar</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="BNB">BNB</option>
          <option value="SOL">SOL</option>
          <option value="XRP">XRP</option>
        </Select>
      </FilterSection>

      {/* Borsa */}
      <FilterSection title="🏦 İlgili Borsa">
        <Select defaultValue="all">
          <option value="all">Tüm Borsalar</option>
          <option value="binance">Binance</option>
          <option value="okx">OKX</option>
          <option value="bybit">Bybit</option>
          <option value="coinbase">Coinbase</option>
          <option value="kraken">Kraken</option>
        </Select>
      </FilterSection>
    </aside>
  );
}

/* ---------------- Sub Components ---------------- */

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition
        ${
          active
            ? "border-teal-400 bg-teal-400/10"
            : "border-white/10 hover:border-teal-400/40 hover:bg-white/5"
        }`}
    >
      <div
        className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] font-bold
          ${
            active
              ? "border-teal-400 bg-teal-400 text-black"
              : "border-white/30"
          }`}
      >
        {active && "✓"}
      </div>

      <span className="flex-1 text-gray-200">{label}</span>

      <span className="rounded bg-white/5 px-2 py-[2px] text-[11px] font-semibold text-gray-400">
        {count}
      </span>
    </div>
  );
}

function Select({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 focus:border-teal-400 focus:outline-none"
    >
      {children}
    </select>
  );
}
