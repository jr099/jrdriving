-- Add profile ownership to quotes and create audit logs table
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  actor uuid REFERENCES profiles(id),
  entity text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}',
  ts timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Refresh quote policies to support owner access
DROP POLICY IF EXISTS "Anyone can create quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can manage all quotes" ON quotes;

CREATE POLICY "Public can create quotes"
  ON quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Clients view their quotes"
  ON quotes FOR SELECT
  TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Clients update their quotes"
  ON quotes FOR UPDATE
  TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins delete quotes"
  ON quotes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Audit log policies: allow application to write and admins to read
CREATE POLICY "App can write audit logs"
  ON audit_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
