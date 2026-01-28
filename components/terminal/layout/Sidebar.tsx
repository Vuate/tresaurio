"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  LineChart,
  Newspaper,
  Layers,
  Wallet,
  Activity,
  Sliders,
  FileText,
  Lock,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside
      className="
        group
        sticky top-[64px]
        h-[calc(100vh-64px)]
        w-[48px] xl:w-[52px] 2xl:w-[56px]
        hover:w-[190px] xl:hover:w-[210px] 2xl:hover:w-[230px]
        bg-[#0d0f14]
        border-r border-white/10
        transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        overflow-hidden
        shrink-0
      "
    >
      <div className="flex h-full flex-col gap-1 xl:gap-1.5 2xl:gap-2 p-1.5 xl:p-2 2xl:p-2.5 mt-3 xl:mt-4 2xl:mt-5">
        {/* LOGO */}
<div className="flex items-center h-8 xl:h-9 2xl:h-10 px-2 xl:px-2.5 2xl:px-3 min-w-[48px] xl:min-w-[52px] 2xl:min-w-[56px]">  {/* ↑ px değerleri artırıldı */}
  {/* ↑ min-w sidebar genişliği ile aynı oldu */}
  
  <div className="flex items-center justify-center w-5 xl:w-[22px] 2xl:w-6 shrink-0">
    {/* ↑ Icon container ekledik (NavItem'lardaki gibi) */}
    <img
      src="/treasurio.png"
      className="w-5 h-5 xl:w-[22px] xl:h-[22px] 2xl:w-6 2xl:h-6"
      alt="Treasurio"
    />
  </div>
  
  <span
    className="
      ml-2 xl:ml-2.5 2xl:ml-3
      text-sm xl:text-[15px] 2xl:text-base font-bold
      bg-gradient-to-br from-teal-300 to-blue-400
      text-transparent bg-clip-text
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
      whitespace-nowrap
    "
  >
    Treasurio
  </span>
</div>

        <NavItem
          href="/personalized-dashboard"
          icon={<LayoutDashboard className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Personalized Dashboard"
          active={isActive("/personalized-dashboard")}
        />

        <NavItem
          href="/terminal/home"
          icon={<Home className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Home"
          active={isActive("/terminal/home")}
        />

        <NavItem
          href="/terminal/trade"
          icon={<LineChart className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Trade & Portfolio"
          active={isActive("/terminal/trade")}
        />

        <SectionLabel label="INSIGHTS" />

        <NavItem
          href="/terminal/news"
          icon={<Newspaper className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="News"
          active={isActive("/terminal/news")}
        />
        <NavItem
          href="/terminal/staking"
          icon={<Layers className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Staking"
          active={isActive("/terminal/staking")}
        />
        <NavItem
          href="/terminal/wallet"
          icon={<Wallet className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Wallet Tracker"
          active={isActive("/terminal/wallet")}
        />

        <SectionLabel label="ADVANCED" />

        <NavItem
          href="/terminal/market-intelligence"
          icon={<Activity className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Market Microstructure"
          active={isActive("/terminal/market-intelligence")}
        />
        <NavItem
          href="/terminal/transfer"
          icon={<Lock className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Transfer"
          active={isActive("/terminal/transfer")}
        />
        <NavItem
          href="/terminal/reporting"
          icon={<FileText className="w-4 h-4 xl:w-[18px] xl:h-[18px] 2xl:w-5 2xl:h-5" />}
          label="Reporting"
          active={isActive("/terminal/reporting")}
        />
      </div>
    </aside>
  );
}

/* ---------------- ITEM ---------------- */

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative flex items-center
        h-8 xl:h-9 2xl:h-10
        min-w-[48px] xl:min-w-[52px] 2xl:min-w-[56px]
        px-2 xl:px-2.5 2xl:px-3
        rounded-md
        transition-all duration-300
        ${
          active
            ? "bg-[#1a1d24] text-teal-300"
            : "text-gray-400 hover:bg-[#14171d] hover:text-white"
        }
      `}
    >
      {/* SOL AKTİF ÇİZGİ */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2.5px] xl:h-5 xl:w-[3px] 2xl:h-6 2xl:w-1 bg-teal-400 rounded-r" />
      )}

      {/* ICON */}
      <div className="flex items-center justify-center w-5 xl:w-[22px] 2xl:w-6 shrink-0">
        {icon}
      </div>

      {/* TEXT */}
      <span
        className="
          ml-2 xl:ml-2.5 2xl:ml-3
          text-xs xl:text-[13px] 2xl:text-sm
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          whitespace-nowrap
        "
      >
        {label}
      </span>
    </Link>
  );
}

/* ---------------- SECTION ---------------- */

function SectionLabel({ label }: { label: string }) {
  return (
    <div
      className="
        mt-2.5 xl:mt-3 2xl:mt-3.5
        px-2 xl:px-2.5 2xl:px-3
        text-[8.5px] xl:text-[9px] 2xl:text-[10px]
        tracking-widest font-semibold
        text-gray-500
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        whitespace-nowrap
      "
    >
      {label}
    </div>
  );
}