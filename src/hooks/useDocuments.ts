import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Document } from '../types';

export function useDocuments() {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Document[];
    }
  });

  return { documents, isLoading };
}