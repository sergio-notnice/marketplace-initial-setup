/*
  # Add creator videos and storage

  1. New Tables
    - `creator_videos`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references users)
      - `title` (text)
      - `url` (text)
      - `type` (text, either 'reference' or 'presentation')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `creator_videos` table
    - Add policies for creators to manage their videos
    - Add policy for anyone to view videos
*/

-- Create creator_videos table
CREATE TABLE IF NOT EXISTS creator_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  type text NOT NULL CHECK (type IN ('reference', 'presentation')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE creator_videos ENABLE ROW LEVEL SECURITY;

-- Policies for creator_videos
CREATE POLICY "Anyone can view videos"
  ON creator_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage their own videos"
  ON creator_videos
  FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Create storage bucket for creator content
INSERT INTO storage.buckets (id, name, public)
VALUES ('creator-content', 'creator-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view creator content"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'creator-content');

CREATE POLICY "Creators can upload content"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'creator-content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Creators can update their content"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'creator-content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Creators can delete their content"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'creator-content' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );