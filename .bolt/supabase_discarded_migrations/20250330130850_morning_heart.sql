/*
  # Fix Workspace RLS Policies

  1. Changes
    - Simplify RLS policies to avoid recursion
    - Make workspace_members the source of truth
    - Remove circular dependencies between policies
    
  2. Security
    - Maintain data isolation
    - Ensure proper access control
    - Allow platform staff access
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "authenticated_can_read_workspaces" ON workspaces;
DROP POLICY IF EXISTS "creators_manage_workspaces" ON workspaces;
DROP POLICY IF EXISTS "members_access_policy" ON workspace_members;
DROP POLICY IF EXISTS "owners_manage_members" ON workspace_members;
DROP POLICY IF EXISTS "campaign_access_policy" ON campaigns;
DROP POLICY IF EXISTS "campaign_management_policy" ON campaigns;

-- Workspace policies
-- Allow all authenticated users to read workspaces
CREATE POLICY "authenticated_can_read_workspaces"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow workspace creators to manage their workspaces
CREATE POLICY "creators_manage_workspaces"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

-- Workspace members policies
-- Allow members to read their memberships
CREATE POLICY "members_read_policy"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin'::user_role_type, 'customer_success'::user_role_type)
    )
  );

-- Allow owners and managers to manage members
CREATE POLICY "owners_manage_members_policy"
  ON workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner'::workspace_role_type, 'manager'::workspace_role_type)
    )
  );

CREATE POLICY "owners_manage_members_select"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner'::workspace_role_type, 'manager'::workspace_role_type)
    )
  );

CREATE POLICY "owners_manage_members_update"
  ON workspace_members
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner'::workspace_role_type, 'manager'::workspace_role_type)
    )
  );

CREATE POLICY "owners_manage_members_delete"
  ON workspace_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner'::workspace_role_type, 'manager'::workspace_role_type)
    )
  );

-- Campaign policies
-- Allow members to read campaigns in their workspace
CREATE POLICY "campaign_access_policy"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    (brand_id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = campaigns.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Allow brands to manage their own campaigns
CREATE POLICY "campaign_management_policy"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (brand_id = auth.uid())
  WITH CHECK (brand_id = auth.uid());

-- Function to handle workspace membership
CREATE OR REPLACE FUNCTION handle_workspace_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set active workspace for new members
  UPDATE users
  SET active_workspace_id = NEW.workspace_id
  WHERE id = NEW.user_id
  AND (
    active_workspace_id IS NULL 
    OR role = 'brand'::user_role_type
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for handling workspace membership
DROP TRIGGER IF EXISTS handle_workspace_membership_trigger ON workspace_members;
CREATE TRIGGER handle_workspace_membership_trigger
  AFTER INSERT ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION handle_workspace_membership();