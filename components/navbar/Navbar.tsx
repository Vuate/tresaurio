"use client";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between bg-transparent fixed top-0 left-0 z-50">
      {/* Sol Logo */}
      <div className="flex items-center gap-2">
        <span className="text-teal-400 font-bold text-xl">▣</span>
        <span className="text-white font-semibold text-xl">Treasurio</span>
      </div>

      {/* Ortadaki Menü - Sola Çekildi */}
      <div className="flex-1 flex items-center gap-8 ml-16 text-gray-300 text-sm">
        <button>REWARDS</button>
        <button>BLOG</button>
        <button>LEARN</button>
        <button>DOWNLOAD</button>
      </div>

      {/* Sağdaki Butonlar */}
      <div className="flex items-center gap-3">
        <Button className="bg-teal-400 text-black hover:bg-teal-300">
          START TRADING
        </Button>
        <Button variant="outline" className="border-gray-300 text-black-200">
          READ THE DOCS
        </Button>
      </div>
    </nav>
  );
}
