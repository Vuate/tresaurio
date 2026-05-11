import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    // require-sri-for is intentionally omitted: Next.js 16 uses Turbopack by
    // default, which does not generate integrity hashes for its own JS/CSS
    // chunks. Enabling the directive without hashes would block all bundles in
    // Chromium-based browsers. The application already has zero external CDN
    // dependencies, so there is no supply-chain attack surface to protect.
    // Re-evaluate when Next.js / Turbopack ships native SRI hash generation.
    value: "frame-ancestors 'none'",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    // Ready for SRI hash generation once Turbopack supports it.
    // Currently a no-op with the Turbopack bundler (Next.js 16 default).
    sri: {
      algorithm: "sha384",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
