import { NextRequest, NextResponse } from 'next/server';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// NextAuth v5'in kendi CSRF koruması olan built-in route'ları
const NEXTAUTH_INTERNAL_PREFIXES = [
  '/api/auth/callback',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/_log',
  // Browser CSP violation reports carry no CSRF token — exempt from check.
  '/api/csp-report',
];

// Kimlik doğrulaması gerektirmeyen, herkese açık piyasa verisi endpoint'leri.
// Bunlar credentials taşımadığından * ile sunulabilir.
const PUBLIC_DATA_PREFIXES = [
  '/api/v2/binance/',
  '/api/v2/coingecko/',
  '/api/market/',
  '/api/news',
];

function isNextAuthInternal(pathname: string): boolean {
  return NEXTAUTH_INTERNAL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );
}

function isPublicDataEndpoint(pathname: string): boolean {
  return PUBLIC_DATA_PREFIXES.some((prefix) =>
    prefix.endsWith('/')
      ? pathname.startsWith(prefix)
      : pathname === prefix || pathname.startsWith(prefix + '/'),
  );
}

function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS ?? '';
  const origins = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000');
  }
  return origins;
}

function applyPublicCors(headers: Headers): void {
  // Public market data: credentials kullanmıyor, wildcard güvenli.
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
}

function applyPrivateCors(headers: Headers, origin: string): void {
  // * + Allow-Credentials: true kombinasyonu yasak; origin'i yansıt.
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-csrf-token');
  // CDN/proxy'nin origin'e göre cache ayırması için gerekli.
  headers.set('Vary', 'Origin');
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get('origin') ?? '';
  const method = req.method;

  const isPublic = isPublicDataEndpoint(pathname);
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = origin !== '' && allowedOrigins.includes(origin);

  // --- 1. OPTIONS preflight — route handler'a ulaşmadan yanıtla ---
  if (method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    if (isPublic) {
      applyPublicCors(preflight.headers);
    } else if (isAllowed) {
      applyPrivateCors(preflight.headers, origin);
      preflight.headers.set('Access-Control-Max-Age', '86400');
    }
    return preflight;
  }

  // --- 2. CSRF — state-changing istekler için (NextAuth internal hariç) ---
  if (MUTATING_METHODS.has(method) && !isNextAuthInternal(pathname)) {
    const cookieValue =
      req.cookies.get('__Host-authjs.csrf-token')?.value ??
      req.cookies.get('authjs.csrf-token')?.value;

    const headerToken = req.headers.get('x-csrf-token');

    if (!cookieValue || !headerToken) {
      return NextResponse.json(
        { error: 'CSRF token required' },
        { status: 403 },
      );
    }

    const [tokenPart] = cookieValue.split('|');
    if (tokenPart !== headerToken) {
      return NextResponse.json(
        { error: 'CSRF token invalid' },
        { status: 403 },
      );
    }
  }

  // --- 3. Normal istek — CORS header'larını response'a ekle ---
  const response = NextResponse.next();

  if (isPublic) {
    applyPublicCors(response.headers);
  } else if (isAllowed) {
    applyPrivateCors(response.headers, origin);
  }
  // İzin verilmemiş origin'den gelen istek: CORS header yok → browser engeller.

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
