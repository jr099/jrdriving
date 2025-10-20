import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Profile, ProfileRole } from '../types/domain';
import type { AuthUser } from '../api/auth';
import { fetchCurrentProfile } from '../api/profiles';
import { login, register, fetchSession, logout } from '../api/auth';
import { readStoredAuth, writeStoredAuth } from '../lib/auth';

export type AuthContextType = {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: ProfileRole,
    companyName?: string | null
  ) => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthPayload = {
  token: string;
  user: AuthUser;
  profile: Profile;
};

type AuthState = AuthPayload;

function toAuthState(payload: AuthPayload): AuthState {
  return {
    token: payload.token,
    user: payload.user,
    profile: payload.profile,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAuthState = useCallback((state: AuthState, persist: boolean) => {
    setToken(state.token);
    setUser(state.user);
    setProfile(state.profile);
    if (persist) {
      writeStoredAuth(state);
    }
  }, []);

  const clearAuthState = useCallback(() => {
    setToken(null);
    setUser(null);
    setProfile(null);
    writeStoredAuth(null);
  }, []);

  useEffect(() => {
    let active = true;
    const stored = readStoredAuth();

    if (stored && active) {
      applyAuthState(toAuthState(stored), false);
    } else if (!stored) {
      setLoading(false);
    }

    if (!stored) {
      return () => {
        active = false;
      };
    }

    (async () => {
      try {
        const refreshed = await fetchSession(stored.token);
        if (!active) return;
        applyAuthState(toAuthState(refreshed), true);
      } catch (error) {
        console.warn('Failed to refresh session', error);
        if (!active) return;
        clearAuthState();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [applyAuthState, clearAuthState]);

  const getAccessToken = useCallback(async () => token, [token]);

  const refreshProfile = useCallback(
    async (tokenValue: string, userOverride?: AuthUser | null) => {
      const baseUser = userOverride ?? user;
      if (!baseUser) {
        return;
      }

      try {
        const freshProfile = await fetchCurrentProfile(tokenValue);
        const state: AuthState = { token: tokenValue, user: baseUser, profile: freshProfile };
        applyAuthState(state, true);
      } catch (error) {
        console.error('Error refreshing profile', error);
      }
    },
    [applyAuthState, user]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const auth = await login(email, password);
      applyAuthState(toAuthState(auth), true);
    },
    [applyAuthState]
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      phone: string,
      role: ProfileRole,
      companyName?: string | null
    ) => {
      const auth = await register({ email, password, fullName, phone, role, companyName });
      applyAuthState(toAuthState(auth), true);
      await refreshProfile(auth.token, auth.user);
    },
    [applyAuthState, refreshProfile]
  );

  const signOut = useCallback(async () => {
    if (token) {
      try {
        await logout(token);
      } catch (error) {
        console.warn('Failed to call logout endpoint', error);
      }
    }
    clearAuthState();
  }, [clearAuthState, token]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      getAccessToken,
    }),
    [getAccessToken, loading, profile, signIn, signOut, signUp, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
