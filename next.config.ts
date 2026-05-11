import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Full Content-Security-Policy for the Treasurio trading platform.
//
// script-src 'unsafe-inline': Next.js App Router injects inline hydration
// scripts that cannot be hashed until Turbopack ships native SRI support
// (experimental.sri below is pre-configured and activates automatically).
// Upgrade path: nonce-based CSP via middleware.ts once Next.js stabilises
// the nonce API — see docs/security/cdn-audit.md.
//
// connect-src: browser makes direct WebSocket/REST calls to exchange APIs
// (Binance, OKX, Bybit, Coinbase) and data providers (CoinGecko, DeFiLlama,
// Alternative.me). All values audited in docs/security/cdn-audit.md.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // next/font/google self-hosts at build time — no external font CDN needed.
  "font-src 'self'",
  // Google OAuth profile pictures; data: for SVG/canvas; blob: for exports.
  "img-src 'self' data: blob: https://*.googleusercontent.com",
  [
    "connect-src 'self'",
    // Binance REST + data mirror
    "https://api.binance.com",
    "https://data-api.binance.vision",
    // OKX REST
    "https://www.okx.com",
    // Bybit REST
    "https://api.bybit.com",
    // Coinbase REST
    "https://api.exchange.coinbase.com",
    // Market data providers
    "https://api.coingecko.com",
    "https://api.alternative.me",
    "https://api.llama.fi",
    "https://bridges.llama.fi",
    // Exchange WebSocket streams
    "wss://stream.binance.com:9443",
    "wss://fstream.binance.com",
    "wss://ws.okx.com:8443",
    "wss://stream.bybit.com",
    "wss://ws-feed.exchange.coinbase.com",
    // Next.js HMR websocket (dev only)
    ...(isDev ? ["ws://localhost:*", "ws://127.0.0.1:*"] : []),
  ].join(" "),
  // Clickjacking: covered by X-Frame-Options DENY (legacy) + frame-ancestors (CSP).
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // Force HTTPS upgrades in production; omit in dev to avoid localhost issues.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
  "report-uri /api/csp-report",
];

const cspHeader = cspDirectives.join("; ");

const securityHeaders = [
  // Legacy clickjacking protection (browsers that predate CSP frame-ancestors).
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
    value: cspHeader,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
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
