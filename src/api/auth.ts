import { apiRequest } from '../lib/apiClient';
import type { Profile, ProfileRole } from '../types/domain';

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: ProfileRole;
  phone?: string | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
  profile: Profile;
};

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: ProfileRole;
  companyName?: string | null;
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('auth/register', {
    method: 'POST',
    body: {
      email: input.email,
      password: input.password,
      full_name: input.fullName,
      phone: input.phone,
      role: input.role,
      company_name: input.companyName ?? null,
    },
  });
}

export async function fetchSession(token: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('auth/session', { token });
}

export async function logout(token: string): Promise<void> {
  await apiRequest('auth/logout', { method: 'POST', token });
}
