/*
  # Multi-Workspace Implementation

  1. New Tables
    - workspaces
      - Core workspace information
      - Status tracking
      - Timestamps
    - workspace_members
      - Workspace membership management
      - Role-based access
    - User table extension
      - Agency admin flag
    
  2. Security
    - RLS policies for workspace access
    - Role-based permissions
    - Membership validation
*/

-- Create workspace_role_type ENUM
DO $$ BEGIN
  CREATE TYPE workspace_role_type AS ENUM ('owner', 'manager', 'member');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create workspace_status_type ENUM
DO $$ BEGIN
  CREATE TYPE workspace_status_type AS ENUM ('active', 'archived', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status workspace_status_type DEFAULT 'active',
  created_by uuid REFERENCES users(id) NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  branding jsonb DEFAULT '{
    "logo_url": null,
    "primary_color": null,
    "accent_color": null
  }'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS on workspaces
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Create workspace_members table
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role workspace_role_type NOT NULL,
  joined_at timestamptz DEFAULT now(),
  invited_by uuid REFERENCES users(id),
  settings jsonb DEFAULT '{}'::jsonb,
  PRIMARY KEY (workspace_id, user_id)
);

-- Enable RLS on workspace_members
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Create workspace_invites table
CREATE TABLE IF NOT EXISTS workspace_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  email text NOT NULL,
  role workspace_role_type NOT NULL,
  invited_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  UNIQUE (workspace_id, email)
);

-- Enable RLS on workspace_invites
ALTER TABLE workspace_invites ENABLE ROW LEVEL SECURITY;

-- Add workspace_id to existing tables that need workspace context
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);
ALTER TABLE creator_profiles ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workspaces_created_by ON workspaces(created_by);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_email ON workspace_invites(email);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace_id ON campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_creator_profiles_workspace_id ON creator_profiles(workspace_id);

-- RLS Policies for workspaces

-- View workspace
CREATE POLICY "Users can view workspaces they are members of"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
    OR
    created_by = auth.uid()
  );

-- Create workspace
CREATE POLICY "Agency admins can create workspaces"
  ON workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin'::user_role_type, 'customer_success'::user_role_type)
    )
  );

-- Update workspace
CREATE POLICY "Workspace owners and managers can update workspace"
  ON workspaces
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'manager')
    )
  );

-- Delete workspace
CREATE POLICY "Only workspace owners can delete workspace"
  ON workspaces
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'owner'
    )
  );

-- RLS Policies for workspace_members

-- View members
CREATE POLICY "Workspace members can view other members"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_members.workspace_id
      AND members.user_id = auth.uid()
    )
  );

-- Manage members
CREATE POLICY "Owners and managers can manage members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_members.workspace_id
      AND members.user_id = auth.uid()
      AND members.role IN ('owner', 'manager')
    )
  );

-- RLS Policies for workspace_invites

-- View invites
CREATE POLICY "Users can view their own invites"
  ON workspace_invites
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM users WHERE id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_invites.workspace_id
      AND members.user_id = auth.uid()
      AND members.role IN ('owner', 'manager')
    )
  );

-- Create invites
CREATE POLICY "Owners and managers can create invites"
  ON workspace_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_invites.workspace_id
      AND members.user_id = auth.uid()
      AND members.role IN ('owner', 'manager')
    )
  );

-- Update invites
CREATE POLICY "Owners and managers can update invites"
  ON workspace_invites
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_invites.workspace_id
      AND members.user_id = auth.uid()
      AND members.role IN ('owner', 'manager')
    )
  );

-- Functions for workspace management

-- Function to create a workspace and add the creator as owner
CREATE OR REPLACE FUNCTION create_workspace(
  workspace_name text,
  workspace_description text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id uuid;
BEGIN
  -- Insert new workspace
  INSERT INTO workspaces (name, description, created_by)
  VALUES (workspace_name, workspace_description, auth.uid())
  RETURNING id INTO new_workspace_id;

  -- Add creator as owner
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, auth.uid(), 'owner');

  RETURN new_workspace_id;
END;
$$;