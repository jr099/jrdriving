import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'admin' | 'driver' | 'client';
  company_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

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
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
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
