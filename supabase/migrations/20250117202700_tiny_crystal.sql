/*
  # Initial Schema Setup for Creator Marketplace

  1. Tables
    - users
      - Core user information for both brands and creators
    - creator_profiles
      - Extended information for creator accounts
    - campaigns
      - Campaign details created by brands
    - applications
      - Creator applications to campaigns
    - messages
      - Chat messages between users
    
  2. Security
    - RLS enabled on all tables
    - Policies for proper data access control
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('brand', 'creator')),
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Creator profiles
CREATE TABLE creator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  bio text,
  categories text[] DEFAULT '{}',
  social_links jsonb DEFAULT '{}',
  portfolio text[] DEFAULT '{}',
  stats jsonb DEFAULT '{"followers": 0, "engagement_rate": 0}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read creator profiles"
  ON creator_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can update own profile"
  ON creator_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Campaigns
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  budget numeric NOT NULL,
  formats text[] DEFAULT '{}',
  requirements text,
  deadline timestamptz NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (status = 'active' OR auth.uid() = brand_id);

CREATE POLICY "Brands can manage own campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = brand_id);

-- Applications
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) NOT NULL,
  creator_id uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  proposal text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Brands can read applications for their campaigns"
  ON applications
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM campaigns c
    WHERE c.id = campaign_id AND c.brand_id = auth.uid()
  ));

CREATE POLICY "Creators can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'creator'
    )
  );

-- Messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) NOT NULL,
  receiver_id uuid REFERENCES users(id) NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Indexes for better query performance
CREATE INDEX idx_campaigns_brand_id ON campaigns(brand_id);
CREATE INDEX idx_applications_campaign_id ON applications(campaign_id);
CREATE INDEX idx_applications_creator_id ON applications(creator_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_creator_profiles_user_id ON creator_profiles(user_id);