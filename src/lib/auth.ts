import { fetchProfileById } from '../api/profiles';
import type { Profile, ProfileRole } from '../types/domain';
import { getRoleRedirectPath } from './navigation';
import { createRedirect } from './redirect';
import { ApiError } from './apiClient';
import type { AuthUser } from '../api/auth';

const STORAGE_KEY = 'jrdriving.auth';

type StoredAuth = {
  token: string;
  user: AuthUser;
  profile: Profile;
};

function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readStoredAuth(): StoredAuth | null {
  const storage = getStorage();
  if (!storage) return null;

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuth;
  } catch (error) {
    console.warn('Failed to parse stored auth payload', error);
    storage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function writeStoredAuth(value: StoredAuth | null): void {
  const storage = getStorage();
  if (!storage) return;

  if (!value) {
    storage.removeItem(STORAGE_KEY);
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export type AuthSession = StoredAuth;

export async function requireAuth(request: Request): Promise<AuthSession> {
  const stored = readStoredAuth();

  if (!stored) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw createRedirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  let profile: Profile;
  try {
    profile = await fetchProfileById(stored.user.id, stored.token);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 || error.status === 403) {
        writeStoredAuth(null);
        const url = new URL(request.url);
        const redirectTo = `${url.pathname}${url.search}`;
        throw createRedirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
      }

      if (error.status === 404) {
        writeStoredAuth(null);
        throw createRedirect('/login?error=missing_profile');
      }
    }
    throw error;
  }
  const session: AuthSession = {
    token: stored.token,
    user: stored.user,
    profile,
  };

  writeStoredAuth(session);
  return session;
}

export async function requireRole(
  request: Request,
  role: ProfileRole | ProfileRole[]
): Promise<AuthSession> {
  const allowedRoles = Array.isArray(role) ? role : [role];
  const auth = await requireAuth(request);

  if (!allowedRoles.includes(auth.profile.role)) {
    const redirectPath = getRoleRedirectPath(auth.profile.role);
    throw createRedirect(redirectPath);
  }

  return auth;
}
