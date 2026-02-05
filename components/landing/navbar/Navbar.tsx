"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";

export default function Navbar() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const isLoggedIn = status === "authenticated" && session?.user;

  useEffect(() => {
    const pricingSection = document.getElementById("pricing-table");
    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHideNavbar(entry.isIntersecting),
      { threshold: 0.2 }
    );

    observer.observe(pricingSection);
    return () => observer.disconnect();
  }, []);

  const glassBase = `
    relative overflow-hidden rounded-xl lg:rounded-2xl
    px-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-5 2xl:px-6 
    py-1 sm:py-1.5 md:py-2 lg:py-2.5 xl:py-2.75 2xl:py-3 
    text-white
    backdrop-blur-xl transition-all duration-300
    cursor-pointer

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
    <>
      <nav
        className={`
          fixed top-0 left-0 z-50
          w-full 
          h-11 sm:h-12 md:h-14 lg:h-16 xl:h-18 2xl:h-20
          px-2 sm:px-2.5 md:px-3 lg:px-4 xl:px-6 2xl:px-8
          flex items-center justify-between
          transition-transform duration-300
          ${hideNavbar ? "-translate-y-full" : "translate-y-0"}
          bg-[#031A1C]/80 backdrop-blur-2xl
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-2.75 2xl:gap-3 cursor-pointer flex-shrink-0"
          onClick={() => router.push("/")}
        >
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 object-contain"
          />
          <span className="text-white font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-none whitespace-nowrap">
            Treasurio
          </span>
        </div>

{/* Menü */}
<div
  className="
    flex-1 flex items-center 
    gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-10 
    ml-4 sm:ml-6 md:ml-3 lg:ml-4 xl:ml-8 2xl:ml-16 
    text-gray-300 
    text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-[13px] 2xl:text-sm
    [&>button]:inline-flex [&>button]:items-center [&>button]:justify-center
    [&>button]:px-0.5 sm:[&>button]:px-1 [&>button]:font-medium
    [&>button]:transition [&>button]:duration-150 [&>button]:ease-out
    [&>button]:cursor-pointer [&>button]:transform
    [&>button:hover]:text-teal-300
    [&>button:hover]:opacity-90
    [&>button:hover]:-translate-y-0.5
    [&>button]:whitespace-nowrap
    [&>button]:leading-none
  "
>
          <button onClick={() => router.push("/terminal/home")}>
            TERMINAL
          </button>

          <button
            disabled
            title="Coming Soon"
            className="opacity-40 cursor-not-allowed pointer-events-none"
          >
            LEARN
          </button>

          <button onClick={() => router.push("/download")}>API</button>
          <button onClick={() => router.push("/pricing")}>PRICING</button>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4 flex-shrink-0">
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <Button
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                }}
                className={
                  glassBase +
                  " border border-teal-400/50 bg-teal-400/10 hover:text-teal-200 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-[13px] 2xl:text-sm"
                }
              >
                LOG IN
              </Button>

              <Button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthOpen(true);
                }}
                className={
                  glassBase +
                  " border border-white/40 bg-white/5 hover:text-teal-200 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-[13px] 2xl:text-sm"
                }
              >
                SIGN UP
              </Button>
            </>
          )}
        </div>
      </nav>

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onChange={setAuthMode}
      />
    </>
  );
}