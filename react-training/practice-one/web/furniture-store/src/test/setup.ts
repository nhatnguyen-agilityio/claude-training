import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  interface JestMatchers<R> {
    toBeInTheDocument(): R;
    toHaveAttribute(attr: string, value?: string): R;
    toHaveValue(value: string | number): R;
  }
}

// Polyfill for TextEncoder/TextDecoder
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// Mock IntersectionObserver
Object.assign(global, {
  IntersectionObserver: class IntersectionObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  },
});

// Mock ResizeObserver
Object.assign(global, {
  ResizeObserver: class ResizeObserver {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  },
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
