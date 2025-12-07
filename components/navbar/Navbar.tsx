"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [hideNavbar, setHideNavbar] = useState(false);

  // === Navbar Hide Logic ===
  useEffect(() => {
    const pricingSection = document.getElementById("pricing-table");
    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHideNavbar(true);
        } else {
          setHideNavbar(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(pricingSection);
    return () => observer.disconnect();
  }, []);

  // === Ömer’in Glass Base Class ===
  const glassBase = `
    relative overflow-hidden rounded-2xl px-6 py-3 text-white
    backdrop-blur-xl transition-all duration-300

    before:content-[''] before:absolute before:inset-0
    before:bg-gradient-to-br before:from-white/10 before:to-transparent
    before:opacity-25 before:transition-opacity before:duration-300
    hover:before:opacity-40

    after:content-[''] after:absolute after:-left-20 after:top-0
    after:w-24 after:h-full after:rounded-full
    after:bg-gradient-to-r after:from-transparent after:via-teal-300/70 after:to-transparent
    after:opacity-60 after:transition-all after:duration-700 after:ease-out
    hover:after:left-full
  `;

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full h-20 z-50 px-8
        flex items-center justify-between
        transition-transform duration-300
        ${hideNavbar ? "-translate-y-full" : "translate-y-0"}
        bg-[#031A1C]/80 backdrop-blur-2xl
      `}
    >
      {/* === Sol Logo === */}
      <div className="flex items-center gap-3">
        <img
          src="/treasurio.png"
          alt="Treasurio Logo"
          className="w-18 h-18 object-contain"
        />
        <span className="text-white font-semibold text-3xl leading-none">
          Treasurio
        </span>
      </div>

      {/* === Menü === */}
      <div
        className="
          flex-1 flex items-center gap-10 ml-16 text-gray-300 text-sm
          [&>button]:inline-block [&>button]:px-1 [&>button]:font-medium
          [&>button]:transition [&>button]:duration-150 [&>button]:ease-out
          [&>button]:cursor-pointer [&>button]:transform
          [&>button:hover]:text-teal-300
          [&>button:hover]:opacity-90
          [&>button:hover]:-translate-y-0.5
        "
      >
        <button>REWARDS</button>
        <button>TERMINAL</button>
        <button>LEARN</button>
        <button>DOWNLOAD</button>
      </div>

      {/* === Sağ Butonlar === */}
      <div className="flex items-center gap-4">
        <Button
          className={
            glassBase +
            " border border-teal-400/50 bg-teal-400/10 hover:text-teal-200"
          }
        >
          START TRADING
        </Button>

        <Button
          className={
            glassBase + " border border-white/40 bg-white/5 hover:text-teal-200"
          }
        >
          READ THE DOCS
        </Button>
      </div>
    </nav>
  );
}
