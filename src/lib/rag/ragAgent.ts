import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { supabase } from '../supabase';
import { config } from '../../config/env';

export class RAGAgent {
  private model: OpenAI;
  private promptTemplate: PromptTemplate;

  constructor() {
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.model = new OpenAI({
      openAIApiKey: config.openai.apiKey,
      modelName: 'gpt-4-turbo-preview'
    });

    this.promptTemplate = PromptTemplate.fromTemplate(`
      Answer the following question based on the provided context. If you cannot
      answer the question based on the context, say "I cannot answer this question
      based on the available information."

      Context: {context}
      
      Question: {question}
    `);
  }

  async query(question: string): Promise<string> {
    try {
      const embedding = await this.model.embeddings.embedQuery(question);
      
      const { data: chunks } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.7,
        match_count: 5
      });

      if (!chunks || chunks.length === 0) {
        return "I cannot find any relevant information to answer your question.";
      }

      const context = chunks.map(chunk => chunk.content).join('\n\n');
      
      const prompt = await this.promptTemplate.format({
        context,
        question
      });

      const response = await this.model.invoke(prompt);
      return response;
    } catch (error) {
      console.error('RAG query error:', error);
      throw new Error('Failed to process your query');
    }
  }
}