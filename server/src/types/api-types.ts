export type UserRole = 'admin' | 'driver' | 'client';

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface Profile {
  id: number;
  userId: number;
  fullName: string;
  phone: string | null;
  role: UserRole;
  plan: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: AuthUser;
  profile: Profile;
}

