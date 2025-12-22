"use client";

export default function WalletSidebar() {
  return (
    <aside className="w-[240px] border-r border-white/10 bg-[#041f20] p-5 overflow-y-auto">
      {/* ================= WATCHED WALLETS ================= */}
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-gray-400">
          🧭 İzlenen Cüzdanlar
        </div>

        <SidebarItem label="Whale" count={42} active dot />
        <SidebarItem label="Exchange Hot" count={128} dot />
        <SidebarItem label="Exchange Cold" count={8} />
        <SidebarItem label="Kurumsal / Fon" count={15} dot />
        <SidebarItem label="Kamu Cüzdanları" count={6} />
        <SidebarItem label="Kullanıcı Eklendi" count={12} dot />
      </div>

      {/* ================= WATCHLIST ================= */}
      <div>
        <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-gray-400">
          🧩 Watchlist
        </div>

        <SidebarItem label="Cüzdanlar" count={8} dot />
        <SidebarItem label="Tokenlar" count={24} />
        <SidebarItem label="Borsalar" count={5} dot />
      </div>
    </aside>
  );
}

/* ================= SUB ITEM ================= */

function SidebarItem({
  label,
  count,
  active = false,
  dot = false,
}: {
  label: string;
  count: number;
  active?: boolean;
  dot?: boolean;
}) {
  return (
    <div
      className={`mb-2 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition
        ${
          active
            ? "border-teal-400 bg-teal-400/10"
            : "border-white/10 bg-white/5 hover:border-teal-400/40 hover:bg-white/10"
        }`}
    >
      {/* ACTIVITY DOT */}
      <div
        className={`h-2 w-2 rounded-full ${
          dot ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
        }`}
      />

      {/* LABEL */}
      <div className="flex-1 text-[13px] font-medium text-gray-200">
        {label}
      </div>

      {/* BADGE */}
      <div className="rounded border border-teal-400/30 bg-teal-400/10 px-2 py-[2px] text-[10px] font-bold text-teal-300">
        {count}
      </div>
    </div>
  );
}
