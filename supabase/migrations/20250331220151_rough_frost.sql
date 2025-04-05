/*
  # Fix Video Upload RLS Policies

  1. Changes
    - Add RLS policies for creator_videos table
    - Fix storage policies for video uploads
    - Ensure proper access control
    
  2. Security
    - Enable RLS on creator_videos table
    - Allow creators to manage their own videos
    - Allow public read access to videos
*/

-- Enable RLS on creator_videos if not already enabled
ALTER TABLE creator_videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view videos" ON creator_videos;
DROP POLICY IF EXISTS "Creators can manage their own videos" ON creator_videos;

-- Policy for viewing videos
CREATE POLICY "Anyone can view videos"
  ON creator_videos
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for managing videos
CREATE POLICY "Creators can manage their own videos"
  ON creator_videos
  FOR ALL
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Creator Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Creator Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Creator Delete Access" ON storage.objects;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('creator-content', 'creator-content', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to storage
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'creator-content');

-- Policy for creator uploads to storage
CREATE POLICY "Creator Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'creator-content' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for creator updates to storage
CREATE POLICY "Creator Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'creator-content' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for creator deletes from storage
CREATE POLICY "Creator Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'creator-content' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);