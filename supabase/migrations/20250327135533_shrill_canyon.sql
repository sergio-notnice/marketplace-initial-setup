/*
  # Create User Role Enum Type and Update Users Table

  1. Changes
    - Create ENUM type for user roles
    - Update users table to use new ENUM type
    - Migrate existing data safely
    - Handle dependent policies
    
  2. Security
    - Drop and recreate dependent policies
    - Maintain data integrity during migration
*/

-- Create the user_role_type ENUM
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('creator', 'brand', 'admin', 'customer_success');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Drop dependent policies first
DROP POLICY IF EXISTS "Creators can create applications" ON applications;

-- Add new column with the enum type
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role_new user_role_type;

-- Update the new column with converted values
UPDATE users 
SET role_new = role::user_role_type;

-- Drop the old column and constraints
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

-- Drop the old column
ALTER TABLE users 
DROP COLUMN role CASCADE;

-- Make the new column required
ALTER TABLE users 
ALTER COLUMN role_new SET NOT NULL;

-- Rename the new column in a separate statement
ALTER TABLE users 
RENAME COLUMN role_new TO role;

-- Recreate the dependent policy with the new column type
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