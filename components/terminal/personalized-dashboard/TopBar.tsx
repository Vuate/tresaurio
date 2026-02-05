"use client";

import { usePersonalizedDashboardStore } from "@/store/personalizedDashboardStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "@/components/auth/AuthModal"; 

export default function TopBar() {
  const topBarRef = useRef<HTMLDivElement>(null);
  const toggleAddTool = usePersonalizedDashboardStore((s) => s.toggleAddTool);
  const toggleSidebar = usePersonalizedDashboardStore((s) => s.toggleSidebar);
  const setTopBarHeight = usePersonalizedDashboardStore((s) => s.setTopBarHeight);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  /* Yükseklik ölçümü */
  useEffect(() => {
    const measureHeight = () => {
      if (topBarRef.current) {
        const height = topBarRef.current.getBoundingClientRect().height;
        setTopBarHeight(height);
      }
    };

    measureHeight();
    window.addEventListener("resize", measureHeight);
    return () => window.removeEventListener("resize", measureHeight);
  }, [setTopBarHeight]);

  
  return (
    <div
      ref={topBarRef} 
      onMouseDown={(e) => e.preventDefault()}
      className="fixed top-0 left-0 right-0 z-50 
        h-11 sm:h-12 md:h-14
        flex items-center justify-between 
        px-2 sm:px-3 md:px-4 lg:px-6
        bg-[#031A1C]/95 backdrop-blur
        border-b border-white/10 select-none"
    >
      {/* SOL TARAF */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center
            w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 
            rounded-lg
            border border-white/10
            bg-[#041F20]/90
            text-teal-300 text-xs sm:text-sm md:text-base
            hover:bg-teal-400/10
            transition cursor-pointer flex-shrink-0"
          title="Geri"
        >
          ←
        </button>

        {/* LOGO + TEXT */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="h-6 sm:h-7 md:h-8 lg:h-9 w-auto select-none flex-shrink-0"
            draggable={false}
          />
          <span className="text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-teal-400 leading-none whitespace-nowrap">
            Treasurio
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 ml-2 sm:ml-3 md:ml-4 lg:ml-6">
          <button
            onClick={toggleSidebar}
            className="px-2 sm:px-2.5 md:px-3 lg:px-4 
              py-1 sm:py-1 md:py-1.5 
              rounded-lg
              bg-[#041F20]/90
              border border-white/10
              text-teal-300 
              text-[9px] sm:text-[10px] md:text-xs lg:text-sm 
              font-semibold
              hover:bg-teal-400/10 transition cursor-pointer
              whitespace-nowrap"
          >
            Sidebar
          </button>

          <button
            onClick={toggleAddTool}
            className="px-2 sm:px-2.5 md:px-3 lg:px-4 
              py-1 sm:py-1 md:py-1.5 
              rounded-lg
              bg-teal-400/10 border border-teal-400/30
              text-teal-300 
              text-[9px] sm:text-[10px] md:text-xs lg:text-sm 
              font-semibold
              hover:bg-teal-400/20 transition cursor-pointer
              whitespace-nowrap"
          >
            + Add Tool
          </button>
        </div>
      </div>

      {/* SAĞ TARAF */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-shrink-0">
        {status === "loading" ? (
          <div className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-white/10 animate-pulse" />
        ) : session?.user ? (
          /* Giriş yapmış kullanıcı */
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full border border-white/20"
                />
              ) : (
                <div className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-white/80 hidden lg:block whitespace-nowrap">
                {session.user.name || session.user.email?.split("@")[0]}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="px-2 sm:px-2 md:px-2.5 lg:px-3 
                py-1 sm:py-1 md:py-1.5 
                rounded-lg
                bg-white/5 border border-white/10
                text-white/60 
                text-[9px] sm:text-[10px] md:text-xs lg:text-sm
                hover:bg-white/10 hover:text-white/80 transition
                whitespace-nowrap"
            >
              Çıkış
            </button>
          </div>
        ) : (
          /* Giriş yapmamış kullanıcı - "Terminale Giriş" butonu */
          <button
            onClick={() => {
              setAuthMode("login");
              setShowAuthModal(true);
            }}
            className="group flex items-center gap-1 sm:gap-1.5 md:gap-2 
              px-2 sm:px-2.5 md:px-3 lg:px-5 
              py-1 sm:py-1 md:py-1.5 lg:py-2 
              rounded-lg lg:rounded-xl
              bg-gradient-to-r from-teal-500/20 to-teal-400/10
              border border-teal-400/40
              hover:from-teal-500/30 hover:to-teal-400/20
              hover:border-teal-400/60
              transition-all duration-300 cursor-pointer"
          >
            <svg
              className="w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-teal-400 group-hover:text-teal-300 transition-colors flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors whitespace-nowrap">
              Terminale Giriş
            </span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onChange={setAuthMode}
      />
    </div>
  );
}