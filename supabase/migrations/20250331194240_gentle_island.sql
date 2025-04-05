/*
  # Fix Video Upload Storage Policies

  1. Changes
    - Drop existing storage policies
    - Create new policies for creator content bucket
    - Allow creators to upload to their own folders
    - Allow public read access to uploaded content
    
  2. Security
    - Ensure proper path validation
    - Restrict uploads to authenticated users
    - Maintain data isolation between users
*/

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view creator content" ON storage.objects;
DROP POLICY IF EXISTS "Creators can upload content" ON storage.objects;
DROP POLICY IF EXISTS "Creators can update their content" ON storage.objects;
DROP POLICY IF EXISTS "Creators can delete their content" ON storage.objects;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('creator-content', 'creator-content', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'creator-content');

-- Policy for creator uploads
CREATE POLICY "Creator Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'creator-content' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for creator updates
CREATE POLICY "Creator Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'creator-content' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for creator deletes
CREATE POLICY "Creator Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'creator-content' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);