import Link from "next/link";

export default function TradeCTA() {
  return (
    <div
      className="mt-12 lg:mt-16 rounded-xl border border-[#2563EB]/20 overflow-hidden"
      style={{ background: "linear-gradient(145deg, rgba(37,99,235,0.08) 0%, var(--card) 60%)" }}
    >
      <div className="relative px-4 sm:px-8 py-10 sm:py-14 text-center">
        {/* Subtle radial overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.07)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10">
          <h2
            className="font-extrabold text-foreground mb-4"
            style={{ fontSize: "clamp(1.35rem, 3.8vw, 2.2rem)", letterSpacing: "-0.025em" }}
          >
            Manage Your Portfolio Professionally
          </h2>
          <p className="text-[#71717A] max-w-xl mx-auto mb-8 text-[0.875rem] leading-[1.7]">
            View all your spot and futures positions on a single dashboard, track PnL,
            and optimize your portfolio with risk management.
          </p>
          <Link
            href="/personalized-dashboard"
            className="inline-flex items-center gap-2 bg-[#2563EB] border border-[#2563EB] hover:bg-[#1a55d5] hover:border-[#1a55d5] px-6 py-3 rounded-lg text-white font-semibold text-[0.9rem] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(37,99,235,0.38)] active:translate-y-0 active:shadow-none"
          >
            Go to Personalized Dashboard
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
