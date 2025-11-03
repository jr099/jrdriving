export type RedirectInit = number | ResponseInit;

export function createRedirect(url: string, init?: RedirectInit) {
  const status = typeof init === 'number' ? init : init?.status ?? 302;
  const headers = new Headers(typeof init === 'number' ? undefined : init?.headers);
  headers.set('Location', url);

  return new Response(null, {
    ...((typeof init === 'number' ? undefined : init) ?? {}),
    status,
    headers,
  });
}
