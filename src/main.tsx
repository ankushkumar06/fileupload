import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { validateConfig } from './config/env';
import App from './App';
import './index.css';

// Validate environment variables before mounting the app
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: #991B1B; background: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 6px; font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">Configuration Error</h1>
        <p style="margin: 0;">${error instanceof Error ? error.message : 'Invalid configuration'}</p>
      </div>
    `;
  }
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);