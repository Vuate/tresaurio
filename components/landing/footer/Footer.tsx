"use client";

export default function Footer() {
  return (
    <footer className="bg-[#031a1c] py-[80px] pb-[40px] text-white">
      <div className="h-px w-full bg-white/10" />

      <div className="mx-auto max-w-[1400px] px-8 pt-10
                      min-[1280px]:pr-12 min-[1536px]:pr-8">
        <div
          className="mb-[60px] grid grid-cols-4 gap-[80px]
                     max-[1024px]:grid-cols-2 max-[1024px]:gap-12
                     max-[600px]:grid-cols-1 max-[600px]:gap-8"
        >
          {/* Products */}
          <div>
            <h3 className="mb-5 text-lg font-bold">Products</h3>
            {["Terminal", "Analytics", "API"].map((item) => (
              <a
                key={item}
                className="mb-3 block cursor-pointer text-[15px] text-slate-300 transition-colors hover:text-[#19d8d0]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-lg font-bold">Company</h3>
            {["About us", "Terms of use", "Privacy Policy", "Careers"].map(
              (item) => (
                <a
                  key={item}
                  className="mb-3 block cursor-pointer text-[15px] text-slate-300 transition-colors hover:text-[#19d8d0]"
                >
                  {item}
                </a>
              )
            )}
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-lg font-bold">Support</h3>
            {["Help Center", "Contact", "FAQ", "Documentation"].map((item) => (
              <a
                key={item}
                className="mb-3 block cursor-pointer text-[15px] text-slate-300 transition-colors hover:text-[#19d8d0]"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div>
            <h3 className="mb-5 text-lg font-bold">Socials</h3>
            {["X (Twitter)", "Telegram", "Discord", "GitHub"].map((item) => (
              <a
                key={item}
                className="mb-3 block cursor-pointer text-[15px] text-slate-300 transition-colors hover:text-[#19d8d0]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-sm text-slate-400">
          © 2026 Treasurio. All rights reserved
        </div>
      </div>
    </footer>
  );
}
  