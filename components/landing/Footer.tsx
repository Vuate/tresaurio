import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-2 border-brand bg-background">
      <div className="max-w-[1200px] mx-auto px-7 py-16">
        <div className="flex flex-col lg:flex-row gap-12 justify-between mb-12">
          {/* Brand */}
          <div className="max-w-[280px]">
            <Link href="#" className="flex items-center gap-2.5 mb-3 no-underline">
              <Image src="/logo.png" alt="Treasurio" width={28} height={28} className="object-contain" />
              <span className="text-lg font-extrabold tracking-[-0.02em] text-foreground">Treasurio</span>
            </Link>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-brand mb-3">
              Professional Crypto Trading Analytics
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Analyze orderbook depth, whale movements, and exchange flow data in one platform.
            </p>
          </div>

          {/* Columns */}
          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-4">Product</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/terminal/home" className="text-sm text-muted-foreground hover:text-brand transition-colors">Terminal</Link></li>
                <li><Link href="/personalized-dashboard" className="text-sm text-muted-foreground hover:text-brand transition-colors">Personalized Dashboard</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-brand transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-4">Company</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/#how-it-works" className="text-sm text-muted-foreground hover:text-brand transition-colors">How It Works</Link></li>
                <li><Link href="/#who-is-it-for" className="text-sm text-muted-foreground hover:text-brand transition-colors">Who Is It For?</Link></li>
                <li><Link href="/#why-treasurio" className="text-sm text-muted-foreground hover:text-brand transition-colors">Why Treasurio?</Link></li>
                <li><Link href="/#team" className="text-sm text-muted-foreground hover:text-brand transition-colors">Team</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-4">Connect</h4>
              <ul className="flex flex-col gap-3">
                <li><Link href="/#early-access" className="text-sm text-muted-foreground hover:text-brand transition-colors">Contact</Link></li>
                <li className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href="mailto:treasurio@treasurio.xyz" className="text-sm text-muted-foreground hover:text-brand transition-colors">
                    treasurio@treasurio.xyz
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground flex-shrink-0 mt-0.5">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-sm text-muted-foreground leading-snug">
                    Metropol İstanbul C1 Blok, Ertuğrul Gazi Sokak, Ataşehir / İstanbul
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">© 2026 Treasurio. All rights reserved.</p>
          <span className="text-xs text-muted-foreground/60">
            Institutional Market Depth • Liquidity Analysis • Risk Management • AI Analytics
          </span>
        </div>
      </div>
    </footer>
  );
}
