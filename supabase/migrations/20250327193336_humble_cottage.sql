/*
  # Create Workspaces for Dummy Brands

  1. Changes
    - Create workspaces for Nike, Adidas, and Puma
    - Add workspace members
    - Update campaign workspace associations
*/

-- Create workspace for Nike Marketing
INSERT INTO workspaces (
  id,
  name,
  description,
  created_by,
  branding,
  metadata
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Nike Marketing',
  'Nike brand workspace for managing campaigns and creators',
  'b0a68a4b-7e6a-4f2a-9c8d-3d3c1e4c0b5a', -- Nike brand ID
  '{
    "logo_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "primary_color": "#111827",
    "accent_color": "#374151"
  }',
  '{
    "type": "free",
    "features": ["basic_campaigns", "creator_search", "messaging"]
  }'
) ON CONFLICT (id) DO NOTHING;

-- Add Nike as workspace owner
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'b0a68a4b-7e6a-4f2a-9c8d-3d3c1e4c0b5a',
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
) ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- Create workspace for Adidas Sports
INSERT INTO workspaces (
  id,
  name,
  description,
  created_by,
  branding,
  metadata
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Adidas Sports',
  'Adidas brand workspace for managing sports campaigns',
  'b1c79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b', -- Adidas brand ID
  '{
    "logo_url": "https://images.unsplash.com/photo-1544441893-675973e31985",
    "primary_color": "#1e40af",
    "accent_color": "#3b82f6"
  }',
  '{
    "type": "free",
    "features": ["basic_campaigns", "creator_search", "messaging"]
  }'
) ON CONFLICT (id) DO NOTHING;

-- Add Adidas as workspace owner
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'b1c79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
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
) ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- Create workspace for Puma Lifestyle
INSERT INTO workspaces (
  id,
  name,
  description,
  created_by,
  branding,
  metadata
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'Puma Lifestyle',
  'Puma brand workspace for managing lifestyle campaigns',
  'b2d80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c', -- Puma brand ID
  '{
    "logo_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "primary_color": "#be185d",
    "accent_color": "#db2777"
  }',
  '{
    "type": "free",
    "features": ["basic_campaigns", "creator_search", "messaging"]
  }'
) ON CONFLICT (id) DO NOTHING;

-- Add Puma as workspace owner
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'b2d80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
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
) ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- Update Nike's campaigns to use their workspace
UPDATE campaigns
SET workspace_id = '44444444-4444-4444-4444-444444444444'
WHERE brand_id = 'b0a68a4b-7e6a-4f2a-9c8d-3d3c1e4c0b5a'
AND workspace_id IS NULL;

-- Update Adidas's campaigns to use their workspace
UPDATE campaigns
SET workspace_id = '55555555-5555-5555-5555-555555555555'
WHERE brand_id = 'b1c79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b'
AND workspace_id IS NULL;

-- Update Puma's campaigns to use their workspace
UPDATE campaigns
SET workspace_id = '66666666-6666-6666-6666-666666666666'
WHERE brand_id = 'b2d80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c'
AND workspace_id IS NULL;