const DEFAULT_TIMEOUT_MS = 5000;

export class BackendClientError extends Error {
  constructor(message, { code, status = 502, details } = {}) {
    super(message);
    this.name = 'BackendClientError';
    this.code = code || 'BACKEND_REQUEST_FAILED';
    this.status = status;
    this.details = details;
  }
}

function resolveBackendBaseUrl() {
  const configured = process.env.BACKEND_BASE_URL?.trim();
  if (!configured) {
    throw new BackendClientError('Backend service is not configured', {
      code: 'BACKEND_NOT_CONFIGURED',
      status: 503,
    });
  }
  return configured.replace(/\/$/, '');
}

function resolveTimeoutMs() {
  const configured = Number(process.env.BACKEND_REQUEST_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_TIMEOUT_MS;
}

function parseResponseBody(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new BackendClientError('Backend returned invalid JSON', {
      code: 'BACKEND_INVALID_JSON',
      status: 502,
    });
  }
}

export async function backendRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), resolveTimeoutMs());
  const method = options.method || 'GET';

  try {
    const response = await fetch(`${resolveBackendBaseUrl()}${path}`, {
      method,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    const payload = parseResponseBody(await response.text());

    if (!response.ok) {
      throw new BackendClientError(
        payload?.message || `Backend request failed with status ${response.status}`,
        {
          code: 'BACKEND_HTTP_ERROR',
          status: response.status,
          details: payload,
        },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof BackendClientError) throw error;
    if (error?.name === 'AbortError') {
      throw new BackendClientError('Backend request timed out', {
        code: 'BACKEND_TIMEOUT',
        status: 504,
      });
    }
    throw new BackendClientError('Backend service is unavailable', {
      code: 'BACKEND_UNAVAILABLE',
      status: 502,
    });
  } finally {
    clearTimeout(timeout);
  }
}
