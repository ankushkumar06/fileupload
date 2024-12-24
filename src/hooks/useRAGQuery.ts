import { useState, useMemo } from 'react';
import { RAGAgent } from '../lib/rag/ragAgent';
import { useToast } from './useToast';
import { config } from '../config/env';

export function useRAGQuery() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const ragAgent = useMemo(() => {
    try {
      return new RAGAgent();
    } catch (error) {
      console.error('Failed to initialize RAG agent:', error);
      return null;
    }
  }, []);

  const submitQuery = async (query: string) => {
    if (!ragAgent) {
      showToast({
        type: 'error',
        message: 'RAG system is not available. Please check your API keys.'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await ragAgent.query(query);
      setResponse(result);
    } catch (error) {
      console.error('Error processing query:', error);
      showToast({
        type: 'error',
        message: 'Failed to process your query. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAvailable = Boolean(config.openai.apiKey && ragAgent);

  return { submitQuery, isLoading, response, isAvailable };
}