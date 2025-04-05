/*
  # Enhanced Creator Profile Extensions

  1. New Tables
    - `creator_banking_info`
      - Placeholder for future Stripe integration
      - Basic banking information (encrypted)
    - `creator_languages`
      - Content creation languages
      - App interface language preference
    - `creator_portfolio_items`
      - Detailed portfolio entries
      - Links to completed jobs
    
  2. Changes to existing tables
    - Add new columns to `creator_profiles`
      - Address information
      - Notification preferences
      
  3. Security
    - Enable RLS on all new tables
    - Strict policies for banking information access
*/

-- Add address fields to creator_profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'creator_profiles' AND column_name = 'address'
  ) THEN
    ALTER TABLE creator_profiles
    ADD COLUMN address jsonb DEFAULT '{}'::jsonb,
    ADD COLUMN app_language text DEFAULT 'en',
    ADD COLUMN notification_preferences jsonb DEFAULT '{
      "email": true,
      "push": true,
      "marketing": false
    }'::jsonb;
  END IF;
END $$;

-- Creator banking information (placeholder for Stripe integration)
CREATE TABLE IF NOT EXISTS creator_banking_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) NOT NULL,
  bank_holder_name text NOT NULL,
  bank_country text NOT NULL,
  -- Placeholder for encrypted banking details
  encrypted_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creator_banking_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage their own banking info"
  ON creator_banking_info
  FOR ALL
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM creator_profiles WHERE user_id = auth.uid()
  ));

-- Creator languages
CREATE TABLE IF NOT EXISTS creator_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) NOT NULL,
  language text NOT NULL,
  proficiency text NOT NULL,
  is_content_language boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE creator_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read creator languages"
  ON creator_languages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage their languages"
  ON creator_languages
  FOR ALL
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM creator_profiles WHERE user_id = auth.uid()
  ));

-- Enhanced portfolio items
CREATE TABLE IF NOT EXISTS creator_portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creator_profiles(id) NOT NULL,
  title text NOT NULL,
  description text,
  media_urls text[] DEFAULT '{}',
  type text NOT NULL,
  completed_job_id uuid REFERENCES applications(id),
  external_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creator_portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portfolio items"
  ON creator_portfolio_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage their portfolio items"
  ON creator_portfolio_items
  FOR ALL
  TO authenticated
  USING (creator_id IN (
    SELECT id FROM creator_profiles WHERE user_id = auth.uid()
  ));