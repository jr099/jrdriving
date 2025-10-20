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

export interface AdminDashboardStats {
  totalMissions: number;
  activeMissions: number;
  totalDrivers: number;
  totalClients: number;
  pendingQuotes: number;
  revenue: number;
}

export interface Mission {
  id: number;
  clientId: number;
  driverId: number | null;
  missionNumber: string;
  departureAddress: string;
  departureCity: string;
  departurePostalCode: string;
  arrivalAddress: string;
  arrivalCity: string;
  arrivalPostalCode: string;
  scheduledDate: string;
  scheduledTime: string | null;
  actualStartTime: string | null;
  actualEndTime: string | null;
  distanceKm: number | null;
  price: number | null;
  status: MissionStatus;
  priority: MissionPriority;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MissionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type MissionPriority = 'normal' | 'urgent' | 'express';

export interface AdminDashboardPayload {
  stats: AdminDashboardStats;
  recentMissions: Mission[];
  pendingQuotes: Quote[];
}

export interface DriverDashboardStats {
  totalMissions: number;
  inProgress: number;
  completed: number;
  totalKm: number;
}

export interface DriverDashboardPayload {
  stats: DriverDashboardStats;
  missions: Mission[];
}

export interface Quote {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  companyName: string | null;
  vehicleType: string;
  departureLocation: string;
  arrivalLocation: string;
  preferredDate: string | null;
  message: string | null;
  status: 'new' | 'quoted' | 'converted' | 'declined';
  estimatedPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuotePayload {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  vehicleType: string;
  departureLocation: string;
  arrivalLocation: string;
  preferredDate?: string | null;
  message?: string | null;
}
