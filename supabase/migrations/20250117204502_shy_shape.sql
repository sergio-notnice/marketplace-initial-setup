/*
  # Fix Users RLS Policy

  1. Changes
    - Add policy to allow inserting new users during registration
    - Keep existing policies for reading and updating own data
*/

CREATE POLICY "Allow users to insert their own data during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public to insert during registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);