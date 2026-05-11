# CDN Dependency Audit Log

**Last updated:** 2026-05-11  
**Auditor:** Security review (CWE-345 / CVSS 6.9 finding remediation)  
**Status:** CLEAN — no active external CDN dependencies

---

## Active Application (Next.js)

### JavaScript

| Source | Status | Notes |
|--------|--------|-------|
| `/_next/static/chunks/*` | Self-hosted | Next.js bundles, served from own origin |
| All npm packages | Self-hosted | Bundled at build time via webpack |

No external `<script src="https://...">` tags exist anywhere in the active codebase.

### Fonts

| Font | Method | CDN Request at Runtime |
|------|--------|------------------------|
| Geist Sans | `next/font/google` | **No** — Next.js downloads and self-hosts at build time |
| Geist Mono | `next/font/google` | **No** — Next.js downloads and self-hosts at build time |

`next/font` strips all runtime requests to Google's servers. Fonts are served from `/next/static/media/`.

### Stylesheets

| Source | Status |
|--------|--------|
| `/_next/static/css/*` | Self-hosted (CSS Modules, Tailwind) |
| Global CSS | Self-hosted |

No external `<link rel="stylesheet" href="https://...">` tags in active code.

---

## Subresource Integrity Policy

### `require-sri-for script` (CSP directive)
- **Status:** NOT ENABLED — blocked by toolchain limitation
- **Reason:** Next.js 16 uses **Turbopack** as its default bundler. `experimental.sri` (which generates SHA-384 hashes for JS chunks) is a webpack-only feature; Turbopack does not implement it. Without integrity hashes on the injected `<script>` tags, enabling `require-sri-for script` in the CSP would cause Chromium-based browsers to block all application bundles, breaking the app entirely.
- **Mitigation:** The application has **zero external CDN script dependencies** — there is no supply-chain surface to protect. `experimental.sri: { algorithm: 'sha384' }` is configured in `next.config.ts` so it activates automatically once Turbopack ships native SRI support (tracked upstream: [Next.js / Turbopack roadmap](https://nextjs.org/)).

### `require-sri-for style` (CSP directive)
- **Status:** NOT ENABLED
- **Reason:** Next.js does not generate integrity attributes for its CSS chunk `<link>` elements (neither Turbopack nor webpack). Enabling this directive would block the application's own stylesheets. No external stylesheets exist to protect.

---

## Deprecated / Unused Files

| File | CDN Dependency | Status |
|------|---------------|--------|
| `public/landing/index.html` | `fonts.googleapis.com` (Inter) | File is no longer served by the app. The React-based landing page (`components/landing/`) replaced it and has no CDN dependencies. |

---

## Previously Installed Package

`@fontsource-variable/inter` was installed as part of this remediation. The font files are copied to `public/landing/fonts/` but are currently unused because `public/landing/index.html` is deprecated. The package and font files can be removed if the file is deleted.

---

## Acceptance Criteria Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| All `<script src="http*">` have `integrity=` | PASS | No external script CDNs in active code |
| All `<link rel="stylesheet" href="http*">` have `integrity=` | PASS | No external stylesheet CDNs in active code |
| CDN dependency list documented | PASS | This file |
| Self-hosting where possible | PASS | Fonts via `next/font`, all JS via npm bundling |
| CSP `require-sri-for script` added | BLOCKED | Turbopack (Next.js 16 default) doesn't generate integrity hashes; enabling CSP directive without hashes breaks all bundles. `experimental.sri` is pre-configured for when Turbopack adds support. Zero external CDN scripts = no current attack surface. |
| CSP `require-sri-for style` added | N/A | Not feasible — Next.js CSS chunks lack integrity attributes; no external stylesheets exist to protect |
| Pentest re-test | PENDING | External verification required |
