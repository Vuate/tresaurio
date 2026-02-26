import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main
     className="min-h-screen bg-black text-white flex flex-col overflow-hidden"
      style={{ fontFamily: "var(--font-geist-sans)" }}
    >

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative">

        {/* Subtle glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo large */}
        <div className="relative mb-8">
        <Image
            src="/treasurio.png"
            alt="Treasurio"
            width={220}
            height={220}
             className="opacity-90 w-[clamp(120px,30vw,220px)] h-auto"
        />
        </div>

        {/* Divider */}
        <div
          className="mb-8"
          style={{
            width: "40px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />

        {/* Text */}
        <h2 className="text-xl font-semibold mb-3 text-white/85">
           Page not found
        </h2>
        <p className="text-sm max-w-xs leading-relaxed mb-10 text-white/35">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Button */}
        <Link
          href="/terminal/home"
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 text-white/80 hover:text-white hover:bg-white/12 hover:border-white/25"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12h18M3 12l6-6M3 12l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Bottom */}
      <div className="flex justify-center pb-8">
        <span
          className="text-xs tracking-[0.2em] text-white/10"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          TREASURIO · 404
        </span>
      </div>
    </main>
  );
}
