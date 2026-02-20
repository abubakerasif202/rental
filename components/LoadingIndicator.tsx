import React from 'react';
import { useLoading } from '../context/LoadingContext';

const LoadingIndicator: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-emerald-100">
      <div className="h-full bg-emerald-500 animate-progress-indeterminate origin-left"></div>
    </div>
  );
};

export default LoadingIndicator;
