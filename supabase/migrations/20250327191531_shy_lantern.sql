/*
  # Add Free Workspace on Signup

  1. Changes
    - Add function to automatically create a free workspace for new users
    - Add trigger to call this function when a new user is created
    - Update workspace policies to allow users to view and manage their workspaces
*/

-- Function to create a free workspace for new users
CREATE OR REPLACE FUNCTION create_free_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create workspace for brand users
  IF NEW.role = 'brand'::user_role_type THEN
    -- Create the workspace
    INSERT INTO workspaces (
      name,
      description,
      created_by,
      branding,
      metadata
    ) VALUES (
      NEW.name,
      'Personal workspace',
      NEW.id,
      '{
        "logo_url": null,
        "primary_color": "#4f46e5",
        "accent_color": "#6366f1"
      }',
      '{
        "type": "free",
        "features": ["basic_campaigns", "creator_search", "messaging"]
      }'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create free workspace
DROP TRIGGER IF EXISTS create_free_workspace_trigger ON users;
CREATE TRIGGER create_free_workspace_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_free_workspace();

-- Update workspace policies to ensure users can access their workspaces
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON workspaces;
CREATE POLICY "Users can view workspaces they are members of"
  ON workspaces
  FOR SELECT
  TO authenticated
  USING (
    -- User is a member of the workspace
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
    OR
    -- User created the workspace
    created_by = auth.uid()
  );

-- Allow workspace creators to manage their workspaces
DROP POLICY IF EXISTS "Workspace creators can manage their workspaces" ON workspaces;
CREATE POLICY "Workspace creators can manage their workspaces"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid());

-- Update workspace members policies
DROP POLICY IF EXISTS "Workspace creators can manage members" ON workspace_members;
CREATE POLICY "Workspace creators can manage members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND workspaces.created_by = auth.uid()
    )
  );