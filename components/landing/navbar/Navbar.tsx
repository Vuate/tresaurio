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
    relative overflow-hidden rounded-2xl 
    px-5 xl:px-5.5 2xl:px-6 
    py-2.5 xl:py-2.75 2xl:py-3 
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
          h-16 xl:h-18 2xl:h-20
          px-6 xl:px-7 2xl:px-8
          flex items-center justify-between
          transition-transform duration-300
          ${hideNavbar ? "-translate-y-full" : "translate-y-0"}
          bg-[#031A1C]/80 backdrop-blur-2xl
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 xl:gap-2.75 2xl:gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 object-contain"
          />
          <span className="text-white font-semibold text-2xl xl:text-[28px] 2xl:text-3xl leading-none">
            Treasurio
          </span>
        </div>

        {/* Menü */}
        <div
          className="
            flex-1 flex items-center 
            gap-8 xl:gap-9 2xl:gap-10 
            ml-12 xl:ml-14 2xl:ml-16 
            text-gray-300 
            text-xs xl:text-[13px] 2xl:text-sm
            [&>button]:inline-block [&>button]:px-1 [&>button]:font-medium
            [&>button]:transition [&>button]:duration-150 [&>button]:ease-out
            [&>button]:cursor-pointer [&>button]:transform
            [&>button:hover]:text-teal-300
            [&>button:hover]:opacity-90
            [&>button:hover]:-translate-y-0.5
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
        <div className="flex items-center gap-3 xl:gap-3.5 2xl:gap-4">
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
                  " border border-teal-400/50 bg-teal-400/10 hover:text-teal-200 text-xs xl:text-[13px] 2xl:text-sm"
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
                  " border border-white/40 bg-white/5 hover:text-teal-200 text-xs xl:text-[13px] 2xl:text-sm"
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