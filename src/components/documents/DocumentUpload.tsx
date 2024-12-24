import React, { useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useDocumentUpload } from '../../hooks/useDocumentUpload';
import { features } from '../../config/env';

export function DocumentUpload() {
  const { uploadDocument, isUploading } = useDocumentUpload();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadDocument(file);
    }
  }, [uploadDocument]);

  return (
    <div className="space-y-4">
      {!features.documentProcessing && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <p>Document processing is limited. AI features are not available.</p>
          </div>
        </div>
      )}
      
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, PPT, CSV, DOC, DOCX</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.ppt,.pptx,.csv,.doc,.docx"
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}