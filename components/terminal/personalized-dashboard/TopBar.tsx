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
      className="fixed top-0 left-0 right-0 z-50 h-14
        flex items-center justify-between px-6
        bg-[#031A1C]/95 backdrop-blur
        border-b border-white/10 select-none"
    >
      {/* SOL TARAF */}
      <div className="flex items-center gap-3">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center
            w-9 h-9 rounded-lg
            border border-white/10
            bg-[#041F20]/90
            text-teal-300
            hover:bg-teal-400/10
            transition"
          title="Geri"
        >
          ←
        </button>

        {/* LOGO + TEXT */}
        <div className="flex items-center gap-2">
          <img
            src="/treasurio.png"
            alt="Treasurio Logo"
            className="h-9 w-auto select-none"
            draggable={false}
          />
          <span className="text-lg font-extrabold text-teal-400 leading-none">
            Treasurio
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 ml-4">
          <button
            onClick={toggleSidebar}
            className="px-4 py-1.5 rounded-lg
              bg-[#041F20]/90
              border border-white/10
              text-teal-300 text-sm font-semibold
              hover:bg-teal-400/10 transition cursor-pointer"
          >
            Sidebar
          </button>

          <button
            onClick={toggleAddTool}
            className="px-4 py-1.5 rounded-lg
              bg-teal-400/10 border border-teal-400/30
              text-teal-300 text-sm font-semibold
              hover:bg-teal-400/20 transition cursor-pointer"
          >
            + Add Tool
          </button>
        </div>
      </div>

      {/* SAĞ TARAF */}
      <div className="flex items-center gap-3">
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
        ) : session?.user ? (
          /* Giriş yapmış kullanıcı */
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 text-sm font-semibold">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-sm text-white/80 hidden sm:block">
                {session.user.name || session.user.email?.split("@")[0]}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 rounded-lg
                bg-white/5 border border-white/10
                text-white/60 text-sm
                hover:bg-white/10 hover:text-white/80 transition"
            >
              Çıkış
            </button>
          </div>
        ) : (
          /* Giriş yapmamış kullanıcı */
          <button
            onClick={() => {
              setAuthMode("login");
              setShowAuthModal(true);
            }}
            className="group flex items-center gap-2 px-5 py-2 rounded-xl
              bg-gradient-to-r from-teal-500/20 to-teal-400/10
              border border-teal-400/40
              hover:from-teal-500/30 hover:to-teal-400/20
              hover:border-teal-400/60
              transition-all duration-300"
          >
            <svg
              className="w-4 h-4 text-teal-400 group-hover:text-teal-300 transition-colors"
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
            <span className="text-sm font-semibold text-teal-300 group-hover:text-teal-200 transition-colors">
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