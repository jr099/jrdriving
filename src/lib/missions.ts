import type { DatabaseMissionStatus, MissionStatus } from './supabase';

export type NormalizedMissionStatus = 'new' | 'assigned' | 'in_progress' | 'done' | 'canceled';

export function normalizeMissionStatus(status: MissionStatus): NormalizedMissionStatus {
  switch (status) {
    case 'pending':
    case 'new':
      return 'new';
    case 'assigned':
      return 'assigned';
    case 'in_progress':
      return 'in_progress';
    case 'completed':
    case 'done':
      return 'done';
    case 'cancelled':
    case 'canceled':
      return 'canceled';
    default:
      return 'new';
  }
}

export function missionStatusToDatabase(status: NormalizedMissionStatus): DatabaseMissionStatus {
  switch (status) {
    case 'new':
      return 'pending';
    case 'done':
      return 'completed';
    case 'canceled':
      return 'cancelled';
    default:
      return status;
  }
}

export function getMissionStatusLabel(status: NormalizedMissionStatus): string {
  switch (status) {
    case 'new':
      return 'Nouvelle';
    case 'assigned':
      return 'Assignée';
    case 'in_progress':
      return 'En cours';
    case 'done':
      return 'Terminée';
    case 'canceled':
      return 'Annulée';
    default:
      return status;
  }
}

export function getMissionStatusBadgeClass(status: NormalizedMissionStatus): string {
  switch (status) {
    case 'new':
      return 'bg-yellow-100 text-yellow-800';
    case 'assigned':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-orange-100 text-orange-800';
    case 'done':
      return 'bg-green-100 text-green-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
