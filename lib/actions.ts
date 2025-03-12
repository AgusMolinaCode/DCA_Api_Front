"use server";

import { CryptoData } from "./types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Guarda el token de autenticación en una cookie
 * @param token Token de autenticación
 */
export async function saveAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

/**
 * Elimina el token de autenticación de las cookies
 */
export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

/**
 * Obtiene el token de autenticación de las cookies
 * @returns Token de autenticación o null si no existe
 */
export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  return token || null;
}

/**
 * Crea una nueva transacción de criptomoneda
 * @param data Datos de la transacción
 * @returns Resultado de la operación
 */
export async function createTransaction(data: CryptoData) {
  try {
    
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente." 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al guardar la transacción: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Revalidar la ruta del dashboard para actualizar los datos
    revalidatePath('/dashboard');
    
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al crear la transacción" 
    };
  }
}

/**
 * Obtiene todas las transacciones del usuario
 * @returns Lista de transacciones
 */
export async function getTransactions() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: [] 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener las transacciones: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Asegurarse de que data sea un array
    let transactions = [];
    
    if (responseData && typeof responseData === 'object') {
      if (Array.isArray(responseData)) {
        transactions = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        transactions = responseData.data;
      } else if (responseData.transactions && Array.isArray(responseData.transactions)) {
        transactions = responseData.transactions;
      } else {
        // Intentar convertir el objeto a un array si es posible
        const possibleArray = Object.values(responseData).find(val => Array.isArray(val));
        if (possibleArray) {
          transactions = possibleArray;
        } else {
          console.warn("No se pudo encontrar un array en la respuesta:", responseData);
        }
      }
    }
    
    return { success: true, data: transactions };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener las transacciones",
      data: [] 
    };
  }
}

/**
 * Elimina una transacción
 * @param id ID de la transacción
 * @returns Resultado de la operación
 */
export async function deleteTransaction(id: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente." 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar la transacción: ${response.status} ${response.statusText}`);
    }
    
    // Revalidar la ruta del dashboard para actualizar los datos
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al eliminar la transacción" 
    };
  }
}
