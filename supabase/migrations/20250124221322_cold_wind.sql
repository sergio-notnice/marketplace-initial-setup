/*
  # Fix creator profiles RLS policies

  1. Changes
    - Update RLS policies for creator_profiles table to allow creation of profiles
    - Add policy for inserting creator profiles
    - Fix policy for updating profiles

  2. Security
    - Maintain security while allowing proper profile creation
    - Ensure authenticated users can create their own profiles
*/

-- Drop existing policies for creator_profiles
DROP POLICY IF EXISTS "Anyone can read creator profiles" ON creator_profiles;
DROP POLICY IF EXISTS "Creators can update own profile" ON creator_profiles;

-- Create new policies
CREATE POLICY "Anyone can read creator profiles"
  ON creator_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage own profile"
  ON creator_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);