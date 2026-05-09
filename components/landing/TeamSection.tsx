"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/landing/ui/FadeUp";
import { SectionHead } from "@/components/landing/ui/SectionHead";

const LINKEDIN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-3.5 h-3.5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const members = [
  { name: "Emirhan Aşkın Bak", role: "CEO", photo: "/team/EABP.jpeg", linkedin: "https://www.linkedin.com/in/emirhan-a%C5%9Fk%C4%B1n-b-972b9121a/" },
  { name: "Yusuf Toraman", role: "CTO", photo: "/team/YTP.jpeg", linkedin: "https://www.linkedin.com/in/yusuf-toraman-582216252/" },
  { name: "Furkan Özdemirkan", role: "CFO", photo: "/team/FOP.jpeg", linkedin: "https://www.linkedin.com/in/furkan-%C3%B6zdemirkan-68855519a/" },
  { name: "Feyza Abbasoğlu", role: "Legal Advisor", photo: "/team/FAP.jpeg", linkedin: "https://www.linkedin.com/in/av-feyza-abbaso%C4%9Flu-8750941b3/" },
  { name: "Yunus Emre Tat", role: "Software Engineer", photo: "/team/YETP.jpeg", linkedin: "https://www.linkedin.com/in/yunusemretat/" },
  { name: "Ömer Faruk İpek", role: "Frontend Developer & Product Design", photo: "/team/OFIP.jpeg", linkedin: "https://www.linkedin.com/in/omer-faruk-ipek/" },
  { name: "Arda Emreci", role: "Backend Developer", photo: "/team/AEP.jpeg", linkedin: "https://www.linkedin.com/in/ardaemreci/" },
  { name: "Bünyamin Dönmez", role: "Backend Developer", photo: "/team/BDP.jpeg", linkedin: "https://www.linkedin.com/in/b%C3%BCnyamin-d%C3%B6nmez-209581305/" },
  { name: "Esma Berfin Akay", role: "Social Media & Marketing", photo: "/team/EBAP.jpeg", linkedin: "https://www.linkedin.com/in/esma-berfin-akay/" },
];

const allCards = [...members, ...members, ...members];

export function TeamSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const lastTouchRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0, pos: 0 });
  const dirLockRef = useRef<"h" | "v" | null>(null);
  const loopWidthRef = useRef(0);
  const cardWRef = useRef(0);
  const visibleCountRef = useRef(1);

  const CARD_GAP = 20;
  const MIN_CARD_W = 220;

  const [activeDot, setActiveDot] = useState(0);

  function getVisibleCount(vw: number) {
    return Math.max(1, Math.min(3, Math.floor((vw + CARD_GAP) / (MIN_CARD_W + CARD_GAP))));
  }

  function layout() {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const vw = viewport.offsetWidth;
    const visibleCount = getVisibleCount(vw);
    visibleCountRef.current = visibleCount;
    const gap = CARD_GAP;
    const cardW = (vw - gap * (visibleCount - 1)) / visibleCount;

    cardWRef.current = cardW;
    const loopWidth = members.length * (cardW + gap);
    loopWidthRef.current = loopWidth;

    Array.from(track.children).forEach((child) => {
      (child as HTMLElement).style.flex = `0 0 ${cardW}px`;
      (child as HTMLElement).style.marginRight = `${gap}px`;
    });

    track.style.gap = "0px";
    posRef.current = loopWidth;
    track.style.transform = `translateX(-${posRef.current}px)`;
  }

  function normalize() {
    const lw = loopWidthRef.current;
    if (lw <= 0) return;
    while (posRef.current >= 2 * lw) posRef.current -= lw;
    while (posRef.current < lw) posRef.current += lw;
  }

  function updateDot() {
    const lw = loopWidthRef.current;
    const cardW = cardWRef.current;
    const gap = CARD_GAP;
    if (lw <= 0 || cardW <= 0) return;
    const offset = posRef.current - lw;
    const idx = Math.round(offset / (cardW + gap));
    const real = ((idx % members.length) + members.length) % members.length;
    setActiveDot(Math.min(2, Math.floor(real / 3)));
  }

  function tick() {
    if (!pausedRef.current) {
      posRef.current += 0.3;
      normalize();
      updateDot();
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stepCarousel(dir: 1 | -1) {
    const vc = visibleCountRef.current;
    const step = vc * (cardWRef.current + CARD_GAP);
    posRef.current += dir * step;
    normalize();
    updateDot();
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  }

  function jumpToDot(dotIdx: number) {
    const gap = CARD_GAP;
    const targetIdx = dotIdx * 3;
    posRef.current = loopWidthRef.current + targetIdx * (cardWRef.current + gap);
    normalize();
    setActiveDot(dotIdx);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  }

  useEffect(() => {
    layout();
    rafRef.current = requestAnimationFrame(tick);

    const handleResize = (() => {
      let timer: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(layout, 120);
      };
    })();
    window.addEventListener("resize", handleResize);

    const track = trackRef.current;
    if (!track) return;

    const onTouchStart = (e: TouchEvent) => {
      lastTouchRef.current = Date.now();
      pausedRef.current = true;
      dirLockRef.current = null;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, pos: posRef.current };
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = touchStartRef.current.x - e.touches[0].clientX;
      const dy = touchStartRef.current.y - e.touches[0].clientY;

      if (!dirLockRef.current) {
        dirLockRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }
      if (dirLockRef.current === "v") return;

      e.preventDefault();
      const lw = loopWidthRef.current;
      let newPos = touchStartRef.current.pos + dx;
      if (newPos < 0 || newPos > 3 * lw) newPos = touchStartRef.current.pos + dx * 0.15;
      posRef.current = newPos;
      normalize();
      updateDot();
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      }
    };

    const onTouchEnd = () => {
      setTimeout(() => { pausedRef.current = false; }, 80);
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="team" className="py-[100px] bg-background overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp className="flex flex-col items-center">
          <SectionHead
            label="The Team"
            title="Built by Developers, for Traders"
            sub="The people behind Treasurio — combining modern engineering with deep crypto market expertise."
            center
          />
        </FadeUp>
      </div>

      {/* Carousel */}
      <div className="max-w-[1200px] mx-auto px-7 relative">
        {/* Prev */}
        <button
          onClick={() => stepCarousel(-1)}
          aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border-sub flex items-center justify-center text-muted-foreground hover:border-brand hover:text-brand transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Viewport — clip only x so hover translateY isn't cut off */}
        <div ref={viewportRef} className="overflow-x-clip py-5 px-10">
          <div
            ref={trackRef}
            className="team-carousel-track"
            onMouseEnter={() => { if (Date.now() - lastTouchRef.current > 500) pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
          >
            {allCards.map((m, i) => (
              <div
                key={`${m.name}-${i}`}
                className="team-card"
                aria-hidden={i < members.length || i >= members.length * 2 ? "true" : undefined}
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    width={96}
                    height={96}
                    className="team-photo w-24 h-24 rounded-full object-cover border-2 border-border transition-colors"
                  />
                  <div className="team-photo-ring" />
                </div>
                <div className="text-sm font-bold text-foreground mb-1">{m.name}</div>
                <div className="team-role text-xs text-muted-foreground mb-4">{m.role}</div>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand transition-colors"
                >
                  {LINKEDIN_ICON}
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => stepCarousel(1)}
          aria-label="Next"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border-sub flex items-center justify-center text-muted-foreground hover:border-brand hover:text-brand transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-7">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => jumpToDot(i)}
            aria-label={`Slide ${i + 1}`}
            className={`team-dot${activeDot === i ? " active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
}
