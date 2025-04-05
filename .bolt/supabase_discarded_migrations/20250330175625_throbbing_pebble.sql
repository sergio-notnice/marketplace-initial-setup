/*
  # Add Test Creator User

  1. Changes
    - Insert test creator user with specific ID
    - Add creator profile
    - Add creator languages
    - Add test data
*/

-- Insert test creator user
INSERT INTO users (
  id,
  email,
  role,
  name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '9d92037d-2a72-4084-b258-3038af03ca28',
  'test.creator@example.com',
  'creator'::user_role_type,
  'Test Creator',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url;

-- Create creator profile
INSERT INTO creator_profiles (
  id,
  user_id,
  bio,
  categories,
  social_links,
  stats,
  address,
  app_language,
  notification_preferences,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '9d92037d-2a72-4084-b258-3038af03ca28',
  'Test creator profile for development and testing purposes.',
  ARRAY['Tech', 'Lifestyle', 'Gaming'],
  '{
    "instagram": "https://instagram.com/testcreator",
    "youtube": "https://youtube.com/@testcreator",
    "twitter": "https://twitter.com/testcreator"
  }',
  '{
    "followers": 50000,
    "engagement_rate": 4.2,
    "rating": 4.7
  }',
  '{
    "street": "123 Test Street",
    "city": "Berlin",
    "country": "Germany",
    "postal_code": "10115"
  }',
  'en',
  '{
    "email": true,
    "push": true,
    "marketing": false
  }',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE
SET
  bio = EXCLUDED.bio,
  categories = EXCLUDED.categories,
  social_links = EXCLUDED.social_links,
  stats = EXCLUDED.stats,
  address = EXCLUDED.address,
  app_language = EXCLUDED.app_language,
  notification_preferences = EXCLUDED.notification_preferences,
  updated_at = now();

-- Add creator languages
INSERT INTO creator_languages (
  creator_id,
  language,
  proficiency,
  is_content_language
)
SELECT 
  cp.id,
  unnest(ARRAY['English', 'German', 'French']) as language,
  unnest(ARRAY['native', 'fluent', 'intermediate']) as proficiency,
  unnest(ARRAY[true, true, false]) as is_content_language
FROM creator_profiles cp
WHERE cp.user_id = '9d92037d-2a72-4084-b258-3038af03ca28'
ON CONFLICT DO NOTHING;