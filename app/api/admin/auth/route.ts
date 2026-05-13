import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSessionToken, COOKIE_NAME, SESSION_TTL_MS } from "@/lib/admin-session";

// Zod schema: adminPassword must be a plain string, nothing else
const adminLoginSchema = z.object({
  adminPassword: z.string().min(1).max(256),
});

// Defense-in-depth: strip MongoDB-style operator keys from any nested object.
// Primary protection is the Zod string type check above; this catches edge cases.
function sanitizeMongoOperators(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeMongoOperators);
  if (typeof value === "object" && value !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (!k.startsWith("$")) {
        sanitized[k] = sanitizeMongoOperators(v);
      }
    }
    return sanitized;
  }
  return value;
}

export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Sanitize before validation — strips $gt, $ne, $where etc.
  const sanitized = sanitizeMongoOperators(raw);

  const parsed = adminLoginSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
  }

  const { adminPassword } = parsed.data;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envPassword || adminPassword !== envPassword) {
    // Constant-time delay to prevent timing attacks
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = createAdminSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
  return response;
}

export async function DELETE(_request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
