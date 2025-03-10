import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddCryptoModal } from '@/components/dashboard/AddCryptoModal';
import { CryptoData } from '@/lib/types';
import '@testing-library/jest-dom/vitest';

// Mock de las acciones del servidor
vi.mock('@/lib/actions', () => ({
  createTransaction: vi.fn().mockImplementation((data, token) => {
    if (!token) {
      return Promise.resolve({ success: false, error: 'No token provided' });
    }
    return Promise.resolve({ success: true, data: { id: '123', ...data } });
  }),
}));

// Mock de los componentes de UI que pueden causar problemas en los tests
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/dashboard/FormCryptoAdd', () => ({
  __esModule: true,
  default: ({ onSubmit }: any) => (
    <div data-testid="form-crypto-add-mock">
      <input placeholder="BTC" data-testid="ticker-input" />
      <input placeholder="Bitcoin" data-testid="name-input" />
      <input type="number" placeholder="0.00" data-testid="amount-input" />
      <input type="number" placeholder="0.00" data-testid="price-input" />
      <button onClick={() => onSubmit({ 
        crypto_name: 'Test Coin', 
        ticker: 'TEST',
        amount: '1.5',
        purchase_price: '100',
        note: '',
        type: 'compra',
        image_url: '/images/cripto.png'
      })}>
        Guardar
      </button>
      <button>Buscar</button>
      <button>Agregar manualmente</button>
      <div>Modo manual activado</div>
      <div>Precio actual: $50000.00 USD</div>
    </div>
  )
}));

// Mock de fetch global
global.fetch = vi.fn();

// Mock para localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Importar la función createTransaction para poder espiarla
import { createTransaction } from '@/lib/actions';

describe('AddCryptoModal', () => {
  const mockOnAddCrypto = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.setItem('token', 'fake-token');
    
    // Mock de respuesta exitosa para fetch
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });
  
  it('renderiza correctamente el botón para abrir el modal', () => {
    render(<AddCryptoModal onAddCrypto={mockOnAddCrypto} />);
    
    expect(screen.getByText(/transacción/i)).toBeInTheDocument();
  });
  
  it('muestra el formulario cuando se hace clic en el botón', () => {
    render(<AddCryptoModal onAddCrypto={mockOnAddCrypto} />);
    
    const button = screen.getByText(/transacción/i);
    fireEvent.click(button);
    
    expect(screen.getByTestId('form-crypto-add-mock')).toBeInTheDocument();
  });
  
  it('llama a createTransaction cuando se envía el formulario', async () => {
    render(<AddCryptoModal onAddCrypto={mockOnAddCrypto} />);
    
    // Abrir el modal
    const button = screen.getByText(/transacción/i);
    fireEvent.click(button);
    
    // Enviar el formulario
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);
    
    // Verificar que se llamó a createTransaction con los datos correctos
    await waitFor(() => {
      expect(createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          crypto_name: 'Test Coin',
          ticker: 'TEST',
        }), 
        'fake-token'
      );
    });
    
    // Verificar que se llamó al callback
    await waitFor(() => {
      expect(mockOnAddCrypto).toHaveBeenCalledWith(expect.objectContaining({
        crypto_name: 'Test Coin',
        amount: expect.any(Number),
        purchase_price: expect.any(Number),
      }));
    });
  });
}); 