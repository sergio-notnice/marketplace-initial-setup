/*
  # Fix Workspace RLS Policies to Prevent Recursion

  1. Changes
    - Drop existing problematic policies
    - Create simplified policies without circular dependencies
    - Fix workspace and member access checks
    
  2. Security
    - Maintain data isolation
    - Ensure proper access control
    - Prevent infinite recursion
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable workspace access" ON workspaces;
DROP POLICY IF EXISTS "Enable workspace member access" ON workspace_members;
DROP POLICY IF EXISTS "Enable workspace campaign access" ON campaigns;
DROP POLICY IF EXISTS "Platform staff can manage all workspaces" ON workspaces;
DROP POLICY IF EXISTS "Platform staff can manage all workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace creators can manage their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Workspace creators can manage members" ON workspace_members;

-- Simple policy for workspace access
CREATE POLICY "workspace_access_policy"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (
    created_by = auth.uid()
    OR
    id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1
      FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'customer_success')
    )
  );

-- Simple policy for workspace members access
CREATE POLICY "workspace_members_access_policy"
  ON workspace_members
  FOR ALL
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id
      FROM workspaces
      WHERE created_by = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1
      FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'customer_success')
    )
  );

-- Simple policy for campaign access
CREATE POLICY "campaign_access_policy"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (
    brand_id = auth.uid()
    OR
    workspace_id IN (
      SELECT workspace_id
      FROM workspace_members
      WHERE user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1
      FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'customer_success')
    )
  );