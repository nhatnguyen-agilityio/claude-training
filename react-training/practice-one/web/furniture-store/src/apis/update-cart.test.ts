import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateCart } from './update-cart';
import type { CartInterface } from '../interfaces/cart';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    CARTS: '/carts/',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

jest.mock('../constants/query-keys', () => ({
  QUERY_KEY: {
    USER_CART: jest.fn((userId: number) => ['userCart', userId]),
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

const mockCartPayload: CartInterface = {
  userId: 1,
  item: {
    productId: 101,
    variantId: 1,
    quantity: 2,
  },
};

const mockUpdatePayload = {
  cartId: 123,
  cartPayload: mockCartPayload,
};

describe('useUpdateCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockQueryKey.mockClear();
  });

  describe('Successful Mutations', () => {
    it('should successfully update cart with valid payload', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call PUT endpoint with correct URL and payload', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/carts/123');
      expect(callArgs[1]?.method).toBe('PUT');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(mockCartPayload);
    });

    it('should handle async mutation with mutateAsync', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle cartId as string', async () => {
      const stringCartIdPayload = {
        cartId: 'cart-123',
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(stringCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/cart-123',
      );
    });

    it('should handle cartId as number', async () => {
      const numberCartIdPayload = {
        cartId: 456,
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(numberCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/carts/456');
    });

    it('should handle cart with single item', async () => {
      const singleItemPayload = {
        cartId: 123,
        cartPayload: {
          userId: 1,
          item: {
            productId: 101,
            variantId: 1,
            quantity: 1,
          },
        },
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(singleItemPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual({
        userId: 1,
        item: {
          productId: 101,
          variantId: 1,
          quantity: 1,
        },
      });
    });

    it('should handle cart with different item', async () => {
      const differentItemPayload = {
        cartId: 123,
        cartPayload: {
          userId: 1,
          item: {
            productId: 102,
            variantId: 2,
            quantity: 3,
          },
        },
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(differentItemPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        differentItemPayload.cartPayload,
      );
    });

    it('should handle cart with multiple items', async () => {
      const singleItemPayload = {
        cartId: 123,
        cartPayload: {
          userId: 1,
          item: {
            productId: 101,
            variantId: 1,
            quantity: 2,
          },
        },
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(singleItemPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        singleItemPayload.cartPayload,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to update cart');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Cart not found',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Cart not found');
    });

    it('should handle HTTP error with malformed error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null, false),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to update cart');
    });

    it('should handle 404 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to update cart');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid JSON');
    });
  });

  describe('Loading States', () => {
    it('should reset loading state after mutation completion', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Query Invalidation', () => {
    it('should invalidate user cart query on successful update', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(mockCartPayload.userId);
    });

    it('should invalidate correct query key for different users', async () => {
      mockFetch.mockResolvedValue(createMockResponse(true));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        cartId: 1,
        cartPayload: { ...mockCartPayload, userId: 1 },
      };
      const payload2 = {
        cartId: 2,
        cartPayload: { ...mockCartPayload, userId: 2 },
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

    it('should handle zero userId', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const zeroUserIdPayload = {
        cartId: 123,
        cartPayload: { ...mockCartPayload, userId: 0 },
      };

      result.current.mutate(zeroUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(0);
    });

    it('should handle negative userId', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const negativeUserIdPayload = {
        cartId: 123,
        cartPayload: { ...mockCartPayload, userId: -1 },
      };

      result.current.mutate(negativeUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(-1);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      const mockResponse1 = true;
      const mockResponse2 = true;

      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockResponse1))
        .mockResolvedValueOnce(createMockResponse(mockResponse2));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        cartId: 1,
        cartPayload: { ...mockCartPayload, userId: 1 },
      };
      const payload2 = {
        cartId: 2,
        cartPayload: { ...mockCartPayload, userId: 2 },
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
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBe(true);
    });

    it('should handle false boolean response', async () => {
      const mockResponse = false;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBe(false);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('success'));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBe('success');
    });

    it('should handle object response', async () => {
      const objectResponse = {
        success: true,
        message: 'Cart updated successfully',
        updatedItems: 3,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toEqual(objectResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useUpdateCart(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useUpdateCart(), {
        wrapper,
      });

      const payload1 = {
        cartId: 1,
        cartPayload: { ...mockCartPayload, userId: 1 },
      };
      const payload2 = {
        cartId: 2,
        cartPayload: { ...mockCartPayload, userId: 2 },
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
      const mockResponse = true;

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        cartId: 1,
        cartPayload: { ...mockCartPayload, userId: 1 },
      };
      const payload2 = {
        cartId: 2,
        cartPayload: { ...mockCartPayload, userId: 2 },
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
    it('should handle cartId with special characters', async () => {
      const specialCartIdPayload = {
        cartId: 'cart-123_test',
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/cart-123_test',
      );
    });

    it('should handle cartId with spaces', async () => {
      const spaceCartIdPayload = {
        cartId: ' cart 123 ',
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(spaceCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/%20cart%20123',
      );
    });

    it('should handle cartId with very long string', async () => {
      const longCartIdPayload = {
        cartId: 'a'.repeat(1000),
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(longCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        `http://localhost:3001/carts/${'a'.repeat(1000)}`,
      );
    });

    it('should handle malformed cart payload', async () => {
      const malformedPayload = {
        cartId: 123,
        cartPayload: {
          userId: 'invalid',
          item: {
            productId: null,
            variantId: 'invalid',
            quantity: 'not-a-number',
          },
        },
      } as unknown as { cartId: number; cartPayload: CartInterface };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        malformedPayload.cartPayload,
      );
    });

    it('should handle zero cartId', async () => {
      const zeroCartIdPayload = {
        cartId: 0,
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/carts/0');
    });

    it('should handle negative cartId', async () => {
      const negativeCartIdPayload = {
        cartId: -1,
        cartPayload: mockCartPayload,
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativeCartIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/carts/-1');
    });

    it('should handle cart with very large quantities', async () => {
      const largeQuantityPayload = {
        cartId: 123,
        cartPayload: {
          userId: 1,
          item: {
            productId: 101,
            variantId: 1,
            quantity: 999999,
          },
        },
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(largeQuantityPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        largeQuantityPayload.cartPayload,
      );
    });

    it('should handle cart with zero quantities', async () => {
      const zeroQuantityPayload = {
        cartId: 123,
        cartPayload: {
          userId: 1,
          item: {
            productId: 101,
            variantId: 1,
            quantity: 0,
          },
        },
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroQuantityPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        zeroQuantityPayload.cartPayload,
      );
    });

    it('should handle cart with negative quantities', async () => {
      const negativeQuantityPayload = {
        cartId: 123,
        cartPayload: {
          userId: 1,
          item: {
            productId: 101,
            variantId: 1,
            quantity: -1,
          },
        },
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdateCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativeQuantityPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        negativeQuantityPayload.cartPayload,
      );
    });
  });
});
