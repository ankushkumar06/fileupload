import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

const toastStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};

const ToastIcon = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};

export function Toast({ type, message }: ToastProps) {
  const Icon = ToastIcon[type];
  
  return (
    <div className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg border ${toastStyles[type]} shadow-lg`}>
      <Icon className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  );
}