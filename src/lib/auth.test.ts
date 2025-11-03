import { strict as assert } from 'node:assert';
import test from 'node:test';

test('requireAuth redirects to login when no session is available', async () => {
  const { requireAuth } = await import('./auth.js');

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 401 });

  const request = new Request('https://app.local/client?foo=bar');
  let response: Response | null = null;

  try {
    await requireAuth(request);
  } catch (error) {
    response = error as Response;
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.ok(response, 'Expected a redirect response');
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('Location'), '/login?redirectTo=%2Fclient%3Ffoo%3Dbar');
});
