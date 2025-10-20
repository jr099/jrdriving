import { apiRequest } from '../lib/apiClient';
import type { Mission, Quote } from '../types/domain';
import type { NormalizedMissionStatus } from '../lib/missions';

export type AdminDashboardResponse = {
  stats: {
    totalMissions: number;
    activeMissions: number;
    totalDrivers: number;
    totalClients: number;
    pendingQuotes: number;
    revenue: number;
  };
  recentMissions: Mission[];
  pendingQuotes: Quote[];
};

export async function fetchAdminDashboard(token: string): Promise<AdminDashboardResponse> {
  return apiRequest<AdminDashboardResponse>('admin/dashboard', { token });
}

export type DriverDashboardResponse = {
  driver: {
    id: string;
    total_missions: number;
    total_kilometers: number;
  } | null;
  missions: Mission[];
};

export async function fetchDriverDashboard(token: string): Promise<DriverDashboardResponse> {
  return apiRequest<DriverDashboardResponse>('driver/dashboard', { token });
}

export type UpdateMissionStatusInput = {
  status: NormalizedMissionStatus;
  occurredAt: string;
};

export async function updateMissionStatus(
  missionId: string,
  input: UpdateMissionStatusInput,
  token: string
): Promise<void> {
  await apiRequest(`missions/${missionId}/status`, {
    method: 'PATCH',
    token,
    body: input,
  });
}
