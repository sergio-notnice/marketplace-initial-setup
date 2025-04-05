/*
  # Final Fix for Workspace Access Policies

  1. Changes
    - Comprehensive workspace access policies
    - Cascading permissions from workspace to data
    - Proper handling of workspace ownership
    
  2. Security
    - Maintain data isolation between workspaces
    - Allow proper access for workspace members
    - Support workspace management
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow workspace member access" ON workspace_members;
DROP POLICY IF EXISTS "Allow workspace campaign access" ON campaigns;
DROP POLICY IF EXISTS "Allow workspace management" ON workspaces;

-- Workspace Access
CREATE POLICY "Enable workspace access"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (
    id IN (
      -- User is a workspace member
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
    OR 
    -- User created the workspace
    created_by = auth.uid()
    OR
    -- User is platform staff
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin'::user_role_type, 'customer_success'::user_role_type)
    )
  );

-- Workspace Members Access
CREATE POLICY "Enable workspace member access"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    -- Member of the workspace
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Created the workspace
    workspace_id IN (
      SELECT id 
      FROM workspaces 
      WHERE created_by = auth.uid()
    )
    OR
    -- Platform staff
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin'::user_role_type, 'customer_success'::user_role_type)
    )
  );

-- Campaign Access within Workspace
CREATE POLICY "Enable workspace campaign access"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (
    -- Campaign in user's workspace
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
    OR
    -- User owns the campaign
    brand_id = auth.uid()
    OR
    -- Platform staff
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin'::user_role_type, 'customer_success'::user_role_type)
    )
  );

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

-- Recreate membership trigger
DROP TRIGGER IF EXISTS handle_workspace_membership_trigger ON workspace_members;
CREATE TRIGGER handle_workspace_membership_trigger
  AFTER INSERT ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION handle_workspace_membership();

-- Update existing workspace memberships
UPDATE users u
SET active_workspace_id = (
  SELECT workspace_id 
  FROM workspace_members wm
  WHERE wm.user_id = u.id
  ORDER BY wm.joined_at ASC
  LIMIT 1
)
WHERE active_workspace_id IS NULL
AND EXISTS (
  SELECT 1 
  FROM workspace_members wm2
  WHERE wm2.user_id = u.id
);