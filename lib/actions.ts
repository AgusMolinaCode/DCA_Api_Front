"use server";

import { CryptoData } from "./types";
import { CreateBolsaData, CreateBolsaResponse } from "./interface";
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
 * Obtiene todas las transacciones del usuario agrupados por criptomoneda
 * @returns Lista de transacciones agrupadas
 */
export async function getTrasactionsDashboard() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: [] 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener las transacciones: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener las transacciones",
      data: [] 
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

/**
 * Edita una transacción
 * @param id ID de la transacción
 * @param data Datos de la transacción
 * @returns Resultado de la operación
 */
export async function editTransaction(id: string, data: CryptoData) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente." 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error al editar la transacción: ${response.status} ${response.statusText}`);
    }
    
    // Revalidar la ruta del dashboard para actualizar los datos
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al editar la transacción" 
    };
  }
}

/**
 * Eliminamos todas las transacciones de un Ticker en especifico
 * @param ticker Ticker de la criptomoneda
 * @returns Resultado de la operación
 */
export async function deleteTransactionsByTicker(ticker: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente." 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/transactions/ticker/${ticker}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar las transacciones: ${response.status} ${response.statusText}`);
    }
    
    // Revalidar la ruta del dashboard para actualizar los datos
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al eliminar las transacciones" 
    };
  }
}

/**
 * Obtiene los datos de distribución de holdings para el gráfico
 * @returns Datos de holdings para visualización en gráficos
 */
export async function getHoldingsChart() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: null 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/holdings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener los datos de holdings: ${response.status} ${response.statusText}`);
    }
    
    const chartData = await response.json();
    
    return { success: true, data: chartData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener los datos de holdings",
      data: null 
    };
  }
}

/**
 * Obtiene los datos del balance principal del usuario
 * @returns Datos del balance principal
 */
export async function getCurrentBalance() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: null 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/current-balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el balance principal: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener el balance principal",
      data: null 
    };
  }
}

/**
 * Obtiene los datos de rendimiento (mejor y peor criptomoneda)
 * @returns Datos de rendimiento
 */
export async function getPerformance() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: null 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/performance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener los datos de rendimiento: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener los datos de rendimiento",
      data: null 
    };
  }
}

/**
 * Obtiene el historial de inversiones para mostrar en gráficos
 * @param params Parámetros opcionales para filtrar los datos (show_all, show_7d, show_30d, show_today)
 * @returns Datos del historial de inversiones
 */
export async function getInvestmentHistory(params?: { show_all?: boolean, show_7d?: boolean, show_30d?: boolean, show_today?: boolean }) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: null 
      };
    }
    
    // Construir la URL con los parámetros de consulta si existen
    let url = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/investment-history`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.show_all) queryParams.append('show_all', 'true');
      if (params.show_7d) queryParams.append('show_7d', 'true');
      if (params.show_30d) queryParams.append('show_30d', 'true');
      if (params.show_today) queryParams.append('show_today', 'true');
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el historial de inversiones: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener el historial de inversiones",
      data: null 
    };
  }
}

/**
 * Obtiene las bolsas de inversión del usuario
 * @returns Datos de las bolsas de inversión
 */
export async function getBolsas() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: null 
      };
    }

    const url = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/bolsas`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: "Error al obtener las bolsas de inversión",
        data: null 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      error: null,
      data: data.bolsas || [] 
    };
  } catch (error) {
    console.error("Error al obtener las bolsas de inversión:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener las bolsas de inversión",
      data: [] 
    };
  }
}

/**
 * Obtiene los detalles de una bolsa de inversión específica
 * @param id ID de la bolsa de inversión
 * @returns Detalles de la bolsa de inversión
 */
export async function getBolsaDetails(id: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        data: null 
      };
    }

    const url = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/bolsas/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: "Error al obtener los detalles de la bolsa de inversión",
        data: null 
      };
    }

    const data = await response.json();
    return { 
      success: true, 
      error: null,
      data: data.bolsa || null 
    };
  } catch (error) {
    console.error("Error al obtener los detalles de la bolsa de inversión:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al obtener los detalles de la bolsa de inversión",
      data: null 
    };
  }
}

/**
 * Crea una nueva bolsa de inversión
 * @param data Datos de la bolsa de inversión
 * @returns Resultado de la operación
 */
export async function createBolsa(data: CreateBolsaData): Promise<CreateBolsaResponse> {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente."
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/bolsas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Error al crear la bolsa de inversión'
      };
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath('/dashboard/bolsas');

    return {
      success: true,
      message: 'Bolsa de inversión creada correctamente',
      bolsa: result.bolsa
    };
  } catch (error) {
    console.error('Error al crear la bolsa de inversión:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al crear la bolsa de inversión'
    };
  }
}

/**
 * Agrega un activo a una bolsa de inversión específica
 * @param bolsaId ID de la bolsa de inversión
 * @param assets Array de activos a agregar
 * @returns Resultado de la operación
 */
export async function addAssetToBolsa(bolsaId: string, assets: Array<{
  crypto_name: string;
  ticker: string;
  amount: number;
  purchase_price: number;
  image_url?: string;
}>) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente." 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/bolsas/${bolsaId}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ assets }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al agregar activo a la bolsa: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Revalidar la ruta para actualizar los datos
    revalidatePath('/dashboard/bolsas');
    
    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al agregar activo a la bolsa" 
    };
  }
}

/**
 * Elimina un activo de una bolsa de inversión específica
 * @param bolsaId ID de la bolsa de inversión
 * @param assetId ID del activo a eliminar
 * @returns Resultado de la operación
 */
export async function deleteAssetFromBolsa(bolsaId: string, assetId: string) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { 
        success: false, 
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente." 
      };
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/bolsas/${bolsaId}/assets/${assetId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar activo de la bolsa: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    // Revalidar la ruta para actualizar los datos
    revalidatePath('/dashboard/bolsas');
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al eliminar activo de la bolsa" 
    };
  }
}

/**
 * Edita una bolsa de inversión existente
 * @param bolsaId ID de la bolsa de inversión a editar
 * @param data Datos actualizados de la bolsa
 * @returns Resultado de la operación
 */
export async function updateBolsa(bolsaId: string, data: {
  name?: string;
  description?: string;
  goal?: number;
}) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return {
        success: false,
        error: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente."
      };
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8080'}/bolsas/${bolsaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar la bolsa: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Revalidar la ruta para actualizar los datos
    revalidatePath('/dashboard/bolsas');
    
    return { 
      success: true, 
      message: 'Bolsa actualizada correctamente',
      bolsa: result.bolsa
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al actualizar la bolsa" 
    };
  }
}