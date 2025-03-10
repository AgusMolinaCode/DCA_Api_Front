import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FormCryptoAdd from '@/components/dashboard/FormCryptoAdd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cryptoFormSchema, type CryptoFormValues } from '@/lib/validation';
import '@testing-library/jest-dom/vitest';

// Mock de los componentes de UI que pueden causar problemas en los tests
vi.mock('@/components/ui/calendar', () => ({
  Calendar: () => <div data-testid="mock-calendar">Calendar Mock</div>,
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Componente wrapper para poder usar useForm
const FormCryptoAddWrapper = (props: any) => {
  const form = useForm<CryptoFormValues>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      crypto_name: '',
      ticker: '',
      amount: '',
      purchase_price: '',
      note: '',
      type: 'compra',
      image_url: '',
    },
  });

  return <FormCryptoAdd form={form} {...props} />;
};

describe('FormCryptoAdd', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    selectedCrypto: null,
    manualMode: false,
    date: new Date('2023-01-01'),
    setDate: vi.fn(),
    total: 0,
    submitSuccess: false,
    submitError: null,
    isSubmitting: false,
    handleTickerChange: vi.fn(),
    handleTickerSearch: vi.fn(),
    isSearching: false,
    enableManualMode: vi.fn(),
    searchError: null,
    onReset: vi.fn(),
  };

  it('renderiza el campo de ticker', () => {
    render(<FormCryptoAddWrapper {...defaultProps} />);
    
    // Buscar por placeholder en lugar de label
    expect(screen.getByPlaceholderText('BTC')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando hay un error de búsqueda', () => {
    render(
      <FormCryptoAddWrapper
        {...defaultProps}
        searchError="No se encontró la criptomoneda"
      />
    );
    
    expect(screen.getByText('No se encontró la criptomoneda')).toBeInTheDocument();
  });

  it('muestra indicador de modo manual cuando está activado', () => {
    render(
      <FormCryptoAddWrapper
        {...defaultProps}
        manualMode={true}
      />
    );
    
    expect(screen.getByText(/Modo manual activado/i)).toBeInTheDocument();
  });

  it('llama a handleTickerChange cuando se cambia el ticker', () => {
    render(<FormCryptoAddWrapper {...defaultProps} />);
    
    const tickerInput = screen.getByPlaceholderText('BTC');
    fireEvent.change(tickerInput, { target: { value: 'BTC' } });
    
    expect(defaultProps.handleTickerChange).toHaveBeenCalledWith('BTC');
  });

  it('llama a onReset cuando se hace clic en el botón Limpiar', () => {
    render(<FormCryptoAddWrapper {...defaultProps} />);
    
    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    fireEvent.click(resetButton);
    
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('muestra mensaje de éxito cuando submitSuccess es true', () => {
    render(
      <FormCryptoAddWrapper
        {...defaultProps}
        submitSuccess={true}
      />
    );
    
    expect(screen.getByText(/transacción guardada exitosamente/i)).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando hay un error de envío', () => {
    render(
      <FormCryptoAddWrapper
        {...defaultProps}
        submitError="Error al guardar la transacción"
      />
    );
    
    expect(screen.getByText(/error al guardar la transacción/i)).toBeInTheDocument();
  });

  it('deshabilita los botones cuando isSubmitting es true', () => {
    render(
      <FormCryptoAddWrapper
        {...defaultProps}
        isSubmitting={true}
      />
    );
    
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    
    expect(submitButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('muestra el precio cuando hay una criptomoneda seleccionada', () => {
    render(
      <FormCryptoAddWrapper
        {...defaultProps}
        selectedCrypto={{
          name: 'Bitcoin',
          ticker: 'BTC',
          price: 50000,
          imageUrl: 'https://example.com/btc.png',
        }}
      />
    );
    
    // Usar una expresión regular para buscar el texto parcial
    expect(screen.getByText(/precio actual/i)).toBeInTheDocument();
    expect(screen.getByText(/\$50000\.00/)).toBeInTheDocument();
  });
}); 