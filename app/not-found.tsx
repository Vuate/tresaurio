import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative">

        {/* Subtle glow */}
        <div className="absolute pointer-events-none w-150 h-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/3 blur-3xl" />

        {/* Logo */}
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
        <div className="mb-8 w-10 h-0.5 bg-linear-to-r from-transparent via-foreground/30 to-transparent" />

        {/* Text */}
        <h2 className="text-xl font-semibold mb-3 text-foreground/85">
          Page not found
        </h2>
        <p className="text-sm max-w-xs leading-relaxed mb-10 text-foreground/35">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* Button */}
        <Link
          href="/terminal/home"
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 text-foreground/70 hover:text-foreground bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 hover:border-foreground/20"
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
        <span className="font-mono text-xs tracking-[0.2em] text-foreground/10">
          TREASURIO · 404
        </span>
      </div>
    </main>
  );
}
