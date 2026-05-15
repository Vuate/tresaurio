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
    href: "#who-is-it-for",
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
    href: "#why-treasurio",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    label: "Team",
    href: "#team",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="7" r="3.5"/>
        <circle cx="16" cy="7" r="3.5"/>
        <path d="M2 21c0-3.87 2.69-7 6-7h8c3.31 0 6 3.13 6 7"/>
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
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
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

const mainNavItems = [
  {
    label: "Platform" as const,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    label: "How It Works" as const,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: "Features" as const,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    label: "Contact" as const,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

function scrollToSection(id: string, router: ReturnType<typeof import("next/navigation").useRouter>) {
  const sectionId = id.replace("#", "");
  if (window.location.pathname === "/") {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  } else {
    router.push(`/#${sectionId}`);
  }
}

const desktopNavMap: Record<string, string> = {
  Platform: "dashboard-preview",
  "How It Works": "how-it-works",
  Features: "features",
  Contact: "early-access",
};

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
                if (item.href.startsWith("#")) {
                  scrollToSection(item.href, router);
                } else {
                  router.push(item.href);
                }
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
                <span className="ml-1.5 text-[0.7rem] text-foreground/35">Coming Soon</span>
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
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const aboutRef = useRef<HTMLLIElement>(null);
  const appRef = useRef<HTMLLIElement>(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [lang, setLang] = useState<"TR" | "EN">("EN");
  const { theme, setTheme } = useTheme();

  const isLoggedIn = status === "authenticated" && session?.user;

  const openDrawer = () => {
    setMobileMenuOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawerVisible(true));
    });
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setTimeout(() => setMobileMenuOpen(false), 280);
  };

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
    px-3.5 lg:px-4 xl:px-5 py-2 text-sm font-semibold rounded-lg
    bg-[#2563EB] text-white border border-[#2563EB]
    transition-all duration-200 cursor-pointer shrink-0
    hover:bg-[#1a55d5] hover:border-[#1a55d5]
    hover:-translate-y-0.5
    active:translate-y-0
  `;

  const btnSignup = `
    px-3.5 lg:px-4 xl:px-5 py-2 text-sm font-semibold rounded-lg
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
          px-4 sm:px-6 md:px-8 lg:px-6 xl:px-12
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
        <ul className="hidden lg:flex items-stretch justify-center gap-3 xl:gap-5.5 list-none flex-1 self-stretch">
          {(["Platform", "How It Works", "Features"] as const).map((label) => (
            <li key={label} className="flex items-center">
              <button
                onClick={() => scrollToSection(desktopNavMap[label], router)}
                className="inline-flex items-center leading-none whitespace-nowrap text-[0.855rem] font-medium text-foreground/60 hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                {label}
              </button>
            </li>
          ))}

          {/* About dropdown */}
          <li className="relative flex items-center" ref={aboutRef}>
            <button
              onClick={() => { setAboutOpen(!aboutOpen); setAppOpen(false); }}
              className={`inline-flex items-center leading-none whitespace-nowrap gap-1 text-[0.855rem] font-medium transition-colors duration-200 cursor-pointer ${
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
            <button
              onClick={() => scrollToSection(desktopNavMap["Contact"], router)}
              className="inline-flex items-center leading-none whitespace-nowrap text-[0.855rem] font-medium text-foreground/60 hover:text-foreground transition-colors duration-200 cursor-pointer"
            >
              Contact
            </button>
          </li>

          {/* App dropdown */}
          <li className="relative flex items-center" ref={appRef}>
            <button
              onClick={() => { setAppOpen(!appOpen); setAboutOpen(false); }}
              className={`inline-flex items-center leading-none whitespace-nowrap gap-1 text-[0.855rem] font-medium transition-colors duration-200 cursor-pointer ${
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

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <div className="flex items-center rounded-lg border border-border-sub overflow-hidden">
            <button
              disabled
              title="Coming Soon"
              className="px-3 py-1.5 text-xs font-semibold cursor-not-allowed opacity-30 bg-transparent text-foreground/50"
            >
              TR
            </button>
            <button
              className="px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer bg-[#2563EB] text-white"
            >
              EN
            </button>
          </div>
          <ThemeToggle />
          {!isLoggedIn && (
            <Button
              onClick={() => router.push("/personalized-dashboard")}
              className={btnLogin}
            >
              Start Free
            </Button>
          )}
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Button
              onClick={() => { setAuthMode("login"); setAuthOpen(true); }}
              className={btnSignup}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={openDrawer}
          className="lg:hidden z-10 text-foreground p-2 hover:bg-foreground/8 rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-110 transition-opacity duration-280 ${drawerVisible ? "opacity-100" : "opacity-0"}`}
            onClick={handleDrawerClose}
          />

          {/* Drawer Panel */}
          <div
            className={`lg:hidden fixed top-0 right-0 h-full w-[min(340px,88vw)] bg-background z-120 flex flex-col shadow-2xl transition-transform duration-280 ease-out ${drawerVisible ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-border-sub shrink-0">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => { router.push("/"); handleDrawerClose(); }}
              >
                <img src="/treasurio.png" alt="Treasurio" className="w-7 h-7 object-contain" />
                <span className="text-foreground font-extrabold text-[1rem] tracking-tight">Treasurio</span>
              </div>
              <button
                onClick={handleDrawerClose}
                className="w-8 h-8 rounded-full bg-foreground/6 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Nav */}
            <div className="flex-1 overflow-y-auto py-2">

              {/* Main links */}
              <div className="px-2.5 mb-1">
                {mainNavItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { scrollToSection(desktopNavMap[item.label], router); handleDrawerClose(); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left group hover:bg-foreground/5 transition-all cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-foreground/6 text-[#2563EB] group-hover:bg-[#2563EB]/12 transition-colors shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-[0.875rem] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-5 my-2 border-t border-border-sub" />

              {/* About group */}
              <div className="px-2.5 mb-1">
                <p className="px-3 mb-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-foreground/30">
                  About
                </p>
                {aboutItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { scrollToSection(item.href, router); handleDrawerClose(); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left group hover:bg-foreground/5 transition-all cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-[9px] bg-foreground/6 text-[#2563EB] group-hover:bg-[#2563EB]/12 transition-colors shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-[0.875rem] font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="mx-5 my-2 border-t border-border-sub" />

              {/* App group */}
              <div className="px-2.5">
                <p className="px-3 mb-1.5 text-[0.6rem] font-bold uppercase tracking-widest text-foreground/30">
                  App
                </p>
                {appItems.map((item) => (
                  <button
                    key={item.label}
                    disabled={item.disabled}
                    onClick={() => { if (!item.disabled) { router.push(item.href); handleDrawerClose(); } }}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all group ${
                      item.disabled
                        ? "cursor-not-allowed"
                        : "hover:bg-foreground/5 cursor-pointer"
                    }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-[9px] shrink-0 transition-colors ${
                      item.disabled
                        ? "bg-foreground/4 text-foreground/25"
                        : "bg-foreground/6 text-[#2563EB] group-hover:bg-[#2563EB]/12"
                    }`}>
                      {item.icon}
                    </span>
                    <span className={`flex-1 text-[0.875rem] font-medium transition-colors ${
                      item.disabled
                        ? "text-foreground/30"
                        : "text-foreground/70 group-hover:text-foreground"
                    }`}>
                      {item.label}
                    </span>
                    {item.disabled && (
                      <span className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md bg-foreground/6 text-foreground/30 shrink-0">
                        Coming Soon
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border-sub">

              {/* Auth section */}
              <div className="px-4 pt-4 pb-3">
                {isLoggedIn ? (
                  <UserMenu variant="mobile" onClose={handleDrawerClose} />
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => { router.push("/personalized-dashboard"); handleDrawerClose(); }}
                      className="w-full bg-[#2563EB] text-white border border-[#2563EB] hover:bg-[#1a55d5] hover:border-[#1a55d5] py-2.5 rounded-xl font-semibold cursor-pointer transition-all duration-200 text-sm"
                    >
                      Start Free
                    </Button>
                    <Button
                      onClick={() => { setAuthMode("login"); setAuthOpen(true); handleDrawerClose(); }}
                      className="w-full bg-transparent text-foreground border border-border hover:bg-foreground/5 py-2.5 rounded-xl font-medium cursor-pointer transition-all duration-200 text-sm"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              {/* Lang + Theme controls */}
              <div className="px-4 pb-5 pt-1 flex items-center gap-2.5">
                {/* Language toggle */}
                <div className="flex items-center rounded-lg border border-border-sub overflow-hidden shrink-0">
                  <button
                    disabled
                    title="Coming Soon"
                    className="px-3.5 py-1.5 text-[0.72rem] font-semibold cursor-not-allowed opacity-30 bg-transparent text-foreground/45"
                  >
                    TR
                  </button>
                  <button
                    className="px-3.5 py-1.5 text-[0.72rem] font-semibold transition-all duration-150 cursor-pointer bg-[#2563EB] text-white"
                  >
                    EN
                  </button>
                </div>
                {/* Theme toggle */}
                <div className="flex items-center flex-1 rounded-lg border border-border-sub overflow-hidden">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-1.5 text-[0.72rem] font-semibold transition-all duration-150 cursor-pointer capitalize ${
                        theme === t
                          ? "bg-foreground/10 text-foreground"
                          : "bg-transparent text-foreground/40 hover:text-foreground/70"
                      }`}
                    >
                      {t === "light" ? "Light" : t === "dark" ? "Dark" : "System"}
                    </button>
                  ))}
                </div>
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
