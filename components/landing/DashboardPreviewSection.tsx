import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/landing/ui/FadeUp";
import { SectionHead } from "@/components/landing/ui/SectionHead";

export function DashboardPreviewSection() {
  return (
    <section id="dashboard-preview" className="py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp className="flex flex-col items-center">
          <SectionHead
            label="Platform"
            title="Platform Preview"
            sub="Powerful tools, intuitive interface."
            center
          />
        </FadeUp>

        <FadeUp delay="d1">
          <div className="dash-wrap">
            <div className="dash-border" />
            <div className="dash-inner">
              <Image
                src="/PDF.jpeg"
                alt="Treasurio Dashboard"
                width={1100}
                height={620}
                className="w-full h-auto block"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-2 flex items-end justify-center pb-8">
              <Link
                href="/personalized-dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white text-sm font-semibold transition-all duration-200 hover:bg-[var(--brand-hover)] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(30,144,255,0.38)]"
              >
                Try the Platform Live
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
