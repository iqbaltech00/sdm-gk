import { supabase } from '../lib/supabase';

/**
 * Mengunggah file (KTP, KK, SKCK, dll) ke Supabase Storage Bucket
 * @param file File objek dari input file HTML
 * @param bucketName Nama bucket di Supabase (contoh: 'employee-docs' atau 'overtime-attachments')
 * @param folderPath Sub-folder tujuan (contoh: 'ktp', 'skck')
 */
export async function uploadFileToSupabase(
  file: File,
  bucketName: string = 'employee-docs',
  folderPath: string = 'general'
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36.substring(2, 9))}.${fileExt}`;
    const filePath = `${folderPath}/${fileName}`;

    // 1. Upload file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Dapatkan Public URL file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error: any) {
    console.error('Gagal mengunggah file ke Supabase Storage:', error.message);
    return { error: error.message || 'Terjadi kesalahan saat upload file.' };
  }
}

/**
 * Menghapus file dari Supabase Storage
 */
export async function deleteFileFromSupabase(filePath: string, bucketName: string = 'employee-docs'): Promise<boolean> {
  const { error } = await supabase.storage.from(bucketName).remove([filePath]);
  if (error) {
    console.error('Gagal menghapus file:', error.message);
    return false;
  }
  return true;
}