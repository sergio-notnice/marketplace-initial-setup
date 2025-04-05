/*
  # Workspace Access Control Policies

  1. Changes
    - Update RLS policies for workspace_members table
    - Update RLS policies for workspace_invites table
    - Add policies for workspace data access
    
  2. Security
    - Ensure workspace members can only access their workspace data
    - Control invite management based on roles
    - Protect sensitive workspace information
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Workspace members can view other members" ON workspace_members;
DROP POLICY IF EXISTS "Owners and managers can manage members" ON workspace_members;
DROP POLICY IF EXISTS "Users can view their own invites" ON workspace_invites;
DROP POLICY IF EXISTS "Owners and managers can create invites" ON workspace_invites;
DROP POLICY IF EXISTS "Owners and managers can update invites" ON workspace_invites;

-- Workspace Members Policies

-- View members
CREATE POLICY "Workspace members can view other members"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    -- User is a member of the workspace
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_members.workspace_id
      AND members.user_id = auth.uid()
    )
    OR
    -- User created the workspace
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_members.workspace_id
      AND w.created_by = auth.uid()
    )
  );

-- Manage members (owners and managers only)
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

-- Workspace Invites Policies

-- View invites
CREATE POLICY "Users can view workspace invites"
  ON workspace_invites
  FOR SELECT
  TO authenticated
  USING (
    -- User is the invitee
    email = (
      SELECT email FROM users 
      WHERE id = auth.uid()
    )
    OR
    -- User is a workspace owner/manager
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_invites.workspace_id
      AND members.user_id = auth.uid()
      AND members.role IN ('owner', 'manager')
    )
    OR
    -- User created the workspace
    EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_invites.workspace_id
      AND w.created_by = auth.uid()
    )
  );

-- Create invites (owners and managers only)
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

-- Update invites (owners and managers only)
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

-- Delete invites (owners and managers only)
CREATE POLICY "Owners and managers can delete invites"
  ON workspace_invites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members members
      WHERE members.workspace_id = workspace_invites.workspace_id
      AND members.user_id = auth.uid()
      AND members.role IN ('owner', 'manager')
    )
  );

-- Function to automatically add user to workspace when accepting invite
CREATE OR REPLACE FUNCTION accept_workspace_invite()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    -- Add user to workspace members
    INSERT INTO workspace_members (
      workspace_id,
      user_id,
      role,
      invited_by
    )
    VALUES (
      NEW.workspace_id,
      (SELECT id FROM users WHERE email = NEW.email),
      NEW.role,
      NEW.invited_by
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for invite acceptance
DROP TRIGGER IF EXISTS workspace_invite_accepted_trigger ON workspace_invites;
CREATE TRIGGER workspace_invite_accepted_trigger
  AFTER UPDATE OF status ON workspace_invites
  FOR EACH ROW
  EXECUTE FUNCTION accept_workspace_invite();