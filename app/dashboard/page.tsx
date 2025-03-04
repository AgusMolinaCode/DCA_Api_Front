"use client"

import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || 'Usuario';

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">¡Bienvenido, {userName}!</p>
      </div>
    </div>
  );
} 