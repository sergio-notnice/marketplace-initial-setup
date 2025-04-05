-- Insert test brand user
INSERT INTO users (
  id,
  email,
  role,
  name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  'b0a68a4b-7e6a-4f2a-9c8d-3d3c1e4c0b5a',
  'brand@example.com',
  'brand',
  'Nike Marketing',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

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
  'c1b79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'creator@example.com',
  'creator',
  'Sarah Johnson',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

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
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'c1b79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'Lifestyle and travel content creator with a passion for sustainable living and authentic storytelling.',
  ARRAY['Lifestyle', 'Travel', 'Fashion', 'Sustainability'],
  '{
    "instagram": "https://instagram.com/sarahjohnson",
    "youtube": "https://youtube.com/sarahjohnson",
    "tiktok": "https://tiktok.com/@sarahjohnson"
  }',
  '{
    "followers": 125000,
    "engagement_rate": 3.2,
    "rating": 4.8
  }',
  '{
    "street": "123 Creator Street",
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
) ON CONFLICT (id) DO NOTHING;

-- Add creator languages
INSERT INTO creator_languages (
  id,
  creator_id,
  language,
  proficiency,
  is_content_language
) VALUES
(
  gen_random_uuid(),
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'English',
  'fluent',
  true
),
(
  gen_random_uuid(),
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'German',
  'native',
  true
),
(
  gen_random_uuid(),
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'French',
  'intermediate',
  false
);

-- Add creator banking info
INSERT INTO creator_banking_info (
  id,
  creator_id,
  bank_holder_name,
  bank_country,
  encrypted_details,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'Sarah Johnson',
  'DE',
  '{
    "iban": "**************1234",
    "bank_name": "Deutsche Bank"
  }',
  now(),
  now()
);

-- Add portfolio items
INSERT INTO creator_portfolio_items (
  id,
  creator_id,
  title,
  description,
  media_urls,
  type,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'Sustainable Travel Guide',
  'A comprehensive guide to eco-friendly travel practices',
  ARRAY[
    'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&q=80&w=600&h=400',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600&h=400'
  ],
  'guide',
  now(),
  now()
),
(
  gen_random_uuid(),
  'a2c80c6d-9f8c-6f4c-1e0f-5f5e3f6e2d7c',
  'Fashion Brand Campaign',
  'Summer collection showcase focusing on sustainable materials',
  ARRAY[
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600&h=400'
  ],
  'campaign',
  now(),
  now()
);

-- Add creator videos
INSERT INTO creator_videos (
  id,
  creator_id,
  title,
  url,
  type,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'c1b79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'Sustainable Travel Tips',
  'https://example.com/videos/sustainable-travel-tips',
  'reference',
  now(),
  now()
),
(
  gen_random_uuid(),
  'c1b79b5c-8f7b-4f3b-0d9e-4e4d2f5d1c6b',
  'Brand Collaboration Showcase',
  'https://example.com/videos/brand-showcase',
  'presentation',
  now(),
  now()
);