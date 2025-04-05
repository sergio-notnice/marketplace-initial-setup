/*
  # Fix Active Workspace Setting

  1. Changes
    - Update create_free_workspace function to set active_workspace_id
    - Add function to handle workspace membership
    - Add trigger for workspace membership handling
*/

-- Update create_free_workspace to set active workspace
CREATE OR REPLACE FUNCTION create_free_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id uuid;
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
    )
    RETURNING id INTO new_workspace_id;

    -- Add user as workspace owner
    INSERT INTO workspace_members (
      workspace_id,
      user_id,
      role,
      settings
    ) VALUES (
      new_workspace_id,
      NEW.id,
      'owner',
      '{
        "notifications": {
          "email": true,
          "push": true
        },
        "dashboard_preferences": {
          "default_view": "campaigns"
        }
      }'
    );

    -- Set active workspace
    UPDATE users
    SET active_workspace_id = new_workspace_id
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to handle workspace membership
CREATE OR REPLACE FUNCTION handle_workspace_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set active workspace if not set
  UPDATE users
  SET active_workspace_id = NEW.workspace_id
  WHERE id = NEW.user_id
  AND active_workspace_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger for workspace membership
DROP TRIGGER IF EXISTS handle_workspace_membership_trigger ON workspace_members;
CREATE TRIGGER handle_workspace_membership_trigger
  AFTER INSERT ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION handle_workspace_membership();

-- Update existing users without active workspace
UPDATE users u
SET active_workspace_id = (
  SELECT workspace_id
  FROM workspace_members wm
  WHERE wm.user_id = u.id
  AND wm.role = 'owner'
  ORDER BY wm.joined_at ASC
  LIMIT 1
)
WHERE active_workspace_id IS NULL
AND EXISTS (
  SELECT 1
  FROM workspace_members wm2
  WHERE wm2.user_id = u.id
  AND wm2.role = 'owner'
);