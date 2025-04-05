/*
  # Update User Roles and Workspace Policies

  1. Changes
    - Keep customer_success role for platform staff
    - Keep admin role for platform administrators
    - Update workspace creation policy to allow brands to create workspaces
    
  2. Security
    - Maintain existing permissions
    - Update role checks in policies
*/

-- Drop existing workspace creation policy
DROP POLICY IF EXISTS "Agency users can create workspaces" ON workspaces;

-- Update workspace creation policy to allow brands and platform staff
CREATE POLICY "Brands and platform staff can create workspaces"
  ON workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (
        role = 'brand'::user_role_type OR 
        role = 'admin'::user_role_type OR 
        role = 'customer_success'::user_role_type
      )
    )
  );

-- Update workspace management policies
CREATE POLICY "Platform staff can manage all workspaces"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (
        role = 'admin'::user_role_type OR 
        role = 'customer_success'::user_role_type
      )
    )
  );

-- Add platform staff access to workspace members
CREATE POLICY "Platform staff can manage all workspace members"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (
        role = 'admin'::user_role_type OR 
        role = 'customer_success'::user_role_type
      )
    )
  );

-- Add platform staff access to workspace invites
CREATE POLICY "Platform staff can manage all workspace invites"
  ON workspace_invites
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (
        role = 'admin'::user_role_type OR 
        role = 'customer_success'::user_role_type
      )
    )
  );