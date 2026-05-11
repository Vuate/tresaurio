import { NextRequest, NextResponse } from "next/server";

// Accepts browser CSP violation reports and logs them server-side.
// The report-uri directive in next.config.ts points here.
// In production, replace console.warn with your observability pipeline
// (e.g. Sentry, Datadog, or a database write).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const report = body["csp-report"] ?? body;
    console.warn("[CSP Violation]", JSON.stringify(report));
  } catch {
    // Malformed report — ignore silently.
  }
  return new NextResponse(null, { status: 204 });
}
