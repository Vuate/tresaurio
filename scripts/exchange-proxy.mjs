#!/usr/bin/env node
// scripts/exchange-proxy.mjs
//
// Authenticated HTTP CONNECT proxy for exchange API traffic.
// Deploy on a VPS with a static IP. Users whitelist that IP on their
// exchange accounts. Tresaurio (on Vercel) routes exchange requests
// through this proxy so the outbound IP is always the VPS.
//
// Security model:
//   1. Bearer-token authentication (Proxy-Authorization header)
//   2. Strict domain allowlist — only exchange API hosts are permitted
//   3. Per-IP rate limiting
//   4. Connection cap
//   5. The proxy NEVER sees API keys or request bodies — it only
//      creates a TCP tunnel; TLS is end-to-end between Vercel and
//      the exchange.
//
// Usage:
//   PROXY_TOKEN=<64-char-hex> node exchange-proxy.mjs
//
// Generate a token:
//   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
//
// Environment variables:
//   PROXY_TOKEN  — required, shared secret (min 32 chars)
//   PROXY_PORT   — optional, default 3128

import http from "node:http";
import net from "node:net";

// ── Config ──────────────────────────────────────────────────

const PORT = parseInt(process.env.PROXY_PORT || "3128", 10);
const TOKEN = process.env.PROXY_TOKEN;

if (!TOKEN || TOKEN.length < 32) {
  console.error(
    "Fatal: PROXY_TOKEN must be set and at least 32 characters.\n" +
      'Generate one: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
  );
  process.exit(1);
}

const ALLOWED_HOSTS = new Set([
  "api.binance.com",
  "fapi.binance.com",
  "www.binance.tr",
  "www.okx.com",
  "api.bybit.com",
  "api.exchange.coinbase.com",
  "api.hyperliquid.xyz",
]);

// ── Rate limiter ────────────────────────────────────────────

const MAX_REQ_PER_MIN = 200;
const buckets = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now - b.ts > 60_000) {
    b = { ts: now, n: 0 };
    buckets.set(ip, b);
  }
  b.n++;
  return b.n > MAX_REQ_PER_MIN;
}

setInterval(() => {
  const cutoff = Date.now() - 120_000;
  for (const [ip, b] of buckets) {
    if (b.ts < cutoff) buckets.delete(ip);
  }
}, 60_000);

// ── Connection tracking ─────────────────────────────────────

let active = 0;
const MAX_ACTIVE = 100;

// ── Server ──────────────────────────────────────────────────

const server = http.createServer((_req, res) => {
  // Health-check endpoint for monitoring
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("exchange-proxy ok\n");
});

server.on("connect", (req, clientSocket, head) => {
  const ip = req.socket.remoteAddress || "unknown";

  // 1. Connection cap
  if (active >= MAX_ACTIVE) {
    clientSocket.write("HTTP/1.1 503 Service Unavailable\r\n\r\n");
    clientSocket.destroy();
    return;
  }

  // 2. Rate limit
  if (isRateLimited(ip)) {
    clientSocket.write("HTTP/1.1 429 Too Many Requests\r\n\r\n");
    clientSocket.destroy();
    return;
  }

  // 3. Authentication
  const auth = req.headers["proxy-authorization"] || "";
  if (auth !== `Bearer ${TOKEN}`) {
    console.warn(`[proxy] AUTH_FAIL ip=${ip}`);
    clientSocket.write("HTTP/1.1 407 Proxy Authentication Required\r\n\r\n");
    clientSocket.destroy();
    return;
  }

  // 4. Parse target host:port
  const [hostname, portStr] = (req.url || "").split(":");
  const port = parseInt(portStr, 10) || 443;

  // 5. Domain allowlist
  if (!ALLOWED_HOSTS.has(hostname)) {
    console.warn(`[proxy] BLOCKED host=${hostname} ip=${ip}`);
    clientSocket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    clientSocket.destroy();
    return;
  }

  // 6. Establish TCP tunnel
  active++;
  let cleaned = false;

  const serverSocket = net.connect(port, hostname, () => {
    clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    active--;
    serverSocket.destroy();
    clientSocket.destroy();
  };

  serverSocket.on("error", (err) => {
    console.error(`[proxy] UPSTREAM host=${hostname} err=${err.message}`);
    if (!clientSocket.destroyed) {
      clientSocket.write("HTTP/1.1 502 Bad Gateway\r\n\r\n");
    }
    cleanup();
  });

  clientSocket.on("error", cleanup);
  serverSocket.on("close", cleanup);
  clientSocket.on("close", cleanup);

  // Timeout idle tunnels after 30s
  serverSocket.setTimeout(30_000, cleanup);
  clientSocket.setTimeout(30_000, cleanup);
});

// ── Start ───────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`[proxy] Listening on :${PORT}`);
  console.log(`[proxy] Hosts: ${[...ALLOWED_HOSTS].join(", ")}`);
  console.log(`[proxy] Limits: ${MAX_ACTIVE} conns, ${MAX_REQ_PER_MIN}/min`);
});

process.on("SIGTERM", () => {
  console.log("[proxy] Shutting down…");
  server.close(() => process.exit(0));
});
