"use client"

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('Usuario');

  useEffect(() => {
    // Obtener el nombre de usuario desde localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">¡Bienvenido, {userName}!</p>
      </div>
    </div>
  );
} 