import { useAuth } from '@clerk/nextjs';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dcaapi-production.up.railway.app';

// Custom hook for API calls with Clerk authentication using user ID as API key
export const useApiClient = () => {
  const { userId } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      console.log('🔑 Making API call with User ID:', userId);

      // Prepare headers using user ID as API key
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': userId,
        ...options.headers,
      };

      // Make the API call
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      console.log(`📡 API Response [${response.status}]:`, endpoint);

      // Handle different response status codes
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado - API key inválido');
        }
        if (response.status === 403) {
          throw new Error('Acceso denegado');
        }
        if (response.status >= 500) {
          throw new Error('Error del servidor');
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Return JSON response
      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ API call error:', error);
      throw error;
    }
  };

  return {
    // GET request
    get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
    
    // POST request
    post: (endpoint: string, data?: any) => 
      apiCall(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    
    // PUT request
    put: (endpoint: string, data?: any) => 
      apiCall(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    
    // DELETE request
    delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
  };
};

// For non-hook usage (like in server components)
export const createApiClient = (userId?: string) => {
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(userId && { 'X-API-Key': userId }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  return {
    get: (endpoint: string) => apiCall(endpoint, { method: 'GET' }),
    post: (endpoint: string, data?: any) => 
      apiCall(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: (endpoint: string, data?: any) => 
      apiCall(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: (endpoint: string) => apiCall(endpoint, { method: 'DELETE' }),
  };
};