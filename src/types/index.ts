export interface Document {
  id: string;
  user_id: string;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserQuery {
  id: string;
  user_id: string;
  query: string;
  response: string | null;
  documents_referenced: string[];
  created_at: string;
}