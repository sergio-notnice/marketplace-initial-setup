/*
  # Fix Creator Profile Structure

  1. Changes
    - Add missing columns to creator_profiles table
    - Set appropriate defaults
    - Add proper constraints
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'creator_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE creator_profiles ADD COLUMN phone text;
  END IF;

  -- Add location column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'creator_profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE creator_profiles ADD COLUMN location jsonb DEFAULT '{"city": null, "country": null}'::jsonb;
  END IF;

  -- Add interests column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'creator_profiles' AND column_name = 'interests'
  ) THEN
    ALTER TABLE creator_profiles ADD COLUMN interests text[] DEFAULT '{}'::text[];
  END IF;

  -- Ensure social_links has default value
  ALTER TABLE creator_profiles 
  ALTER COLUMN social_links SET DEFAULT '{}'::jsonb;

  -- Ensure stats has default value
  ALTER TABLE creator_profiles 
  ALTER COLUMN stats SET DEFAULT '{"rating": 0}'::jsonb;
END $$;