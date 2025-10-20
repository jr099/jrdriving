import { apiRequest } from '../lib/apiClient';
import type { Profile, ProfileRole } from '../types/domain';

export async function fetchProfileById(userId: string, token: string): Promise<Profile> {
  return apiRequest<Profile>(`profiles/${userId}`, { token });
}

export async function fetchCurrentProfile(token: string): Promise<Profile> {
  return apiRequest<Profile>('profiles/me', { token });
}

export type UpsertProfileInput = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: ProfileRole;
  companyName?: string | null;
};

export async function upsertProfile(input: UpsertProfileInput, token: string): Promise<Profile> {
  return apiRequest<Profile>(`profiles/${input.id}`, {
    method: 'PUT',
    token,
    body: {
      email: input.email,
      full_name: input.fullName,
      phone: input.phone,
      role: input.role,
      company_name: input.companyName ?? null,
    },
  });
}
