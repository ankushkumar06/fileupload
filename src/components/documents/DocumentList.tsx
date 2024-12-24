import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useDocuments } from '../../hooks/useDocuments';
import { Document } from '../../types';

export function DocumentList() {
  const { documents, isLoading } = useDocuments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc: Document) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
        >
          <FileText className="h-8 w-8 text-indigo-600" />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{doc.title}</h3>
            <p className="text-sm text-gray-500">
              Status: {doc.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}