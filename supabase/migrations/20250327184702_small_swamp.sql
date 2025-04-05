/*
  # Add Additional Brand Accounts

  1. New Accounts
    - Adidas Sports (Sports & Fitness Division)
    - Puma Lifestyle (Fashion & Lifestyle Division)
    
  2. Changes
    - Insert new brand users
    - Add them to appropriate workspaces
*/

-- Insert Adidas Sports brand account
INSERT INTO users (
  id,
  email,
  role,
  name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  'b1c79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'adidas@example.com',
  'brand'::user_role_type,
  'Adidas Sports',
  'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100&h=100',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Add Adidas to Sports & Fitness workspace
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
) VALUES (
  '22222222-2222-2222-2222-222222222222', -- Sports & Fitness Division
  'b1c79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'member',
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

-- Insert Puma Lifestyle brand account
INSERT INTO users (
  id,
  email,
  role,
  name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  'b2d80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'puma@example.com',
  'brand'::user_role_type,
  'Puma Lifestyle',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Add Puma to Fashion & Lifestyle workspace
INSERT INTO workspace_members (
  workspace_id,
  user_id,
  role,
  settings
) VALUES (
  '33333333-3333-3333-3333-333333333333', -- Fashion & Lifestyle Division
  'b2d80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'member',
  '{
    "notifications": {
      "email": true,
      "push": true
    },
    "dashboard_preferences": {
      "default_view": "creators"
    }
  }'
) ON CONFLICT (workspace_id, user_id) DO NOTHING;