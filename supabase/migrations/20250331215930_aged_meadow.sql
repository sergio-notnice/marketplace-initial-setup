-- Drop existing storage policies with correct names
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Creator Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Creator Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Creator Delete Access" ON storage.objects;

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