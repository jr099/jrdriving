import type { AuthSession, Profile } from './api-types';
export type { AuthSession } from './api-types';
import { getRoleRedirectPath } from './navigation';
import { createRedirect } from './redirect';

function resolveSessionUrl(request: Request): string {
  if (typeof window !== 'undefined') {
    return '/api/auth/session';
  }

  const requestUrl = new URL(request.url);
  return new URL('/api/auth/session', `${requestUrl.protocol}//${requestUrl.host}`).toString();
}

async function requestSession(request: Request): Promise<Response> {
  const sessionUrl = resolveSessionUrl(request);
  const init: RequestInit = { method: 'GET' };

  if (typeof window !== 'undefined') {
    init.credentials = 'include';
  } else {
    const cookie = request.headers.get('cookie');
    if (cookie) {
      init.headers = { cookie };
    }
  }

  return fetch(sessionUrl, init);
}

export async function requireAuth(request: Request): Promise<AuthSession> {
  const response = await requestSession(request);

  if (response.status === 401) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw createRedirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  if (!response.ok) {
    throw new Error('Unable to verify authentication.');
  }

  return (await response.json()) as AuthSession;
}

export async function requireRole(
  request: Request,
  role: Profile['role'] | Profile['role'][]
): Promise<AuthSession> {
  const allowedRoles = Array.isArray(role) ? role : [role];
  const auth = await requireAuth(request);

  if (!allowedRoles.includes(auth.profile.role)) {
    const redirectPath = getRoleRedirectPath(auth.profile.role);
    throw createRedirect(redirectPath);
  }

  return auth;
}
