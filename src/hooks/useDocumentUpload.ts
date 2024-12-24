import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './useToast';
import { useAuth } from '../contexts/AuthContext';

export function useDocumentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();

  const uploadDocument = async (file: File) => {
    if (!user) {
      showToast({ type: 'error', message: 'Please sign in to upload documents' });
      return;
    }

    try {
      setIsUploading(true);
      
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 10MB limit');
      }

      const { data, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${Date.now()}-${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(data.path);

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title: file.name,
          file_path: data.path,
          file_type: file.type,
          file_size: file.size,
          status: 'pending',
          metadata: {
            originalName: file.name,
            publicUrl
          }
        });

      if (dbError) {
        await supabase.storage
          .from('documents')
          .remove([data.path]);
        throw dbError;
      }

      showToast({
        type: 'success',
        message: 'Document uploaded successfully'
      });

      queryClient.invalidateQueries({ queryKey: ['documents'] });
    } catch (error) {
      console.error('Error uploading document:', error);
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to upload document'
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading };
}