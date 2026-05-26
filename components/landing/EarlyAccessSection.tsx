"use client";

import { useRef, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { FadeUp } from "@/components/landing/ui/FadeUp";
import { SectionHead } from "@/components/landing/ui/SectionHead";

type Status = "idle" | "loading" | "success" | "error";

export function EarlyAccessSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("lang", "en");

      const res = await apiFetch("/api/submit-form", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        formRef.current?.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.message || "An error occurred. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("An error occurred. Please try again.");
    }
  }

  return (
    <section id="early-access" className="py-[100px] bg-surface">
      <div className="max-w-[1200px] mx-auto px-7">
        <FadeUp className="flex flex-col items-center">
          <SectionHead
            label="Early Access"
            title="Join the List"
            sub="Sign up for the Treasurio early access list and be the first to know when the platform launches."
            center
          />
        </FadeUp>

        <FadeUp delay="d1" className="max-w-[720px] mx-auto">
          <div className="bg-card border border-border-sub rounded-2xl p-8 sm:p-10">
            {status === "success" && (
              <div className="form-alert success show">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Registration received. We will contact you as soon as possible.</span>
              </div>
            )}

            {status === "error" && (
              <div className="form-alert error show">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMsg}</span>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Full Name <em className="not-italic text-brand">*</em>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border-sub text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Email <em className="not-italic text-brand">*</em>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border-sub text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Telegram Username</label>
                  <input
                    type="text"
                    name="telegram"
                    placeholder="@username"
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border-sub text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-foreground">Your Message</label>
                  <textarea
                    name="message"
                    placeholder="Your expectations for the platform..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border-sub text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-lg bg-brand text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[var(--brand-hover)] hover:-translate-y-px hover:shadow-[0_6px_22px_rgba(30,144,255,0.38)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {status === "loading" && <span className="spin" />}
                  Join Early Access List
                </button>
              </div>
            </form>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
