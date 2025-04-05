/*
  # Fix Workspace Ownership for Test User

  1. Changes
    - Add workspace owner entry for test user
    - Update workspace membership handling function
    - Ensure future users are properly set as owners
    
  2. Security
    - Maintain existing permissions
    - Ensure proper ownership assignment
*/

-- Add owner entry for test user's workspace
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
)
SELECT 
  id as workspace_id,
  created_by as user_id,
  'owner'::workspace_role_type as role,
  '{
    "notifications": {
      "email": true,
      "push": true
    },
    "dashboard_preferences": {
      "default_view": "campaigns"
    }
  }'::jsonb as settings
FROM workspaces
WHERE created_by = 'a098ea74-2924-4590-a94c-b800e8fb3a48'
AND NOT EXISTS (
  SELECT 1 FROM workspace_members
  WHERE workspace_id = workspaces.id
  AND user_id = workspaces.created_by
)
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- Update the create_free_workspace function to ensure owner entry is created
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
  END IF;
  
  RETURN NEW;
END;
$$;