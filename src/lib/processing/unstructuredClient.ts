import { UnstructuredClient as Client } from 'unstructured-client';

export class UnstructuredClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      apiKey: import.meta.env.VITE_UNSTRUCTURED_API_KEY
    });
  }

  async parseDocument(fileUrl: string) {
    try {
      const response = await this.client.general.partition({ files: [fileUrl] });
      return response.elements.map(element => element.text).join('\n');
    } catch (error) {
      console.error('Error parsing document:', error);
      throw error;
    }
  }
}