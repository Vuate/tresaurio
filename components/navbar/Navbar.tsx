"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    const pricingSection = document.getElementById("pricing-table");

    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Pricing bölümü ekrandayken NAVBAR GİZLİ
        if (entry.isIntersecting) {
          setHideNavbar(true);
        } else {
          // Pricing bölümünden çıkınca NAVBAR geri gelir
          setHideNavbar(false);
        }
      },
      {
        threshold: 0.2, // Ekranın %20’si görününce aktif olsun
      }
    );

    observer.observe(pricingSection);

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 
        transition-transform duration-300
        ${hideNavbar ? "-translate-y-full" : "translate-y-0"}
        bg-[#031A1C]/90 backdrop-blur-xl border-b border-white/10
        py-6 px-8 flex items-center justify-between
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-teal-400 font-bold text-xl">▣</span>
        <span className="text-white font-semibold text-xl">Treasurio</span>
      </div>

      {/* Menu */}
      <div className="flex-1 flex items-center gap-8 ml-16 text-gray-300 text-sm">
        <button>REWARDS</button>
        <button>TREASURY</button>
        <button>LEARN</button>
        <button>DOWNLOAD</button>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Button className="bg-teal-400 text-black hover:bg-teal-300">
          START TRADING
        </Button>
        <Button variant="outline" className="border-gray-300 text-white">
          READ THE DOCS
        </Button>
      </div>
    </nav>
  );
}
