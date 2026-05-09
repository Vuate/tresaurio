import { FadeUp } from "@/components/landing/ui/FadeUp";

export function WhoIsItForSection() {
  return (
    <section id="who-is-it-for" className="py-[100px] bg-background">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp className="flex flex-col items-center text-center">
          <span className="text-xs font-bold tracking-[0.18em] uppercase text-brand mb-3">
            For Whom
          </span>
          <h2 className="text-[clamp(1.75rem,3.8vw,2.7rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-foreground mb-4">
            Who Is It For?
          </h2>
          <p className="text-base text-muted-foreground leading-[1.7] max-w-[720px]">
            Treasurio is a crypto management terminal built for professional traders who want to manage multiple
            exchanges from a single terminal, active investors tracking spot/futures positions and staking income,
            analysts monitoring whale movements and smart money flows, and teams requiring
            institutional-grade reporting.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
