import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full min-h-[50vh] ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
};

export default LoadingSpinner;
