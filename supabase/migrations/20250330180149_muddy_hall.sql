/*
  # Add base_price column to creator_profiles

  1. Changes
    - Add base_price column to creator_profiles table
    - Set default value to 0
    - Make column nullable
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add base_price column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'creator_profiles' AND column_name = 'base_price'
  ) THEN
    ALTER TABLE creator_profiles 
    ADD COLUMN base_price numeric DEFAULT 0;
  END IF;
END $$;

-- Update existing profiles to have a default base_price
UPDATE creator_profiles
SET base_price = 0
WHERE base_price IS NULL;