import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "__admin_sess";
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  return secret;
}

export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const rand = createHmac("sha256", String(Math.random())).digest("hex").slice(0, 16);
  const payload = `${rand}.${expiresAt}`;
  const hmac = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifyAdminSessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [rand, expiresAtStr, hmac] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;
  const payload = `${rand}.${expiresAt}`;
  const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export { COOKIE_NAME, SESSION_TTL_MS };
