import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Extender los tipos para incluir los matchers de jest-dom
declare global {
  namespace Vi {
    interface Assertion {
      toBeDisabled(): void;
      toBeEnabled(): void;
      toBeInTheDocument(): void;
      toHaveAttribute(attr: string, value?: string): void;
      toHaveClass(...classNames: string[]): void;
      toHaveValue(value: string | string[] | number): void;
      toBeChecked(): void;
      toBeVisible(): void;
    }
  }
}

// Mock de ResizeObserver que no está disponible en jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de IntersectionObserver que no está disponible en jsdom
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock de window.matchMedia que no está disponible en jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suprimir errores de consola durante las pruebas
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
      args[0].includes('Warning: React.createFactory()') ||
      args[0].includes('Warning: The current testing environment is not configured to support act'))
  ) {
    return;
  }
  originalConsoleError(...args);
}; 