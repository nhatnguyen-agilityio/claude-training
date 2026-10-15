import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddCart } from './add-cart';
import type { CartInterface } from '../interfaces/cart';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    CARTS: '/carts',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

jest.mock('../constants/query-keys', () => ({
  QUERY_KEY: {
    USER_CART: jest.fn((userId: number) => ['user-cart', userId]),
  },
}));

import { QUERY_KEY } from '../constants/query-keys';

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockQueryKey = QUERY_KEY.USER_CART as jest.MockedFunction<
  typeof QUERY_KEY.USER_CART
>;

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
      mutations: {
        retry: false,
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

const mockCartPayload = {
  userId: 1,
  item: {
    productId: 101,
    variantId: 1,
    quantity: 2,
  },
};

describe('useAddCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockQueryKey.mockClear();
  });

  describe('Successful Mutations', () => {
    it('should successfully add cart item with valid payload', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should add createdAt timestamp to payload', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body).toHaveProperty('createdAt');
      expect(body.createdAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should handle async mutation with mutateAsync', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockCartPayload);

      expect(response).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle cart item with minimal required fields', async () => {
      const minimalPayload = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 1,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(minimalPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle cart with single item', async () => {
      const singleItemPayload = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(singleItemPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.item).toMatchObject({
        productId: 101,
        variantId: 1,
        quantity: 2,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Product out of stock',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Product out of stock');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid JSON');
    });
  });

  describe('Loading States', () => {
    it('should reset loading state after mutation completion', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Query Invalidation', () => {
    it('should invalidate user cart query on successful mutation', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockCartPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(mockCartPayload.userId);
    });

    it('should invalidate correct query key for different users', async () => {
      mockFetch.mockResolvedValue(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      const payload2 = {
        userId: 2,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      result.current.mutate(payload1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(1);

      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(2);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      mockFetch
        .mockResolvedValueOnce(createMockResponse(true))
        .mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      const payload2 = {
        userId: 1,
        item: {
          productId: 102,
          variantId: 1,
          quantity: 2,
        },
      };

      result.current.mutate(payload1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Format', () => {
    it('should handle boolean response', async () => {
      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(true));
      const response = await result.current.mutateAsync(mockCartPayload);

      expect(response).toBe(true);
      expect(typeof response).toBe('boolean');
    });

    it('should handle object response', async () => {
      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      const objectResponse = { success: true, id: 123 };
      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));
      const response = await result.current.mutateAsync(mockCartPayload);

      expect(response).toEqual(objectResponse);
    });

    it('should handle null response', async () => {
      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(null));
      const response = await result.current.mutateAsync(mockCartPayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      mockFetch.mockResolvedValueOnce(createMockResponse('success'));
      const response = await result.current.mutateAsync(mockCartPayload);

      expect(response).toBe('success');
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      mockFetch.mockResolvedValue(createMockResponse(true));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useAddCart(), { wrapper });
      const { result: result2 } = renderHook(() => useAddCart(), { wrapper });

      const payload1 = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      const payload2 = {
        userId: 2,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      result1.current.mutate(payload1);
      result2.current.mutate(payload2);

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent mutations', async () => {
      mockFetch.mockResolvedValue(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      const payload2 = {
        userId: 1,
        item: {
          productId: 102,
          variantId: 1,
          quantity: 2,
        },
      };

      result.current.mutate(payload1);
      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle cart payload with zero quantity', async () => {
      const zeroQuantityPayload = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 0,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroQuantityPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.item.quantity).toBe(0);
    });

    it('should handle cart payload with large quantity', async () => {
      const largeQuantityPayload = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 9999,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(largeQuantityPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.item.quantity).toBe(9999);
    });

    it('should handle cart payload with zero userId', async () => {
      const zeroUserIdPayload = {
        userId: 0,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(0);
    });

    it('should handle cart payload with negative userId', async () => {
      const negativeUserIdPayload = {
        userId: -1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 2,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativeUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(-1);
    });

    it('should handle malformed cart payload', async () => {
      const malformedPayload = {
        userId: 'invalid',
        item: {
          productId: null,
          variantId: 'invalid',
          quantity: 'not-a-number',
        },
      } as unknown;

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload as unknown as CartInterface);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.userId).toBe('invalid');
    });

    it('should handle cart with single item', async () => {
      const singleItemPayload = {
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 1,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(true));

      const { result } = renderHook(() => useAddCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(singleItemPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.item).toMatchObject({
        productId: 101,
        variantId: 1,
        quantity: 1,
      });
    });
  });
});
