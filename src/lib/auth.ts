import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Profile, ProfileRole } from '../types/domain';
import { getRoleRedirectPath } from './navigation';
import { createRedirect } from './redirect';
import { fetchProfileById } from '../api/profiles';
import { ApiError } from './apiClient';

export type AuthSession = {
  user: User;
  profile: Profile;
  token: string;
};

async function resolveSession(): Promise<{ session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']; error: any; }> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

async function fetchProfile(userId: string, token: string): Promise<Profile> {
  try {
    return await fetchProfileById(userId, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw createRedirect('/login?error=missing_profile');
    }
    throw error;
  }
}

export async function requireAuth(request: Request): Promise<AuthSession> {
  const { session, error } = await resolveSession();

  if (error) {
    throw error;
  }

  if (!session || !session.user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw createRedirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const token = session.access_token;
  if (!token) {
    throw new Error('Missing access token for authenticated request');
  }

  const profile = await fetchProfile(session.user.id, token);

  return {
    user: session.user,
    profile,
    token,
  };
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
