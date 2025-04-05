/*
  # Fix User Roles

  1. Changes
    - Create user_role_type ENUM with correct roles
    - Update users table to use new role type
    - Recreate policies with new role types
    
  2. Security
    - Maintain existing permissions
    - Update role checks in policies
*/

-- Create the user_role_type ENUM
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('creator', 'brand', 'admin', 'customer_success');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Drop dependent policies first
DROP POLICY IF EXISTS "Creators can create applications" ON applications;
DROP POLICY IF EXISTS "Agency admins can create workspaces" ON workspaces;

-- Add new column with the enum type
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role_new user_role_type;

-- Update the new column with converted values
UPDATE users 
SET role_new = CASE 
  WHEN role::text = 'admin' THEN 'admin'::user_role_type
  WHEN role::text = 'creator' THEN 'creator'::user_role_type
  WHEN role::text = 'brand' THEN 'brand'::user_role_type
  ELSE 'customer_success'::user_role_type
END;

-- Drop the old column and constraints
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

-- Drop the old column
ALTER TABLE users 
DROP COLUMN role CASCADE;

-- Make the new column required
ALTER TABLE users 
ALTER COLUMN role_new SET NOT NULL;

-- Rename the new column
ALTER TABLE users 
RENAME COLUMN role_new TO role;

-- Recreate the dependent policies with the new column type
CREATE POLICY "Creators can create applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND 
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'creator'::user_role_type
    )
  );

-- Update workspace creation policy to allow agency users
CREATE POLICY "Agency users can create workspaces"
  ON workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'admin'::user_role_type OR role = 'customer_success'::user_role_type)
    )
  );