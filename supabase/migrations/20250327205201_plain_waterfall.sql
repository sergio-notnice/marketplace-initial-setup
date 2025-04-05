/*
  # Add Active Workspace Support

  1. Changes
    - Add active_workspace_id column to users table
    - Add foreign key constraint to workspaces table
    - Add function to set default active workspace
    - Add trigger to automatically set active workspace for new users
    
  2. Security
    - Maintain existing RLS policies
    - Ensure workspace access control
*/

-- Add active_workspace_id to users table
ALTER TABLE users
ADD COLUMN active_workspace_id uuid REFERENCES workspaces(id);

-- Function to set default active workspace
CREATE OR REPLACE FUNCTION set_default_active_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For brand users, set their first workspace as active
  IF NEW.role = 'brand'::user_role_type THEN
    UPDATE users
    SET active_workspace_id = (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = NEW.id
      ORDER BY joined_at ASC
      LIMIT 1
    )
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set active workspace
DROP TRIGGER IF EXISTS set_default_active_workspace_trigger ON workspace_members;
CREATE TRIGGER set_default_active_workspace_trigger
  AFTER INSERT ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION set_default_active_workspace();

-- Update existing brand users to have an active workspace
DO $$
BEGIN
  UPDATE users u
  SET active_workspace_id = (
    SELECT workspace_id
    FROM workspace_members wm
    WHERE wm.user_id = u.id
    ORDER BY wm.joined_at ASC
    LIMIT 1
  )
  WHERE u.role = 'brand'::user_role_type
  AND u.active_workspace_id IS NULL;
END $$;