import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { DocumentUpload } from './components/documents/DocumentUpload';
import { DocumentList } from './components/documents/DocumentList';
import { DocumentQuery } from './components/documents/DocumentQuery';
import { AuthForm } from './components/auth/AuthForm';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useAuth } from './contexts/AuthContext';
import { features } from './config/env';

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="space-y-8">
            <DocumentUpload />
            <div className={`grid grid-cols-1 ${features.rag ? 'lg:grid-cols-2' : ''} gap-8`}>
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Your Documents</h2>
                <DocumentList />
              </div>
              {features.rag && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Ask Questions</h2>
                  <DocumentQuery />
                </div>
              )}
            </div>
          </div>
        ) : (
          <AuthForm />
        )}
      </main>
      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;