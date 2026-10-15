import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetUserCart } from './user-cart';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    CARTS: '/carts',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const createMockResponse = (data: unknown, ok = true) =>
  ({
    ok,
    json: async () => data,
    status: ok ? 200 : 500,
    statusText: ok ? 'OK' : 'Internal Server Error',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
    bytes: jest.fn(),
  }) as Response;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

const mockCartData = [
  {
    id: 1,
    userId: 1,
    productId: 101,
    quantity: 2,
    product: {
      id: 101,
      name: 'Modern Sofa',
      price: 599.99,
      image: 'sofa.jpg',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    productId: 102,
    quantity: 1,
    product: {
      id: 102,
      name: 'Coffee Table',
      price: 299.99,
      image: 'table.jpg',
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

describe('useGetUserCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch user cart with valid userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should fetch user cart with default sorting parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should fetch user cart with custom enabled parameter', async () => {
      const { result } = renderHook(() => useGetUserCart(1, false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch user cart when enabled is true', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should fetch user cart with zero userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetUserCart(0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc`,
      );
    });

    it('should fetch user cart with negative userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetUserCart(-1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=-1`,
      );
    });

    it('should fetch user cart with large userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(
        () => useGetUserCart(Number.MAX_SAFE_INTEGER),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=${Number.MAX_SAFE_INTEGER}`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(networkError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        new Error('Network response was not ok'),
      );
      expect(result.current.data).toBeUndefined();
    });

    it('should handle 404 responses for non-existent user cart', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetUserCart(999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        new Error('Network response was not ok'),
      );
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(new Error('Invalid JSON'));
    });
  });

  describe('Loading States', () => {
    it('should show loading state initially', () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(createMockResponse(mockCartData)), 100),
          ),
      );

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to success', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockCartData);
    });

    it('should transition from loading to error', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toEqual(error);
    });
  });

  describe('Query Configuration', () => {
    it('should use correct query key', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => useGetUserCart(1, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should update query when userId changes', async () => {
      const cart1 = [{ ...mockCartData[0], userId: 1 }];
      const cart2 = [{ ...mockCartData[0], userId: 2 }];

      mockFetch
        .mockResolvedValueOnce(createMockResponse(cart1))
        .mockResolvedValueOnce(createMockResponse(cart2));

      const { result, rerender } = renderHook(
        ({ userId }) => useGetUserCart(userId),
        {
          wrapper: createWrapper(),
          initialProps: { userId: 1 },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(cart1);

      rerender({ userId: 2 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(cart2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=2`,
      );
    });

    it('should handle enabled parameter changes', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result, rerender } = renderHook(
        ({ enabled }) => useGetUserCart(1, enabled),
        {
          wrapper: createWrapper(),
          initialProps: { enabled: false },
        },
      );

      expect(result.current.fetchStatus).toBe('idle');

      rerender({ enabled: true });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
    });
  });

  describe('Data Format', () => {
    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });

    it('should handle single cart item', async () => {
      const singleCartItem = [mockCartData[0]];

      mockFetch.mockResolvedValueOnce(createMockResponse(singleCartItem));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(singleCartItem);
    });

    it('should handle complex cart data with nested product objects', async () => {
      const complexCartData = [
        {
          id: 1,
          userId: 1,
          productId: 101,
          quantity: 2,
          product: {
            id: 101,
            name: 'Modern Sofa',
            price: 599.99,
            image: 'sofa.jpg',
            category: 'Furniture',
            description: 'A comfortable modern sofa',
            specifications: {
              dimensions: '200x80x90 cm',
              material: 'Fabric',
              color: 'Gray',
            },
            reviews: [
              { id: 1, rating: 5, comment: 'Great sofa!' },
              { id: 2, rating: 4, comment: 'Very comfortable' },
            ],
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(complexCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(complexCartData);
    });

    it('should handle cart data with missing product information', async () => {
      const cartWithMinimalProduct = [
        {
          id: 1,
          userId: 1,
          productId: 101,
          quantity: 1,
          product: {
            id: 101,
            name: 'Unknown Product',
          },
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce(
        createMockResponse(cartWithMinimalProduct),
      );

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(cartWithMinimalProduct);
    });
  });

  describe('URL Parameter Construction', () => {
    it('should construct URL with all default parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should handle URL encoding properly', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      const expectedUrl = `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=1`;
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    });

    it('should always include userId parameter when userId is provided', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('userId=1'),
      );
    });
  });

  describe('Caching and Stale Time', () => {
    it('should use correct stale time configuration', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances for different users', async () => {
      const cart1 = [{ ...mockCartData[0], userId: 1 }];
      const cart2 = [{ ...mockCartData[0], userId: 2 }];

      mockFetch
        .mockResolvedValueOnce(createMockResponse(cart1))
        .mockResolvedValueOnce(createMockResponse(cart2));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useGetUserCart(1), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => useGetUserCart(2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(cart1);
      expect(result2.current.data).toEqual(cart2);
    });

    it('should handle concurrent requests for same user', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed cart data', async () => {
      const malformedData = [
        {
          id: 'invalid',
          userId: 'not-a-number',
          quantity: 'invalid',
          product: null,
          createdAt: null,
        },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedData);
    });

    it('should handle undefined enabled parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCartData));

      const { result } = renderHook(() => useGetUserCart(1, undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCartData);
    });

    it('should handle very large userId values', async () => {
      const largeUserId = Number.MAX_SAFE_INTEGER;
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetUserCart(largeUserId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.CARTS}?_sort=createdAt&_order=desc&userId=${largeUserId}`,
      );
    });

    it('should handle cart data with duplicate items', async () => {
      const duplicateCartData = [mockCartData[0], mockCartData[0]];

      mockFetch.mockResolvedValueOnce(createMockResponse(duplicateCartData));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(duplicateCartData);
    });

    it('should handle cart data with zero quantity', async () => {
      const zeroQuantityCart = [
        {
          ...mockCartData[0],
          quantity: 0,
        },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(zeroQuantityCart));

      const { result } = renderHook(() => useGetUserCart(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(zeroQuantityCart);
    });
  });
});
