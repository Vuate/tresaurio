"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  BarChart2,
  ShoppingBag,
  Package,
  ShoppingCart,
  Receipt,
  Users,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  // Aktif olan menü için kontrol
  function isActive(path: string) {
    return pathname.startsWith(path)
      ? "bg-[#1a1d24] text-teal-300"
      : "text-gray-300 hover:bg-[#14171d] hover:text-white";
  }

  return (
    <div className="w-[230px] min-h-screen bg-[#0d0f14] border-r border-white/10 p-5 flex flex-col gap-8">
      {/* === LOGO === */}
      <div className="flex items-center gap-2 px-2">
        <img src="/treasurio.png" className="w-8 h-8" />
        <span className="text-xl font-bold bg-gradient-to-br from-teal-300 to-blue-400 text-transparent bg-clip-text">
          Treasurio
        </span>
      </div>

      {/* === MENU === */}
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/"
          )}`}
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          href="/terminal/dashboard"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive(
            "/terminal/dashboard"
          )}`}
        >
          <LayoutGrid size={18} />
          Dashboard
        </Link>
      </div>

      {/* === ANALİTİK BAŞLIĞI === */}
      <div className="text-gray-500 text-xs px-2 mt-2">ANALİTİK</div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <BarChart2 size={18} />
          Satış Özeti
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <ShoppingBag size={18} />
          En İyi Ürünler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <Package size={18} />
          Stok Durumu
        </div>
      </div>

      {/* === DİĞER MENÜLER === */}
      <div className="flex flex-col gap-1 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <ShoppingCart size={18} />
          Ürünler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <LayoutGrid size={18} />
          Kategoriler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <Receipt size={18} />
          Siparişler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <BarChart2 size={18} />
          Vergiler
        </div>

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-[#14171d] hover:text-white cursor-pointer">
          <Users size={18} />
          Müşteriler
        </div>
      </div>
    </div>
  );
}
