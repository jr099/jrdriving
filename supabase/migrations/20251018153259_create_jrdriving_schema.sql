/*
  # JRDriving Convoyage Platform - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for the JRDriving vehicle conveyance platform,
  including client management, driver management, mission tracking, and administrative features.

  ## New Tables

  ### 1. `profiles`
  User profile extension for auth.users
  - `id` (uuid, references auth.users) - User unique identifier
  - `email` (text) - User email address
  - `full_name` (text) - Full name of the user
  - `phone` (text) - Contact phone number
  - `role` (text) - User role: 'admin', 'driver', 'client'
  - `company_name` (text, nullable) - Company name for B2B clients
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Account creation date
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `clients`
  Client management (B2B and B2C)
  - `id` (uuid, primary key) - Unique client identifier
  - `user_id` (uuid, references profiles) - Associated user account
  - `client_type` (text) - Type: 'b2b' or 'b2c'
  - `company_name` (text, nullable) - Company name for B2B
  - `siret` (text, nullable) - SIRET number for companies
  - `address` (text) - Client address
  - `city` (text) - City
  - `postal_code` (text) - Postal code
  - `country` (text) - Country
  - `notes` (text, nullable) - Internal notes
  - `status` (text) - Status: 'active', 'inactive'
  - `created_at` (timestamptz) - Registration date

  ### 3. `drivers`
  Driver management and information
  - `id` (uuid, primary key) - Unique driver identifier
  - `user_id` (uuid, references profiles) - Associated user account
  - `license_number` (text) - Driver's license number
  - `license_expiry` (date) - License expiration date
  - `vehicle_type` (text) - Preferred vehicle types
  - `availability_status` (text) - Status: 'available', 'on_mission', 'unavailable'
  - `rating` (numeric) - Average rating (0-5)
  - `total_missions` (integer) - Total missions completed
  - `total_kilometers` (integer) - Total kilometers driven
  - `created_at` (timestamptz) - Registration date
  - `updated_at` (timestamptz) - Last update

  ### 4. `vehicles`
  Vehicle registry for conveyance
  - `id` (uuid, primary key) - Unique vehicle identifier
  - `client_id` (uuid, references clients) - Vehicle owner
  - `brand` (text) - Vehicle brand
  - `model` (text) - Vehicle model
  - `year` (integer) - Manufacturing year
  - `license_plate` (text) - License plate number
  - `vin` (text, nullable) - Vehicle Identification Number
  - `vehicle_type` (text) - Type: 'sedan', 'suv', 'van', 'luxury', 'motorcycle'
  - `color` (text, nullable) - Vehicle color
  - `notes` (text, nullable) - Special notes
  - `created_at` (timestamptz) - Registration date

  ### 5. `missions`
  Mission/conveyance tracking
  - `id` (uuid, primary key) - Unique mission identifier
  - `client_id` (uuid, references clients) - Client requesting the service
  - `driver_id` (uuid, references drivers, nullable) - Assigned driver
  - `vehicle_id` (uuid, references vehicles, nullable) - Vehicle to transport
  - `mission_number` (text, unique) - Human-readable mission number
  - `departure_address` (text) - Pickup location
  - `departure_city` (text) - Pickup city
  - `departure_postal_code` (text) - Pickup postal code
  - `arrival_address` (text) - Delivery location
  - `arrival_city` (text) - Delivery city
  - `arrival_postal_code` (text) - Delivery postal code
  - `scheduled_date` (date) - Planned departure date
  - `scheduled_time` (time, nullable) - Planned departure time
  - `actual_start_time` (timestamptz, nullable) - Actual start time
  - `actual_end_time` (timestamptz, nullable) - Actual completion time
  - `distance_km` (numeric, nullable) - Distance in kilometers
  - `price` (numeric, nullable) - Mission price
  - `status` (text) - Status: 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
  - `priority` (text) - Priority: 'normal', 'urgent', 'express'
  - `notes` (text, nullable) - Mission notes
  - `created_at` (timestamptz) - Mission creation date
  - `updated_at` (timestamptz) - Last update

  ### 6. `mission_documents`
  Documents attached to missions
  - `id` (uuid, primary key) - Unique document identifier
  - `mission_id` (uuid, references missions) - Associated mission
  - `document_type` (text) - Type: 'carte_grise', 'ordre_mission', 'facture', 'recu', 'photo', 'other'
  - `file_url` (text) - Document URL
  - `file_name` (text) - Original file name
  - `uploaded_by` (uuid, references profiles) - User who uploaded
  - `created_at` (timestamptz) - Upload date

  ### 7. `quotes`
  Quote requests from potential clients
  - `id` (uuid, primary key) - Unique quote identifier
  - `full_name` (text) - Requestor name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone
  - `company_name` (text, nullable) - Company name if B2B
  - `vehicle_type` (text) - Type of vehicle to transport
  - `departure_location` (text) - Pickup location
  - `arrival_location` (text) - Delivery location
  - `preferred_date` (date, nullable) - Preferred date
  - `message` (text, nullable) - Additional information
  - `status` (text) - Status: 'new', 'quoted', 'converted', 'declined'
  - `estimated_price` (numeric, nullable) - Quoted price
  - `created_at` (timestamptz) - Request date
  - `updated_at` (timestamptz) - Last update

  ### 8. `expenses`
  Mission-related expenses tracking
  - `id` (uuid, primary key) - Unique expense identifier
  - `mission_id` (uuid, references missions) - Associated mission
  - `driver_id` (uuid, references drivers) - Driver who incurred expense
  - `expense_type` (text) - Type: 'fuel', 'toll', 'parking', 'meal', 'accommodation', 'other'
  - `amount` (numeric) - Expense amount
  - `description` (text, nullable) - Expense description
  - `receipt_url` (text, nullable) - Receipt image URL
  - `status` (text) - Status: 'pending', 'approved', 'rejected', 'reimbursed'
  - `created_at` (timestamptz) - Expense date

  ### 9. `notifications`
  System notifications for users
  - `id` (uuid, primary key) - Unique notification identifier
  - `user_id` (uuid, references profiles) - Target user
  - `mission_id` (uuid, references missions, nullable) - Related mission if applicable
  - `type` (text) - Type: 'mission_assigned', 'mission_updated', 'mission_completed', 'quote_received', 'system'
  - `title` (text) - Notification title
  - `message` (text) - Notification message
  - `read` (boolean) - Read status
  - `created_at` (timestamptz) - Notification date

  ## Security

  Row Level Security (RLS) is enabled on all tables with appropriate policies:

  ### Profile Access
  - Users can view and update their own profiles
  - Admins can view all profiles

  ### Client Access
  - Clients can view and update their own data
  - Admins can view and manage all clients

  ### Driver Access
  - Drivers can view and update their own data
  - Admins can view and manage all drivers

  ### Mission Access
  - Clients can view their own missions
  - Drivers can view assigned missions
  - Admins can view and manage all missions

  ### Quote Access
  - Admins can view and manage all quotes
  - Public can create new quotes

  ### Document Access
  - Users can view documents for missions they have access to
  - Users can upload documents to their missions

  ### Expense Access
  - Drivers can view and create their own expenses
  - Admins can view and approve all expenses

  ### Notification Access
  - Users can view and manage their own notifications
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'driver', 'client')),
  company_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_type text NOT NULL CHECK (client_type IN ('b2b', 'b2c')),
  company_name text,
  siret text,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text NOT NULL,
  country text DEFAULT 'France',
  notes text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  license_number text NOT NULL,
  license_expiry date NOT NULL,
  vehicle_type text,
  availability_status text DEFAULT 'available' CHECK (availability_status IN ('available', 'on_mission', 'unavailable')),
  rating numeric DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  total_missions integer DEFAULT 0,
  total_kilometers integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  license_plate text,
  vin text,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('sedan', 'suv', 'van', 'luxury', 'motorcycle', 'truck', 'other')),
  color text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  mission_number text UNIQUE NOT NULL,
  departure_address text NOT NULL,
  departure_city text NOT NULL,
  departure_postal_code text NOT NULL,
  arrival_address text NOT NULL,
  arrival_city text NOT NULL,
  arrival_postal_code text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time,
  actual_start_time timestamptz,
  actual_end_time timestamptz,
  distance_km numeric,
  price numeric,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority text DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'express')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mission_documents table
CREATE TABLE IF NOT EXISTS mission_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('carte_grise', 'ordre_mission', 'facture', 'recu', 'photo', 'other')),
  file_url text NOT NULL,
  file_name text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  vehicle_type text NOT NULL,
  departure_location text NOT NULL,
  arrival_location text NOT NULL,
  preferred_date date,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'converted', 'declined')),
  estimated_price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  expense_type text NOT NULL CHECK (expense_type IN ('fuel', 'toll', 'parking', 'meal', 'accommodation', 'other')),
  amount numeric NOT NULL CHECK (amount >= 0),
  description text,
  receipt_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reimbursed')),
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES missions(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('mission_assigned', 'mission_updated', 'mission_completed', 'quote_received', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Clients policies
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Clients can update own data"
  ON clients FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all clients"
  ON clients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Drivers policies
CREATE POLICY "Drivers can view own data"
  ON drivers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Drivers can update own data"
  ON drivers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all drivers"
  ON drivers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Vehicles policies
CREATE POLICY "Clients can view own vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can manage own vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Missions policies
CREATE POLICY "Clients can view own missions"
  ON missions FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can view assigned missions"
  ON missions FOR SELECT
  TO authenticated
  USING (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can update assigned missions"
  ON missions FOR UPDATE
  TO authenticated
  USING (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all missions"
  ON missions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Mission documents policies
CREATE POLICY "Users can view mission documents"
  ON mission_documents FOR SELECT
  TO authenticated
  USING (
    mission_id IN (
      SELECT id FROM missions
      WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can upload mission documents"
  ON mission_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    mission_id IN (
      SELECT id FROM missions
      WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())
      OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all documents"
  ON mission_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Quotes policies (public can insert, admins can manage)
CREATE POLICY "Anyone can create quotes"
  ON quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Expenses policies
CREATE POLICY "Drivers can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can create own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    driver_id IN (
      SELECT id FROM drivers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_client_id ON vehicles(client_id);
CREATE INDEX IF NOT EXISTS idx_missions_client_id ON missions(client_id);
CREATE INDEX IF NOT EXISTS idx_missions_driver_id ON missions(driver_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_mission_documents_mission_id ON mission_documents(mission_id);
CREATE INDEX IF NOT EXISTS idx_expenses_mission_id ON expenses(mission_id);
CREATE INDEX IF NOT EXISTS idx_expenses_driver_id ON expenses(driver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Create function to generate mission numbers
CREATE OR REPLACE FUNCTION generate_mission_number()
RETURNS text AS $$
DECLARE
  new_number text;
  year_prefix text;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
  new_number := 'JRD' || year_prefix || LPAD(
    (SELECT COALESCE(MAX(CAST(SUBSTRING(mission_number FROM 6) AS INTEGER)), 0) + 1
     FROM missions
     WHERE mission_number LIKE 'JRD' || year_prefix || '%')::text,
    5, '0'
  );
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate mission numbers
CREATE OR REPLACE FUNCTION set_mission_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mission_number IS NULL OR NEW.mission_number = '' THEN
    NEW.mission_number := generate_mission_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_mission_number
  BEFORE INSERT ON missions
  FOR EACH ROW
  EXECUTE FUNCTION set_mission_number();

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_drivers_updated_at
  BEFORE UPDATE ON drivers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();