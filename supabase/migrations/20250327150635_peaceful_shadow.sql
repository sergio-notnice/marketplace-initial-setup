/*
  # Create Test Workspaces and Agency Admin

  1. New Data
    - Agency admin user
    - Two test workspaces
    - Workspace memberships
    
  2. Changes
    - Link existing campaigns to workspaces
    - Link existing creator profiles to workspaces
*/

-- Create agency admin user
INSERT INTO users (
  id,
  email,
  role,
  name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@example.com',
  'admin'::user_role_type,
  'Agency Admin',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create first workspace (Sports & Fitness)
INSERT INTO workspaces (
  id,
  name,
  description,
  created_by,
  branding,
  metadata
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Sports & Fitness Division',
  'Managing sports and fitness related campaigns and creators',
  '11111111-1111-1111-1111-111111111111',
  '{
    "logo_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "primary_color": "#0284c7",
    "accent_color": "#0ea5e9"
  }',
  '{
    "industry": "sports",
    "focus_areas": ["fitness", "athletics", "wellness"],
    "target_demographics": ["18-35", "fitness enthusiasts", "athletes"]
  }'
) ON CONFLICT (id) DO NOTHING;

-- Create second workspace (Fashion & Lifestyle)
INSERT INTO workspaces (
  id,
  name,
  description,
  created_by,
  branding,
  metadata
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Fashion & Lifestyle Division',
  'Managing fashion, beauty, and lifestyle campaigns and creators',
  '11111111-1111-1111-1111-111111111111',
  '{
    "logo_url": "https://images.unsplash.com/photo-1544441893-675973e31985",
    "primary_color": "#be185d",
    "accent_color": "#ec4899"
  }',
  '{
    "industry": "fashion",
    "focus_areas": ["fashion", "beauty", "lifestyle"],
    "target_demographics": ["18-45", "fashion enthusiasts", "trendsetters"]
  }'
) ON CONFLICT (id) DO NOTHING;

-- Add admin as owner to both workspaces
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
) VALUES 
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  '{
    "notifications": {
      "email": true,
      "push": true
    },
    "dashboard_preferences": {
      "default_view": "campaigns",
      "show_analytics": true
    }
  }'
),
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  '{
    "notifications": {
      "email": true,
      "push": true
    },
    "dashboard_preferences": {
      "default_view": "creators",
      "show_analytics": true
    }
  }'
);

-- Add existing brand to Sports & Fitness workspace
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'b0a68a4b-7e6a-4f2a-9c8d-3d3c1e4c0b5a',
  'member'
);

-- Add existing creator to Fashion & Lifestyle workspace
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'c1b79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'member'
);

-- Link existing campaigns to workspaces
UPDATE campaigns
SET workspace_id = '22222222-2222-2222-2222-222222222222'
WHERE brand_id = 'b0a68a4b-7e6a-4f2a-9c8d-3d3c1e4c0b5a';

-- Link existing creator profiles to workspaces
UPDATE creator_profiles
SET workspace_id = '33333333-3333-3333-3333-333333333333'
WHERE user_id = 'c1b79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b';