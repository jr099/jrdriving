import { createClient } from '@supabase/supabase-js';

const importMetaEnv = (() => {
  try {
    return (Function('return typeof import.meta !== "undefined" ? import.meta : undefined;')() as
      | { env?: Record<string, string | undefined> }
      | undefined)?.env;
  } catch {
    return undefined;
  }
})();

const nodeEnv = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env;
const supabaseUrl = importMetaEnv?.VITE_SUPABASE_URL ?? nodeEnv?.VITE_SUPABASE_URL;
const supabaseAnonKey = importMetaEnv?.VITE_SUPABASE_ANON_KEY ?? nodeEnv?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ProfileRole = 'admin' | 'driver' | 'client';

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: ProfileRole;
  company_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DatabaseMissionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type MissionStatus = DatabaseMissionStatus | 'new' | 'done' | 'canceled';

export type Mission = {
  id: string;
  client_id: string;
  driver_id: string | null;
  vehicle_id: string | null;
  mission_number: string;
  departure_address: string;
  departure_city: string;
  departure_postal_code: string;
  arrival_address: string;
  arrival_city: string;
  arrival_postal_code: string;
  scheduled_date: string;
  scheduled_time: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  distance_km: number | null;
  price: number | null;
  status: MissionStatus;
  priority: 'normal' | 'urgent' | 'express';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Quote = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  vehicle_type: string;
  departure_location: string;
  arrival_location: string;
  preferred_date: string | null;
  message: string | null;
  status: 'new' | 'quoted' | 'converted' | 'declined';
  estimated_price: number | null;
  created_at: string;
  updated_at: string;
};
