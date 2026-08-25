import { BackendClientError, backendRequest } from './backendClient';

beforeEach(() => {
  process.env.BACKEND_BASE_URL = 'https://backend.example.test';
  process.env.BACKEND_REQUEST_TIMEOUT_MS = '20';
  global.fetch = jest.fn();
});

afterEach(() => {
  delete process.env.BACKEND_BASE_URL;
  delete process.env.BACKEND_REQUEST_TIMEOUT_MS;
  jest.restoreAllMocks();
});

test('returns JSON for a successful backend response', async () => {
  fetch.mockResolvedValue({ ok: true, status: 200, text: async () => '{"id":1}' });
  await expect(backendRequest('/courses')).resolves.toEqual({ id: 1 });
});

test.each([400, 500])('preserves backend HTTP status %s', async (status) => {
  fetch.mockResolvedValue({ ok: false, status, text: async () => '{"message":"failure"}' });
  await expect(backendRequest('/courses')).rejects.toMatchObject({ code: 'BACKEND_HTTP_ERROR', status, message: 'failure' });
});

test('maps network failures to a stable error', async () => {
  fetch.mockRejectedValue(new Error('socket details'));
  await expect(backendRequest('/courses')).rejects.toEqual(expect.objectContaining({ code: 'BACKEND_UNAVAILABLE', status: 502 }));
});

test('maps an aborted request to a timeout', async () => {
  fetch.mockImplementation((_url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
  }));
  await expect(backendRequest('/courses')).rejects.toBeInstanceOf(BackendClientError);
  await expect(backendRequest('/courses')).rejects.toMatchObject({ code: 'BACKEND_TIMEOUT', status: 504 });
});
