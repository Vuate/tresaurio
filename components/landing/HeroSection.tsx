import { FadeUp } from "@/components/landing/ui/FadeUp";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-svh flex items-center justify-center py-32 overflow-hidden bg-background text-center"
    >
      <div className="grid-bg" />
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-7 flex flex-col items-center">

        <FadeUp>
          <div className="hero-badge">
            Professional Trading Analytics
          </div>
        </FadeUp>

        <FadeUp delay="d1">
          <h1 className="mt-0 text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.035em] text-foreground">
            Personalized Crypto<br />
            <span className="bg-gradient-to-br from-brand to-brand-cyan bg-clip-text text-transparent">
              Trading Terminal
            </span>
          </h1>
        </FadeUp>

        <FadeUp delay="d2">
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-[520px] leading-[1.7]">
            Analyze market depth, track smart money flows, and execute data-driven trades — all in one platform.
          </p>
        </FadeUp>

        <FadeUp delay="d3">
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#early-access"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand text-white text-sm font-semibold transition-all duration-200 hover:bg-[var(--brand-hover)] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(30,144,255,0.38)] active:bg-[var(--brand-active)] active:translate-y-px"
            >
              Early Access
            </Link>
            <Link
              href="#dashboard-preview"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent text-foreground text-sm font-semibold border border-border-sub transition-all duration-200 hover:border-brand hover:text-brand active:bg-[var(--brand-dim)]"
            >
              Explore
            </Link>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
