import axios from 'axios';
import { apiClient } from './api-client';
import type {
  AdminDashboardPayload,
  AuthSession,
  DriverApplicationPayload,
  DriverDashboardPayload,
  MissionStatus,
  MissionTracking,
  QuotePayload,
} from './api-types';

export async function fetchSession(): Promise<AuthSession | null> {
  try {
    const { data } = await apiClient.get<AuthSession>('/auth/session');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function signInRequest(email: string, password: string): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>('/auth/login', { email, password });
  return data;
}

export async function signUpRequest(
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: 'client' | 'driver'
): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>('/auth/signup', {
    email,
    password,
    fullName,
    phone,
    role,
  });
  return data;
}

export async function signOutRequest(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function fetchAdminDashboard(): Promise<AdminDashboardPayload> {
  const { data } = await apiClient.get<AdminDashboardPayload>('/admin/dashboard');
  return data;
}

export async function fetchDriverDashboard(): Promise<DriverDashboardPayload> {
  const { data } = await apiClient.get<DriverDashboardPayload>('/drivers/me');
  return data;
}

export async function updateMissionStatus(missionId: number, status: MissionStatus): Promise<void> {
  await apiClient.patch(`/missions/${missionId}/status`, { status });
}

export async function submitQuote(payload: QuotePayload): Promise<void> {
  await apiClient.post('/quotes', payload);
}

export async function submitDriverApplication(payload: DriverApplicationPayload): Promise<void> {
  await apiClient.post('/recruitment', payload);
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiClient.post('/auth/reset-password', { token, password });
}

export async function trackMission(missionNumber: string): Promise<MissionTracking> {
  const { data } = await apiClient.get<{ mission: MissionTracking }>(`/missions/track/${encodeURIComponent(missionNumber)}`);
  return data.mission;
}
