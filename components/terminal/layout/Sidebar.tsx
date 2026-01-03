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
        w-[52px] hover:w-[210px]
        bg-[#0d0f14]
        border-r border-white/10
        transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        overflow-hidden
        shrink-0
      "
    >
      <div className="flex h-full flex-col gap-1.5 p-2 mt-4">
        {/* LOGO */}
        <div className="flex items-center h-9 px-2 min-w-[36px]">
          <img
            src="/treasurio.png"
            className="w-7 h-7 shrink-0 min-w-[28px] min-h-[28px]"
            alt="Treasurio"
          />
          <span
            className="
              ml-2 text-[15px] font-bold
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
          icon={<LayoutDashboard size={16} />}
          label="Personalized Dashboard"
          active={isActive("/personalized-dashboard")}
        />

        <NavItem
          href="/terminal/home"
          icon={<Home size={16} />}
          label="Home"
          active={isActive("/terminal/home")}
        />
        <NavItem
          href="/terminal/dashboard"
          icon={<LayoutDashboard size={16} />}
          label="Dashboard"
          active={isActive("/terminal/dashboard")}
        />
        <NavItem
          href="/terminal/trade"
          icon={<LineChart size={16} />}
          label="Trade & Portfolio"
          active={isActive("/terminal/trade")}
        />

        <SectionLabel label="INSIGHTS" />

        <NavItem
          href="/terminal/news"
          icon={<Newspaper size={16} />}
          label="News"
          active={isActive("/terminal/news")}
        />
        <NavItem
          href="/terminal/staking"
          icon={<Layers size={16} />}
          label="Staking"
          active={isActive("/terminal/staking")}
        />
        <NavItem
          href="/terminal/wallet"
          icon={<Wallet size={16} />}
          label="Wallet Tracker"
          active={isActive("/terminal/wallet")}
        />

        <SectionLabel label="ADVANCED" />

        <NavItem
          href="/terminal/market-intelligence"
          icon={<Activity size={16} />}
          label="Market Microstructure"
          active={isActive("/terminal/market-intelligence")}
        />
        <NavItem
          href="/terminal/transfer"
          icon={<Sliders size={16} />}
          label="Transfer"
          active={isActive("/terminal/transfer")}
        />
        <NavItem
          href="/terminal/reporting"
          icon={<FileText size={16} />}
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
        h-9
        min-w-[52px]
        px-2.5
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
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] bg-teal-400 rounded-r" />
      )}

      {/* ICON */}
      <div className="flex items-center justify-center w-[22px] shrink-0">
        {icon}
      </div>

      {/* TEXT */}
      <span
        className="
          ml-2.5 text-[13px]
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
        mt-3 px-2.5
        text-[9px] tracking-widest font-semibold
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
