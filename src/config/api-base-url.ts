import { API_DEFAULT_HEADERS } from './api-headers';

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

const withDefaultHeaders = (init?: RequestInit, inheritedHeaders?: HeadersInit): RequestInit => {
  const mergedHeaders = new Headers(inheritedHeaders);

  if (init?.headers) {
    const initHeaders = new Headers(init.headers);
    initHeaders.forEach((value, key) => {
      mergedHeaders.set(key, value);
    });
  }

  Object.entries(API_DEFAULT_HEADERS).forEach(([key, value]) => {
    mergedHeaders.set(key, value);
  });

  return {
    ...init,
    headers: mergedHeaders,
  };
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
      return originalFetch(rewriteUrl(input), withDefaultHeaders(init));
    }

    if (input instanceof URL) {
      return originalFetch(new URL(rewriteUrl(input.toString())), withDefaultHeaders(init));
    }

    if (input instanceof Request) {
      const nextInit = withDefaultHeaders(init, input.headers);
      const rewritten = rewriteUrl(input.url);
      if (rewritten !== input.url) {
        return originalFetch(new Request(rewritten, input), nextInit);
      }

      return originalFetch(input, nextInit);
    }

    return originalFetch(input, withDefaultHeaders(init));
  };

  globalScope[marker] = true;
};
