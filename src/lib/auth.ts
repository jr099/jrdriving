import type { User } from '@supabase/supabase-js';
import { supabase, type Profile, type ProfileRole } from './supabase';
import { getRoleRedirectPath } from './navigation';
import { createRedirect } from './redirect';

export type AuthSession = {
  user: User;
  profile: Profile;
};

async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw createRedirect('/login?error=missing_profile');
  }

  return data;
}

export async function requireAuth(request: Request): Promise<AuthSession> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session || !session.user) {
    const url = new URL(request.url);
    const redirectTo = `${url.pathname}${url.search}`;
    throw createRedirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  const profile = await fetchProfile(session.user.id);

  return {
    user: session.user,
    profile,
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
