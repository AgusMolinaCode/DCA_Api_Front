"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TransactionList } from './TransactionList';
import { TransactionEmpty } from './TransactionEmpty';

// Función para obtener una cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export default function DashboardContent() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    async function fetchTransactions() {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener el token de autenticación de las cookies
        const token = getCookie('auth_token');
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }

        // Verificar que la URL del backend esté definida
        const apiUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:8080';

        // Realizar la petición al servidor con cache: 'no-store' para evitar caché
        const response = await fetch(`${apiUrl}/transactions`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Error al obtener transacciones: ${response.status} ${response.statusText}`);
        }

        // Procesar la respuesta
        const data = await response.json();

        // Extraer las transacciones según la estructura de la respuesta
        let transactionData = [];
        if (data.data) {
          // Si la respuesta tiene un campo 'data'
          transactionData = data.data;
        } else if (Array.isArray(data)) {
          // Si la respuesta es directamente un array
          transactionData = data;
        } else {
          // Si la respuesta tiene otra estructura
          transactionData = data.transactions || [];
        }

        setTransactions(transactionData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, [isClient]);

  if (!isClient || isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-100 mr-2" />
        <span className="text-zinc-100 text-lg">Cargando transacciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <TransactionEmpty />;
  }

  return <TransactionList transactions={transactions} />;
}
