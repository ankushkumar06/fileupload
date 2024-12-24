import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { supabase } from '../supabase';

export class LangChainProcessor {
  private embeddings: OpenAIEmbeddings;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY
    });
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
  }

  async processText(documentId: string, text: string) {
    const chunks = await this.textSplitter.createDocuments([text]);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await this.embeddings.embedQuery(chunk.pageContent);
      
      // Store chunk
      const { error: chunkError } = await supabase
        .from('document_chunks')
        .insert({
          document_id: documentId,
          content: chunk.pageContent,
          chunk_index: i,
          metadata: chunk.metadata
        });

      if (chunkError) throw chunkError;

      // Store embedding
      const { error: embeddingError } = await supabase
        .from('document_embeddings')
        .insert({
          chunk_id: documentId,
          embedding
        });

      if (embeddingError) throw embeddingError;
    }
  }
}