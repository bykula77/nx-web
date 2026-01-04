import { useState, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { toAppError } from '../helpers/error.handler';

export interface UseSupabaseStorageOptions {
  /**
   * Storage bucket name
   */
  bucket: string;
}

export interface UploadOptions {
  /**
   * File path in the bucket
   */
  path: string;

  /**
   * File to upload
   */
  file: File;

  /**
   * Content type
   */
  contentType?: string;

  /**
   * Upsert mode (overwrite if exists)
   */
  upsert?: boolean;
}

export interface DownloadOptions {
  /**
   * File path in the bucket
   */
  path: string;
}

/**
 * Supabase storage operations hook
 */
export function useSupabaseStorage({ bucket }: UseSupabaseStorageOptions) {
  const supabase = useSupabase();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Upload a file to storage
   */
  const upload = useCallback(
    async ({ path, file, contentType, upsert = false }: UploadOptions) => {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            contentType: contentType || file.type,
            upsert,
          });

        if (uploadError) {
          throw toAppError(uploadError);
        }

        setUploadProgress(100);
        return data;
      } catch (err) {
        const appError = err instanceof Error ? err : new Error('Upload failed');
        setError(appError);
        throw appError;
      } finally {
        setIsUploading(false);
      }
    },
    [supabase, bucket]
  );

  /**
   * Download a file from storage
   */
  const download = useCallback(
    async ({ path }: DownloadOptions) => {
      try {
        const { data, error: downloadError } = await supabase.storage
          .from(bucket)
          .download(path);

        if (downloadError) {
          throw toAppError(downloadError);
        }

        return data;
      } catch (err) {
        const appError = err instanceof Error ? err : new Error('Download failed');
        setError(appError);
        throw appError;
      }
    },
    [supabase, bucket]
  );

  /**
   * Get public URL for a file
   */
  const getPublicUrl = useCallback(
    (path: string) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    },
    [supabase, bucket]
  );

  /**
   * Create a signed URL for temporary access
   */
  const createSignedUrl = useCallback(
    async (path: string, expiresIn = 3600) => {
      const { data, error: signedUrlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (signedUrlError) {
        throw toAppError(signedUrlError);
      }

      return data.signedUrl;
    },
    [supabase, bucket]
  );

  /**
   * Delete a file from storage
   */
  const remove = useCallback(
    async (paths: string | string[]) => {
      const pathArray = Array.isArray(paths) ? paths : [paths];

      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove(pathArray);

      if (deleteError) {
        throw toAppError(deleteError);
      }
    },
    [supabase, bucket]
  );

  /**
   * List files in a folder
   */
  const list = useCallback(
    async (path?: string) => {
      const { data, error: listError } = await supabase.storage
        .from(bucket)
        .list(path);

      if (listError) {
        throw toAppError(listError);
      }

      return data;
    },
    [supabase, bucket]
  );

  return {
    upload,
    download,
    getPublicUrl,
    createSignedUrl,
    remove,
    list,
    isUploading,
    uploadProgress,
    error,
  };
}

