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

function isActive(path: string) {
  const isExact = pathname === path;
  const isChild = pathname.startsWith(path + "/");

  return isExact || isChild
    ? "bg-[#1a1d24] text-teal-300"
    : "text-gray-300 hover:bg-[#14171d] hover:text-white";
}


  return (
    <div className="w-[230px] min-h-screen bg-[#0d0f14] border-r border-white/10 p-5 flex flex-col gap-8">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2">
        <img src="/treasurio.png" className="w-8 h-8" />
        <span className="text-xl font-bold bg-gradient-to-br from-teal-300 to-blue-400 text-transparent bg-clip-text">
          Treasurio
        </span>
      </div>

      {/* MAIN */}
      <div className="flex flex-col gap-1">
        <Link
          href="/terminal/personalized"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/terminal/personalized"
          )}`}
        >
          <LayoutDashboard size={18} />
          Personalized Dashboard
        </Link>

        <Link
          href="/terminal/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/terminal/dashboard"
          )}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        

        <Link
          href="/terminal/home"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/terminal/home"
          )}`}
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          href="/terminal/trade"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/terminal/trade"
          )}`}
        >
          <LineChart size={18} />
          Trade & Portfolio
        </Link>
      </div>

      <div className="text-gray-500 text-xs px-2 mt-2">ANALTK</div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <BarChart2 size={18} />
          Sat Ç-zeti
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <ShoppingBag size={18} />
          En yi ÇorÇ¬nler
        </div>

        <Link
          href="/terminal/wallet"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/terminal/wallet"
          )}`}
        >
          <Wallet size={18} />
          Wallet Tracker
        </Link>
      </div>

      <div className="flex flex-col gap-1 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <ShoppingCart size={18} />
          ÇorÇ¬nler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <LayoutGrid size={18} />
          Kategoriler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <Receipt size={18} />
          SipariYler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <BarChart2 size={18} />
          Vergiler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <Users size={18} />
          MYteriler
        </div>
      </div>
    </div>
  );
}