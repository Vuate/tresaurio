"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

type NavItem = {
  label: string;
  href: string;
  disabled?: boolean;
  icon: React.ReactNode;
};

const aboutItems: NavItem[] = [
  {
    label: "Who Is It For?",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: "Why Treasurio?",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    label: "Team",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
];

const appItems: NavItem[] = [
  {
    label: "Personalized Dashboard",
    href: "/personalized-dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Terminal",
    href: "/terminal/home",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/>
        <line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    label: "Learn",
    href: "#",
    disabled: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    label: "API",
    href: "#",
    disabled: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
];

function DropdownMenu({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="absolute top-full left-0 z-1001 min-w-47.5 pt-1">
      <div className="bg-card border border-border-sub rounded-xl p-1.5 shadow-lg">
        {items.map((item) => (
          <button
            key={item.label}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                router.push(item.href);
                onClose();
              }
            }}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg w-full text-left transition-all duration-150 ${
              item.disabled
                ? "opacity-35 cursor-not-allowed"
                : "hover:bg-foreground/6 cursor-pointer"
            }`}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-[7px] bg-foreground/6 text-[#2563EB] shrink-0">
              {item.icon}
            </span>
            <span className="text-[0.84rem] font-medium text-foreground/70 whitespace-nowrap">
              {item.label}
              {item.disabled && (
                <span className="ml-1.5 text-[0.7rem] text-foreground/35">Soon</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [hideNavbar, setHideNavbar] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const aboutRef = useRef<HTMLLIElement>(null);
  const appRef = useRef<HTMLLIElement>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { theme, setTheme } = useTheme();

  const isLoggedIn = status === "authenticated" && session?.user;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

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
      if (aboutOpen && aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutOpen(false);
      }
      if (appOpen && appRef.current && !appRef.current.contains(event.target as Node)) {
        setAppOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [aboutOpen, appOpen]);

  const btnLogin = `
    px-5 md:px-6 py-2 md:py-2.5 text-sm font-semibold rounded-lg
    bg-[#2563EB] text-white border border-[#2563EB]
    transition-all duration-200 cursor-pointer shrink-0
    hover:bg-[#1a55d5] hover:border-[#1a55d5]
    hover:-translate-y-0.5 hover:shadow-[0_4px_18px_rgba(37,99,235,0.45)]
    active:translate-y-0 active:shadow-none
  `;

  const btnSignup = `
    px-5 md:px-6 py-2 md:py-2.5 text-sm font-semibold rounded-lg
    bg-transparent text-foreground border border-[#2563EB]/40
    transition-all duration-200 cursor-pointer shrink-0
    hover:bg-[#2563EB]/10 hover:border-[#2563EB]/70
    hover:-translate-y-0.5
    active:translate-y-0
  `;

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 z-100
          w-full
          h-16 md:h-20
          px-4 sm:px-6 md:px-8 lg:px-12
          flex items-center justify-between
          transition-transform duration-300
          ${hideNavbar ? "-translate-y-full" : "translate-y-0"}
          bg-background/85 backdrop-blur-2xl border-b border-border-sub
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0 z-10"
          onClick={() => router.push("/")}
        >
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="w-8 h-8 md:w-9 md:h-9 object-contain"
          />
          <span className="text-foreground font-extrabold text-[1.1rem] leading-none whitespace-nowrap tracking-tight">
            Treasurio
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-stretch justify-center gap-5.5 list-none flex-1 self-stretch">
          {(["Platform", "How It Works", "Features"] as const).map((label) => (
            <li key={label} className="flex items-center">
              <button className="inline-flex items-center leading-none text-[0.855rem] font-medium text-foreground/60 hover:text-foreground transition-colors duration-200 cursor-pointer">
                {label}
              </button>
            </li>
          ))}

          {/* About dropdown */}
          <li className="relative flex items-center" ref={aboutRef}>
            <button
              onClick={() => { setAboutOpen(!aboutOpen); setAppOpen(false); }}
              className={`inline-flex items-center leading-none gap-1 text-[0.855rem] font-medium transition-colors duration-200 cursor-pointer ${
                aboutOpen ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              About
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {aboutOpen && (
              <DropdownMenu items={aboutItems} onClose={() => setAboutOpen(false)} />
            )}
          </li>

          <li className="flex items-center">
            <button className="inline-flex items-center leading-none text-[0.855rem] font-medium text-foreground/60 hover:text-foreground transition-colors duration-200 cursor-pointer">
              Contact
            </button>
          </li>

          {/* App dropdown */}
          <li className="relative flex items-center" ref={appRef}>
            <button
              onClick={() => { setAppOpen(!appOpen); setAboutOpen(false); }}
              className={`inline-flex items-center leading-none gap-1 text-[0.855rem] font-medium transition-colors duration-200 cursor-pointer ${
                appOpen ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              App
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`transition-transform duration-200 ${appOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {appOpen && (
              <DropdownMenu items={appItems} onClose={() => setAppOpen(false)} />
            )}
          </li>
        </ul>

        {/* Desktop Right — dokunulmadı */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <ThemeToggle />
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <Button
                onClick={() => { setAuthMode("login"); setAuthOpen(true); }}
                className={btnLogin}
              >
                LOG IN
              </Button>
              <Button
                onClick={() => { setAuthMode("signup"); setAuthOpen(true); }}
                className={btnSignup}
              >
                SIGN UP
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden z-10 text-foreground p-2 hover:bg-foreground/8 rounded-lg transition-colors cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-110"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Panel */}
          <div className="lg:hidden fixed top-0 right-0 h-full w-[min(380px,85vw)] bg-background z-120 flex flex-col shadow-2xl overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border-sub shrink-0">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => { router.push("/"); setMobileMenuOpen(false); }}
              >
                <img src="/treasurio.png" alt="Treasurio Logo" className="w-8 h-8 object-contain" />
                <span className="text-foreground font-extrabold text-[1.1rem] tracking-tight">Treasurio</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-foreground/8 flex items-center justify-center text-foreground/60 hover:text-foreground transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav linkleri */}
            <div className="flex flex-col px-5 pt-2">
              {(["Platform", "How It Works", "Features", "Contact"] as const).map((label) => (
                <button
                  key={label}
                  className="text-left text-foreground/70 font-medium py-3 border-b border-border-sub hover:text-foreground transition cursor-pointer text-[0.9rem]"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* About grubu */}
            <div className="px-5 pt-4">
              <p className="text-foreground/35 text-[0.66rem] font-semibold uppercase tracking-widest mb-1">About</p>
              {aboutItems.map((item) => (
                <button
                  key={item.label}
                  className="text-left text-foreground/65 font-medium py-2.5 border-b border-border-sub w-full hover:text-foreground transition cursor-pointer text-[0.875rem]"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* App grubu */}
            <div className="px-5 pt-4">
              <p className="text-foreground/35 text-[0.66rem] font-semibold uppercase tracking-widest mb-1">App</p>
              {appItems.map((item) => (
                <button
                  key={item.label}
                  disabled={item.disabled}
                  onClick={() => { if (!item.disabled) { router.push(item.href); setMobileMenuOpen(false); } }}
                  className={`text-left font-medium py-2.5 border-b border-border-sub w-full transition text-[0.875rem] flex items-center justify-between ${
                    item.disabled ? "text-foreground/25 cursor-not-allowed" : "text-foreground/65 hover:text-foreground cursor-pointer"
                  }`}
                >
                  {item.label}
                  {item.disabled && <span className="text-[0.65rem] text-foreground/30 font-medium">Soon</span>}
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Auth */}
            <div className="px-5 pt-4 pb-4 border-t border-border-sub">
              {isLoggedIn ? (
                <UserMenu variant="mobile" onClose={() => setMobileMenuOpen(false)} />
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={() => { setAuthMode("signup"); setAuthOpen(true); setMobileMenuOpen(false); }}
                    className="w-full bg-[#2563EB] text-white border border-[#2563EB] hover:bg-[#1a55d5] py-3 rounded-xl font-semibold cursor-pointer transition-all duration-200"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    onClick={() => { setAuthMode("login"); setAuthOpen(true); setMobileMenuOpen(false); }}
                    className="w-full bg-transparent text-foreground border border-border hover:bg-foreground/5 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Tema */}
            <div className="px-5 pb-6 pt-3 border-t border-border-sub">
              <div className="flex items-center gap-2">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-2 rounded-lg text-[0.78rem] font-medium transition-all duration-150 cursor-pointer border ${
                      theme === t
                        ? "bg-foreground/8 border-foreground/20 text-foreground"
                        : "bg-transparent border-border-sub text-foreground/45 hover:text-foreground/70"
                    }`}
                  >
                    {t === "light" ? "Light" : t === "dark" ? "Dark" : "System"}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onChange={setAuthMode}
      />
    </>
  );
}
