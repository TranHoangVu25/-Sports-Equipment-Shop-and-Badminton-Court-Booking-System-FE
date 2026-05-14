const LEGACY_API_BASE_URL = 'http://localhost:8086/api/v1';
const LEGACY_AUTH_BASE_URL = 'http://localhost:8085/api/v1';

const normalizeBaseUrl = (value: string | undefined, fallback: string) => {
  const raw = value?.trim();
  if (!raw) {
    return fallback;
  }
  return raw.replace(/\/+$/, '');
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL, LEGACY_API_BASE_URL);
const AUTH_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_AUTH_API_BASE_URL, API_BASE_URL);

const rewriteUrl = (url: string) => {
  if (url.startsWith(LEGACY_API_BASE_URL)) {
    return `${API_BASE_URL}${url.slice(LEGACY_API_BASE_URL.length)}`;
  }

  if (url.startsWith(LEGACY_AUTH_BASE_URL)) {
    return `${AUTH_BASE_URL}${url.slice(LEGACY_AUTH_BASE_URL.length)}`;
  }

  return url;
};

export const installApiBaseUrlRewrite = () => {
  const marker = '__api_base_url_rewrite_installed__';
  const globalScope = globalThis as typeof globalThis & Record<string, unknown>;

  if (globalScope[marker]) {
    return;
  }

  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string') {
      return originalFetch(rewriteUrl(input), init);
    }

    if (input instanceof URL) {
      return originalFetch(new URL(rewriteUrl(input.toString())), init);
    }

    if (input instanceof Request) {
      const rewritten = rewriteUrl(input.url);
      if (rewritten !== input.url) {
        return originalFetch(new Request(rewritten, input), init);
      }
    }

    return originalFetch(input, init);
  };

  globalScope[marker] = true;
};
