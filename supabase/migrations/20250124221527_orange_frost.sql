/*
  # Fix creator profiles RLS policies

  1. Changes
    - Drop existing restrictive policies
    - Add comprehensive RLS policies for creator profiles
    - Allow creators to manage their own profiles
    - Allow profile creation during initialization
  
  2. Security
    - Maintain data isolation between users
    - Ensure creators can only modify their own data
    - Allow authenticated users to read profiles
*/

-- Drop existing policies for creator_profiles
DROP POLICY IF EXISTS "Anyone can read creator profiles" ON creator_profiles;
DROP POLICY IF EXISTS "Creators can update own profile" ON creator_profiles;
DROP POLICY IF EXISTS "Creators can manage own profile" ON creator_profiles;

-- Create new policies
CREATE POLICY "Anyone can read creator profiles"
  ON creator_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can insert own profile"
  ON creator_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can update own profile"
  ON creator_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can delete own profile"
  ON creator_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);