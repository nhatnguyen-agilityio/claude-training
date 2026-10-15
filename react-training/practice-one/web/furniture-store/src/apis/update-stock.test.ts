import { createElement } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useUpdateStock } from './update-stock';
import type { StockUpdatePayloadInterface } from './update-stock';

// Mock env-variables
jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:5001/',
}));

// Mock fetch
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useUpdateStock', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should update stock successfully', async () => {
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const stockPayload: StockUpdatePayloadInterface = {
      items: [
        { variantId: 1, quantity: 2 },
        { variantId: 2, quantity: 1 },
      ],
    };

    const { result } = renderHook(() => useUpdateStock(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(stockPayload);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('products/update-stock/'),
      }),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stockPayload),
      },
    );
  });

  it('should handle update stock error', async () => {
    const errorResponse = { error: 'Insufficient stock' };
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(errorResponse),
    } as Response);

    const stockPayload: StockUpdatePayloadInterface = {
      items: [{ variantId: 1, quantity: 10 }],
    };

    const { result } = renderHook(() => useUpdateStock(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(stockPayload);

    await waitFor(() => {
      expect(result.current.error).toBe('Insufficient stock');
    });
  });

  it('should handle network error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.reject(new Error('Network error')),
    } as Response);

    const stockPayload: StockUpdatePayloadInterface = {
      items: [{ variantId: 1, quantity: 1 }],
    };

    const { result } = renderHook(() => useUpdateStock(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(stockPayload);

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to update stock');
    });
  });

  it('should handle empty items array', async () => {
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const stockPayload: StockUpdatePayloadInterface = {
      items: [],
    };

    const { result } = renderHook(() => useUpdateStock(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(stockPayload);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('products/update-stock/'),
      }),
      expect.objectContaining({
        body: JSON.stringify(stockPayload),
      }),
    );
  });

  it('should invalidate product queries on successful stock update', async () => {
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock invalidateQueries
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const customWrapper = ({ children }: { children: ReactNode }) => {
      return createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      );
    };

    const stockPayload: StockUpdatePayloadInterface = {
      items: [{ variantId: 1, quantity: 2 }],
    };

    const { result } = renderHook(() => useUpdateStock(), {
      wrapper: customWrapper,
    });

    result.current.mutate(stockPayload);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      predicate: expect.any(Function),
    });
  });
});
