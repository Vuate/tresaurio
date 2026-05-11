// Client-side CSRF-aware fetch wrapper.
// Tüm state-changing (POST/PUT/PATCH/DELETE) isteklere otomatik olarak
// x-csrf-token header'ı ekler. Middleware bu token'ı doğrular.

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

let _cachedToken: string | undefined;

async function getCsrfToken(): Promise<string | undefined> {
  if (_cachedToken) return _cachedToken;
  try {
    const res = await fetch('/api/auth/csrf');
    const data = await res.json();
    _cachedToken = data.csrfToken as string | undefined;
    return _cachedToken;
  } catch {
    return undefined;
  }
}

// Oturum değiştiğinde (logout/login) cache'i sıfırla
export function invalidateCsrfCache(): void {
  _cachedToken = undefined;
}

export async function apiFetch(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  // SSR context'te normal fetch döndür
  if (typeof window === 'undefined') return fetch(url, init);

  const method = (init.method ?? 'GET').toUpperCase();
  if (!MUTATING_METHODS.has(method)) return fetch(url, init);

  const token = await getCsrfToken();
  if (!token) return fetch(url, init);

  return fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      'x-csrf-token': token,
    },
  });
}
