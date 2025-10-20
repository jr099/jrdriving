import { strict as assert } from 'node:assert';
import test from 'node:test';

const processEnv = (((globalThis as any).process ?? ((globalThis as any).process = {})).env ??=
  {} as Record<string, string>);

processEnv.VITE_API_BASE_URL = 'https://api.test.local';

test('requireAuth redirects to login when no credentials are stored', async () => {
  (globalThis as any).localStorage = {
    get length() {
      return 0;
    },
    clear: () => undefined,
    getItem: () => null,
    key: () => null,
    removeItem: () => undefined,
    setItem: () => undefined,
  } as unknown as Storage;

  const { requireAuth } = await import('./auth.js');

  const request = new Request('https://app.local/client?foo=bar');
  let response: Response | null = null;

  try {
    await requireAuth(request);
  } catch (error) {
    response = error as Response;
  }

  assert.ok(response, 'Expected a redirect response');
  assert.equal(response!.status, 302);
  assert.equal(response!.headers.get('Location'), '/login?redirectTo=%2Fclient%3Ffoo%3Dbar');
});
