'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({ 
  title = 'Erreur de chargement', 
  message, 
  onRetry,
  retryLabel = 'Réessayer'
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-2xl p-8 lg:p-12 text-center"
    >
      <div className="flex justify-center mb-4">
        <AlertCircle className="text-red-500" size={48} />
      </div>
      <h3 className="text-xl font-medium text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
          <RefreshCw className="mr-2" size={18} />
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}

