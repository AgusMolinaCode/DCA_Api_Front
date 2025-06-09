import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = 'Cargando...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-10 h-10 border-4 border-zinc-700 border-t-zinc-300 rounded-full animate-spin mb-2"></div>
      <p className="text-zinc-300 text-sm">{message}</p>
    </div>
  );
}

export function LoadingCard({ title, height = 'h-64' }: { title: string; height?: string }) {
  return (
    <div className={`w-full ${height} bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex flex-col items-center justify-center`}>
      <div className="w-8 h-8 border-4 border-zinc-700 border-t-zinc-300 rounded-full animate-spin mb-2"></div>
      <p className="text-zinc-300 text-sm">{title}</p>
    </div>
  );
}
