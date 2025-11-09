import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { AuthSession, Profile, AuthUser } from '../lib/api-types';
import {
  fetchSession,
  signInRequest,
  signOutRequest,
  signUpRequest,
} from '../lib/api';

export type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthSession>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: 'client' | 'driver'
  ) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateState = useCallback((session: AuthSession | null) => {
    setUser(session?.user ?? null);
    setProfile(session?.profile ?? null);
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await fetchSession();
      updateState(session);
      return session;
    } finally {
      setIsLoading(false);
    }
  }, [updateState]);

  useEffect(() => {
    refreshSession().catch(() => {
      setIsLoading(false);
    });
  }, [refreshSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const session = await signInRequest(email, password);
    updateState(session);
    return session;
  }, [updateState]);

  const signUp = useCallback(
    async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: 'client' | 'driver'
    ) => {
      const session = await signUpRequest(email, password, fullName, phone, role);
      updateState(session);
      return session;
    },
    [updateState]
  );

  const signOut = useCallback(async () => {
    await signOutRequest();
    updateState(null);
  }, [updateState]);

  const value = useMemo(
    () => ({ user, profile, isLoading, signIn, signUp, signOut, refreshSession }),
    [user, profile, isLoading, signIn, signUp, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
