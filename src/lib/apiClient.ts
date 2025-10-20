const importMetaEnv = (() => {
  try {
    return (Function('return typeof import.meta !== "undefined" ? import.meta : undefined;')() as
      | { env?: Record<string, string | undefined> }
      | undefined)?.env;
  } catch {
    return undefined;
  }
})();

const nodeEnv = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env;
const API_BASE_URL = (() => {
  const value = importMetaEnv?.VITE_API_BASE_URL ?? nodeEnv?.VITE_API_BASE_URL;
  if (!value) {
    throw new Error('Missing API base URL (VITE_API_BASE_URL)');
  }
  return value;
})();

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
  signal?: AbortSignal;
};

export async function apiRequest<TResponse>(
  path: string,
  { method = 'GET', body, headers = {}, token, signal }: ApiRequestOptions = {}
): Promise<TResponse> {
  const url = buildUrl(path);
  const finalHeaders = new Headers({ Accept: 'application/json', ...headers });

  let requestBody: BodyInit | undefined;

  if (body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
    requestBody = body as BodyInit;
  } else if (body !== undefined) {
    finalHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  }

  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: requestBody,
    signal,
  });

  if (!response.ok) {
    const errorPayload = await safeParseJson(response);
    throw new ApiError(errorPayload?.message ?? response.statusText, response.status, errorPayload);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const data = await safeParseJson(response);
  return data as TResponse;
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${normalizedPath}`;
}

async function safeParseJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
