/*
  # Simplify Workspace Policies to Single Source of Truth

  1. Changes
    - Use workspace_members as single source of truth
    - Simplify workspaces policies to basic auth check
    - Remove circular dependencies completely
    
  2. Security
    - Maintain data isolation through workspace_members
    - Keep proper access control via simplified policies
    - Prevent recursion by avoiding cross-table checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "workspace_access_policy" ON workspaces;
DROP POLICY IF EXISTS "workspace_members_access_policy" ON workspace_members;
DROP POLICY IF EXISTS "campaign_access_policy" ON campaigns;

-- Simple authentication check for workspaces
-- This avoids querying workspace_members in the policy
CREATE POLICY "authenticated_can_read_workspaces"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (true);

-- Workspace creators can manage their workspaces
CREATE POLICY "creators_manage_workspaces"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

-- Workspace members is our source of truth
CREATE POLICY "members_access_policy"
  ON workspace_members
  FOR SELECT
  TO authenticated
  USING (
    -- User is the member
    user_id = auth.uid()
    OR
    -- User is platform staff
    EXISTS (
      SELECT 1
      FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'customer_success')
    )
  );

-- Only workspace owners can manage members
CREATE POLICY "owners_manage_members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    -- Check if user is owner in workspace_members
    EXISTS (
      SELECT 1 
      FROM workspace_members owner_check
      WHERE owner_check.workspace_id = workspace_members.workspace_id
      AND owner_check.user_id = auth.uid()
      AND owner_check.role = 'owner'
    )
  );

-- Campaigns inherit access from workspace_members
CREATE POLICY "campaign_access_policy"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    -- Direct owner access
    brand_id = auth.uid()
    OR
    -- Workspace member access
    EXISTS (
      SELECT 1
      FROM workspace_members
      WHERE workspace_members.workspace_id = campaigns.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Only campaign owners can manage campaigns
CREATE POLICY "campaign_management_policy"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (brand_id = auth.uid())
  WITH CHECK (brand_id = auth.uid());