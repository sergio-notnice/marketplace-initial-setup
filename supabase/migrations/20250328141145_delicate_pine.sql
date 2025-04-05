/*
  # Fix Workspace Access Policies

  1. Changes
    - Update workspace members policies to allow proper access
    - Add policies for workspace-scoped data access
    - Fix campaign access within workspaces
    
  2. Security
    - Ensure workspace members can access their workspace data
    - Maintain data isolation between workspaces
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Workspace members can view other members" ON workspace_members;
DROP POLICY IF EXISTS "Owners and managers can manage members" ON workspace_members;
DROP POLICY IF EXISTS "Users can view workspace invites" ON workspace_invites;

-- Workspace Members Access
CREATE POLICY "Allow workspace member access"
  ON workspace_members
  FOR SELECT 
  TO authenticated
  USING (
    -- User is a member of this workspace
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
    OR
    -- User created the workspace
    workspace_id IN (
      SELECT id 
      FROM workspaces 
      WHERE created_by = auth.uid()
    )
  );

-- Campaign Access within Workspace Context
CREATE POLICY "Allow workspace campaign access"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    -- Campaign belongs to user's workspace
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
    OR
    -- User owns the campaign
    brand_id = auth.uid()
  );

-- Workspace Management
CREATE POLICY "Allow workspace management"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (
    -- User is workspace owner/manager
    id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'manager')
    )
    OR
    -- User created the workspace
    created_by = auth.uid()
  );

-- Function to set default active workspace
CREATE OR REPLACE FUNCTION set_default_active_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set active workspace for the user
  UPDATE users
  SET active_workspace_id = NEW.workspace_id
  WHERE id = NEW.user_id
  AND (active_workspace_id IS NULL OR role = 'brand'::user_role_type);
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS set_default_active_workspace_trigger ON workspace_members;
CREATE TRIGGER set_default_active_workspace_trigger
  AFTER INSERT ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION set_default_active_workspace();