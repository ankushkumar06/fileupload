export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || null
  },
  unstructured: {
    apiKey: import.meta.env.VITE_UNSTRUCTURED_API_KEY || null
  }
} as const;

export function validateConfig() {
  // Only Supabase is required for basic functionality
  const required = [
    ['VITE_SUPABASE_URL', config.supabase.url],
    ['VITE_SUPABASE_ANON_KEY', config.supabase.anonKey]
  ] as const;

  const missing = required.filter(([, value]) => !value);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing
        .map(([name]) => name)
        .join(', ')}`
    );
  }
}

export const features = {
  rag: Boolean(config.openai.apiKey),
  documentProcessing: Boolean(config.unstructured.apiKey && config.openai.apiKey)
} as const;