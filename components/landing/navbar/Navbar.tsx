"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const glassBase = `
    relative overflow-hidden rounded-lg
    px-5 md:px-6 lg:px-7
    py-2 md:py-2.5
    text-white font-medium
    backdrop-blur-xl transition-all duration-300
    cursor-pointer
    text-sm

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
        ref={mobileMenuRef}
        className={`
          fixed top-0 left-0 z-[100]
          w-full 
          h-16 md:h-20
          px-4 sm:px-6 md:px-8 lg:px-12
          flex items-center justify-between
          transition-transform duration-300
          ${hideNavbar ? "-translate-y-full" : "translate-y-0"}
          bg-[#031A1C]/80 backdrop-blur-2xl
        `}
      >
        <div
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 z-10"
          onClick={() => router.push("/")}
        >
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 object-contain"
          />
          <span className="text-white font-bold text-xl md:text-2xl lg:text-2xl leading-none whitespace-nowrap tracking-tight">
            Treasurio
          </span>
        </div>

        <div className="hidden md:flex flex-1 items-center gap-4 lg:gap-6 xl:gap-8 ml-8 lg:ml-12 text-gray-300 text-sm">
          <button 
            onClick={() => router.push("/terminal/home")}
            className="font-medium transition duration-150 hover:text-teal-300 hover:-translate-y-0.5 transform cursor-pointer"
          >
            TERMINAL
          </button>

          <button
            disabled
            title="Coming Soon"
            className="opacity-40 cursor-not-allowed font-medium"
          >
            LEARN
          </button>

          <button 
              disabled
              title="Coming Soon"
              className="opacity-40 cursor-not-allowed font-medium"
            >
            API
          </button>
          
          <button 
            onClick={() => router.push("/pricing")}
            className="font-medium transition duration-150 hover:text-teal-300 hover:-translate-y-0.5 transform cursor-pointer"
          >
            PRICING
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
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
                  " border border-teal-400/50 bg-teal-400/10 hover:text-teal-200"
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
                  " border border-white/40 bg-white/5 hover:text-teal-200"
                }
              >
                SIGN UP
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden z-10 text-white p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#031A1C] backdrop-blur-2xl border-t border-white/10 z-[100]">
            <div className="flex flex-col p-6 gap-4">
              {/* Mobile Navigation */}
              <div className="flex flex-col gap-3 pb-4 border-b border-white/10">
                <button
                  onClick={() => {
                    router.push("/terminal/home");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-300 font-medium py-2 hover:text-teal-300 transition cursor-pointer"
                >
                  TERMINAL
                </button>

                <button
                  disabled
                  className="text-left text-gray-300/40 font-medium py-2 cursor-not-allowed"
                >
                  LEARN
                </button>

                <button
                  disabled
                  className="text-left text-gray-300/40 font-medium py-2 cursor-not-allowed"
                >
                  API
                </button>

                <button
                  onClick={() => {
                    router.push("/pricing");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-300 font-medium py-2 hover:text-teal-300 transition cursor-pointer"
                >
                  PRICING
                </button>
              </div>

              {/* Mobile Auth Buttons / User Menu */}
              <div className="flex flex-col gap-3 pt-2">
                {isLoggedIn ? (
                  <UserMenu variant="mobile" />
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setAuthMode("login");
                        setAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border border-teal-400/30 bg-teal-900/40 hover:bg-teal-900/60 text-white py-3 rounded-lg transition-all cursor-pointer"
                    >
                      LOG IN
                    </Button>

                    <Button
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border border-teal-400/30 bg-teal-900/40 hover:bg-teal-900/60 text-white py-3 rounded-lg transition-all cursor-pointer"
                    >
                      SIGN UP
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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