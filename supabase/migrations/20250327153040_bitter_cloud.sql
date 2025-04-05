-- Function to update workspace name when company name changes
CREATE OR REPLACE FUNCTION update_workspace_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update workspace name if the user is a brand and their name changed
  IF OLD.role = 'brand'::user_role_type AND NEW.name != OLD.name THEN
    UPDATE workspaces
    SET name = NEW.name
    WHERE created_by = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update workspace name
DROP TRIGGER IF EXISTS update_workspace_name_trigger ON users;
CREATE TRIGGER update_workspace_name_trigger
  AFTER UPDATE OF name ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_workspace_name();