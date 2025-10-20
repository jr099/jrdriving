import { strict as assert } from 'node:assert';
import test from 'node:test';

const processEnv = (((globalThis as any).process ?? ((globalThis as any).process = {})).env ??=
  {} as Record<string, string>);

processEnv.VITE_SUPABASE_URL = 'https://test.supabase.local';
processEnv.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
processEnv.VITE_API_BASE_URL = 'https://api.test.local';

test('requireAuth redirects to login when no session is available', async () => {
  const [{ supabase }, { requireAuth }] = await Promise.all([
    import('./supabase.js'),
    import('./auth.js'),
  ]);

  const originalGetSession = supabase.auth.getSession;
  supabase.auth.getSession = async () => ({
    data: { session: null },
    error: null,
  } as any);

  const request = new Request('https://app.local/client?foo=bar');
  let response: Response | null = null;

  try {
    await requireAuth(request);
  } catch (error) {
    response = error as Response;
  } finally {
    supabase.auth.getSession = originalGetSession;
  }

  assert.ok(response, 'Expected a redirect response');
  const redirect = response as Response;
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.get('Location'), '/login?redirectTo=%2Fclient%3Ffoo%3Dbar');
});
