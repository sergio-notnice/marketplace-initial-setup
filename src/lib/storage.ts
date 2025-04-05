import { supabase } from './supabase';

export async function uploadVideo(file: File, userId: string, type: 'reference' | 'presentation'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${type}/${Math.random()}${Date.now()}.${fileExt}`;
  const filePath = `videos/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('creator-content')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('creator-content')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadPortfolioImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/portfolio/${Math.random()}${Date.now()}.${fileExt}`;
  const filePath = `images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('creator-content')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('creator-content')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from('creator-content')
    .remove([path]);

  if (error) {
    throw error;
  }
}