/*
  # Add interests and language enums

  1. Changes
    - Create interests_type ENUM
    - Create language_type ENUM
    - Update creator_profiles table
    - Add constraints and defaults
    
  2. Security
    - Maintain existing RLS policies
    - Safe data migration
*/

-- Create interests_type ENUM
DO $$ BEGIN
  CREATE TYPE interests_type AS ENUM (
    'Fashion',
    'Beauty',
    'Fitness',
    'Health',
    'Travel',
    'Outdoors',
    'Food',
    'Cooking',
    'Technology',
    'Gadgets',
    'Lifestyle',
    'DIY',
    'Art',
    'Music',
    'Gaming'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create language_type ENUM
DO $$ BEGIN
  CREATE TYPE language_type AS ENUM (
    'German',
    'English',
    'French',
    'Italian',
    'Spanish',
    'Dutch',
    'Polish',
    'Czech',
    'Slovak',
    'Hungarian',
    'Romanian',
    'Croatian',
    'Slovenian',
    'Danish',
    'Finnish',
    'Norwegian',
    'Swedish',
    'Arabic'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- First update existing data to match new enum values
UPDATE creator_languages
SET language = 'English'
WHERE language = 'Deutsch';

-- Add temporary column for interests
ALTER TABLE creator_profiles 
ADD COLUMN IF NOT EXISTS interests_new interests_type[] DEFAULT '{}'::interests_type[];

-- Migrate existing interests data safely
UPDATE creator_profiles
SET interests_new = ARRAY(
  SELECT DISTINCT unnest.interest::interests_type
  FROM unnest(interests) AS unnest(interest)
  WHERE unnest.interest::text::interests_type IS NOT NULL
);

-- Drop old interests column and rename new one
ALTER TABLE creator_profiles
DROP COLUMN interests;

ALTER TABLE creator_profiles
RENAME COLUMN interests_new TO interests;

-- Add check constraint for interests array
ALTER TABLE creator_profiles
ADD CONSTRAINT valid_interests_check
CHECK (array_length(interests, 1) <= 5); -- Maximum 5 interests per profile

-- Update language column in creator_languages
ALTER TABLE creator_languages
ALTER COLUMN language TYPE language_type USING language::language_type;