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

export interface QuoteAttachment {
  id: number;
  fileName: string;
  mimeType: string | null;
  fileSize: number;
  createdAt: string;
}

export interface QuoteAttachmentPayload {
  name: string;
  type?: string;
  size: number;
  data: string;
}

export interface DriverApplicationAttachment {
  id: number;
  fileName: string;
  mimeType: string | null;
  fileSize: number;
  createdAt: string;
}

export interface DriverApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: number;
  licenseTypes: string[];
  regions: string[];
  availability: string;
  hasOwnVehicle: boolean;
  hasCompany: boolean;
  message: string | null;
  status: 'new' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  attachments: DriverApplicationAttachment[];
}

export interface AdminDashboardStats {
  totalMissions: number;
  activeMissions: number;
  totalDrivers: number;
  totalClients: number;
  pendingQuotes: number;
  revenue: number;
  punctualityRate: number;
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
  driverApplications: DriverApplication[];
  aiInsights: string[];
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
  attachments?: QuoteAttachment[];
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
  attachments?: QuoteAttachmentPayload[];
}

export interface DriverApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: number;
  licenseTypes: string[];
  regions: string[];
  availability: string;
  hasOwnVehicle: boolean;
  hasCompany: boolean;
  message?: string | null;
  attachments?: QuoteAttachmentPayload[];
}

export interface MissionTracking {
  missionNumber: string;
  status: MissionStatus;
  priority: MissionPriority;
  departureCity: string;
  arrivalCity: string;
  scheduledDate: string;
  updatedAt: string;
  driverName: string | null;
}
