// lib/services/exchangeFetch.ts
// Server-side only — never import from client components.
//
// Centralized outbound HTTP client for exchange API requests.
// Routes requests through a static-IP HTTP CONNECT proxy when enabled,
// so that exchange IP-whitelisting works on Vercel (dynamic outbound IPs).
//
// Modes:
//   direct (default) — native fetch, current behavior, works in local dev
//   proxy            — tunnels through an authenticated CONNECT proxy on a VPS
//
// Environment variables (only needed for proxy mode):
//   EXCHANGE_EGRESS_MODE  = "proxy"
//   EXCHANGE_EGRESS_URL   = "http://<vps-static-ip>:3128"
//   EXCHANGE_EGRESS_TOKEN = "<shared-secret-64-hex>"
//
// Security properties of the CONNECT tunnel:
//   - The proxy sees ONLY the target hostname:port (e.g. api.binance.com:443)
//   - API keys, signatures, and request bodies travel inside the TLS tunnel
//     and are NEVER visible to the proxy.

/* eslint-disable @typescript-eslint/no-explicit-any */

const REQUEST_TIMEOUT_MS = 15_000;
const PROXY_RETRY_LIMIT = 1;
const RETRY_BACKOFF_MS = 500;

let _agent: any = null;
let _undici: any = null;
let _resolved = false;

async function resolve(): Promise<boolean> {
  if (_resolved) return _agent !== null;
  _resolved = true;

  if (process.env.EXCHANGE_EGRESS_MODE?.trim() !== "proxy") return false;

  const url = process.env.EXCHANGE_EGRESS_URL?.trim();
  if (!url) {
    console.warn(
      "[exchangeFetch] EXCHANGE_EGRESS_MODE=proxy but EXCHANGE_EGRESS_URL is missing — falling back to direct",
    );
    return false;
  }

  const token = process.env.EXCHANGE_EGRESS_TOKEN?.trim();
  if (!token) {
    console.warn(
      "[exchangeFetch] EXCHANGE_EGRESS_TOKEN is not set — proxy will be unauthenticated",
    );
  }

  try {
    _undici = await import("undici");
    _agent = new _undici.ProxyAgent({
      uri: url,
      token: token ? `Bearer ${token}` : undefined,
      connections: 20,
      pipelining: 1,
      keepAliveTimeout: 30_000,
      keepAliveMaxTimeout: 60_000,
    });
    console.log(`[exchangeFetch] Egress proxy active → ${url}`);
    return true;
  } catch (err: any) {
    console.error(
      "[exchangeFetch] Failed to initialize proxy agent:",
      err?.message ?? err,
    );
    return false;
  }
}

function stripQueryString(input: string | URL): string {
  return input.toString().split("?")[0];
}

/**
 * Drop-in replacement for fetch() used by exchange service functions.
 *
 * When EXCHANGE_EGRESS_MODE=proxy, tunnels the request through an HTTP
 * CONNECT proxy so that the outbound IP is the VPS static IP.
 * Otherwise, delegates to the native fetch (zero overhead).
 *
 * Adds: 15 s timeout (unless caller supplies their own signal),
 * one automatic retry on proxy-level / network errors.
 */
export async function exchangeFetch(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  const useProxy = await resolve();

  if (!useProxy || !_undici || !_agent) {
    return fetch(input, init);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= PROXY_RETRY_LIMIT; attempt++) {
    try {
      const resp = await _undici.fetch(input.toString(), {
        ...init,
        dispatcher: _agent,
        signal: init?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      return resp as Response;
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (init?.signal?.aborted) break;
      if (lastError.name === "TypeError") break;

      if (attempt < PROXY_RETRY_LIMIT) {
        console.warn(
          `[exchangeFetch] Retry ${attempt + 1}/${PROXY_RETRY_LIMIT} → ${stripQueryString(input)}: ${lastError.message}`,
        );
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS * (attempt + 1)));
      }
    }
  }

  const safe = stripQueryString(input);
  const msg = lastError?.message ?? "Unknown proxy error";
  console.error(`[exchangeFetch] Failed → ${safe}: ${msg}`);
  throw new Error(`Exchange egress error (${safe}): ${msg}`);
}
