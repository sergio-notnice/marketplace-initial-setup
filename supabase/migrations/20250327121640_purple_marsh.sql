/*
  # Enhanced Database Structure for Creator Marketplace

  1. New Tables
    - `cooperations`
      - Links campaigns, brands, and creators
      - Tracks deliverables and status
    - `campaign_deliverables`
      - Detailed deliverable requirements
    - `payments`
      - Payment tracking and invoicing
    - `notifications`
      - System notifications
    
  2. Enhancements
    - Add missing fields to existing tables
    - Improve relationships and constraints
    - Add necessary indexes
    
  3. Security
    - RLS policies for all new tables
    - Enhanced access control
*/

-- Add missing fields to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS formats text[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS platforms text[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS min_budget numeric;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS max_budget numeric;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS required_deliverables jsonb DEFAULT '[]';

-- Campaign deliverables
CREATE TABLE IF NOT EXISTS campaign_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text NOT NULL,
  quantity integer DEFAULT 1,
  requirements jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view campaign deliverables"
  ON campaign_deliverables
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Brands can manage campaign deliverables"
  ON campaign_deliverables
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM campaigns c
    WHERE c.id = campaign_id AND c.brand_id = auth.uid()
  ));

-- Cooperations table
CREATE TABLE IF NOT EXISTS cooperations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES users(id),
  brand_id uuid REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('in_progress', 'review', 'completed', 'cancelled')),
  deliverables jsonb DEFAULT '[]',
  deadline timestamptz NOT NULL,
  budget numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cooperations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their cooperations"
  ON cooperations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id OR auth.uid() = brand_id);

CREATE POLICY "Users can update their cooperations"
  ON cooperations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id OR auth.uid() = brand_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperation_id uuid REFERENCES cooperations(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method text,
  payment_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM cooperations c
    WHERE c.id = cooperation_id AND (c.creator_id = auth.uid() OR c.brand_id = auth.uid())
  ));

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaign_deliverables_campaign_id ON campaign_deliverables(campaign_id);
CREATE INDEX IF NOT EXISTS idx_cooperations_campaign_id ON cooperations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_cooperations_creator_id ON cooperations(creator_id);
CREATE INDEX IF NOT EXISTS idx_cooperations_brand_id ON cooperations(brand_id);
CREATE INDEX IF NOT EXISTS idx_payments_cooperation_id ON payments(cooperation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaign_deliverables_updated_at
    BEFORE UPDATE ON campaign_deliverables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cooperations_updated_at
    BEFORE UPDATE ON cooperations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();