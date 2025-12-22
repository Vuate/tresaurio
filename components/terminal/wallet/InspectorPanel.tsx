"use client";

import { useState } from "react";

export default function InspectorPanel() {
  const [open, setOpen] = useState(true); // şimdilik açık

  return (
    <aside
      className={`w-[360px] border-l border-white/10 bg-[#041f20] p-5 transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="text-[16px] font-bold">Cüzdan Detayı</div>

        <button
          onClick={() => setOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm transition hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
        >
          ×
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <Section title="Cüzdan Özeti">
        <InfoRow label="Adres" value="0x742d...8f3a" />
        <InfoRow label="Etiket" value="Whale #142" />
        <InfoRow label="Bakiye" value="1,845 BTC" />
        <InfoRow label="USD Değer" value="$170.2M" />
        <InfoRow label="İlk İşlem" value="2019-03-14" />
      </Section>

      {/* ================= TAGS ================= */}
      <Section title="Etiketler">
        <div className="flex flex-wrap gap-2">
          <Tag label="Whale" />
          <Tag label="Long-term Holder" />
          <Tag label="Active Trader" />
        </div>
      </Section>

      {/* ================= ACTIVITY ================= */}
      <Section title="Son 24s Aktivite">
        <InfoRow label="Giriş" value="+125 BTC" valueColor="text-emerald-400" />
        <InfoRow label="Çıkış" value="-320 BTC" valueColor="text-red-400" />
        <InfoRow label="Net" value="-195 BTC" valueColor="text-red-400" />
        <InfoRow label="İşlem Sayısı" value="8" />
      </Section>

      {/* ================= ACTIONS ================= */}
      <Section title="Hızlı İşlemler">
        <ActionButton primary label="🔔 Bu Cüzdan için Alert Kur" />
        <ActionButton label="⭐ Watchlist'e Ekle" />
        <ActionButton label="📊 Detaylı Analiz" />
        <ActionButton label="🔗 Explorer'da Aç" />
      </Section>
    </aside>
  );
}

/* ================= HELPERS ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-[12px] font-bold uppercase tracking-wide text-gray-400">
        {title}
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueColor = "text-white",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex justify-between border-b border-white/10 py-2 text-[12px] last:border-b-0">
      <span className="text-gray-400">{label}</span>
      <span className={`font-mono font-semibold ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-teal-400/30 bg-teal-400/10 px-2 py-1 text-[11px] font-bold text-teal-300">
      {label}
    </span>
  );
}

function ActionButton({
  label,
  primary = false,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`mb-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition
        ${
          primary
            ? "bg-gradient-to-br from-teal-400 to-teal-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-400/30"
            : "border border-white/10 bg-white/5 text-white hover:border-teal-400/40 hover:bg-white/10"
        }`}
    >
      {label}
    </button>
  );
}
