declare const process: {
  env: {
    LCAE_DUCKDNS_API_BASE_URL?: string;
    LCAE_LOCAL_API_BASE_URL?: string;
    LCAE_REMOTE_API_BASE_URL?: string;
    LCAE_USE_LOCAL_API?: string;
  };
};

const USE_LOCAL_API = getEnvBoolean(process.env.LCAE_USE_LOCAL_API, false);
const DUCKDNS_API_BASE_URL =
  process.env.LCAE_DUCKDNS_API_BASE_URL ?? 'https://lcae.duckdns.org:3000/api';
const REMOTE_HTTPS_API_BASE_URL =
  process.env.LCAE_REMOTE_API_BASE_URL || DUCKDNS_API_BASE_URL;
const LOCAL_HTTP_API_BASE_URL =
  process.env.LCAE_LOCAL_API_BASE_URL ?? 'http://localhost:3000/api';

const PREFERRED_API_BASE_URL = USE_LOCAL_API
  ? LOCAL_HTTP_API_BASE_URL
  : DUCKDNS_API_BASE_URL;

const API_BASE_URL_CANDIDATES = USE_LOCAL_API
  ? [LOCAL_HTTP_API_BASE_URL, DUCKDNS_API_BASE_URL, REMOTE_HTTPS_API_BASE_URL]
  : [DUCKDNS_API_BASE_URL, REMOTE_HTTPS_API_BASE_URL, LOCAL_HTTP_API_BASE_URL];

let activeApiBaseUrl = PREFERRED_API_BASE_URL;
let activeSocketBaseUrl = toSocketBaseUrl(activeApiBaseUrl);

export const API_BASE_URL = PREFERRED_API_BASE_URL;

export const SOCKET_BASE_URL = toSocketBaseUrl(API_BASE_URL);

export function getActiveApiBaseUrl(): string {
  return activeApiBaseUrl;
}

export function getActiveSocketBaseUrl(): string {
  return activeSocketBaseUrl;
}

export function getSocketBaseUrlCandidates(): string[] {
  return getUniqueValues([
    activeSocketBaseUrl,
    ...API_BASE_URL_CANDIDATES.map(toSocketBaseUrl),
  ]);
}

export function setActiveSocketBaseUrl(socketBaseUrl: string): void {
  activeSocketBaseUrl = socketBaseUrl;
  activeApiBaseUrl = `${socketBaseUrl.replace(/\/$/, '')}/api`;
}

export function getAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
  };
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let lastError: unknown;

  for (const baseUrl of getApiBaseUrlCandidates()) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);
      activeApiBaseUrl = baseUrl;
      activeSocketBaseUrl = toSocketBaseUrl(baseUrl);

      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('API 서버에 연결하지 못했습니다.');
}

function getApiBaseUrlCandidates(): string[] {
  return getUniqueValues([activeApiBaseUrl, ...API_BASE_URL_CANDIDATES]);
}

function getUniqueValues(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function toSocketBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/api\/?$/, '');
}

function getEnvBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
