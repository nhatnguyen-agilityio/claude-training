import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteCart } from './delete-cart';

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

const mockDeletePayload = {
  userId: '1',
};

describe('useDeleteCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockQueryKey.mockClear();
  });

  describe('Successful Mutations', () => {
    it('should successfully delete cart with valid userId', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call DELETE endpoint with correct URL', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/1',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle async mutation with mutateAsync', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockDeletePayload);

      expect(response).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle deletion with numeric userId', async () => {
      const numericUserIdPayload = {
        userId: '123',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(numericUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/123',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle deletion with string userId containing special characters', async () => {
      const specialUserIdPayload = {
        userId: 'user-123_test',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/user-123_test',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle deletion with empty string userId', async () => {
      const emptyUserIdPayload = {
        userId: '',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(emptyUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/carts/users/');
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
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

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

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

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
    });

    it('should handle 404 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

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

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Query Invalidation', () => {
    it('should invalidate user cart query on successful deletion', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockDeletePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(1);
    });

    it('should invalidate correct query key for different users', async () => {
      mockFetch.mockResolvedValue(createMockResponse(true));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = { userId: '1' };
      const payload2 = { userId: '2' };

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

    it('should handle userId conversion from string to number', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const stringUserIdPayload = { userId: '123' };

      result.current.mutate(stringUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(123);
    });

    it('should handle non-numeric userId conversion', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const nonNumericUserIdPayload = { userId: 'abc' };

      result.current.mutate(nonNumericUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(NaN);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
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

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = { userId: '1' };
      const payload2 = { userId: '2' };

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

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockDeletePayload);

      expect(response).toBe(true);
    });

    it('should handle false boolean response', async () => {
      const mockResponse = false;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockDeletePayload);

      expect(response).toBe(false);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockDeletePayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('success'));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockDeletePayload);

      expect(response).toBe('success');
    });

    it('should handle object response', async () => {
      const objectResponse = {
        success: true,
        message: 'Cart deleted successfully',
        deletedItems: 3,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockDeletePayload);

      expect(response).toEqual(objectResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockResponse = true;

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useDeleteCart(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useDeleteCart(), {
        wrapper,
      });

      const payload1 = { userId: '1' };
      const payload2 = { userId: '2' };

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

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      const payload1 = { userId: '1' };
      const payload2 = { userId: '2' };

      result.current.mutate(payload1);
      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle userId with spaces', async () => {
      const spaceUserIdPayload = {
        userId: ' 123 ',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(spaceUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/%20123',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle userId with very long string', async () => {
      const longUserIdPayload = {
        userId: 'a'.repeat(1000),
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(longUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        `http://localhost:3001/carts/users/${'a'.repeat(1000)}`,
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle userId with special URL characters', async () => {
      const specialUserIdPayload = {
        userId: 'user@domain.com',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/user@domain.com',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle malformed payload structure', async () => {
      const malformedPayload = {
        userId: null,
      } as unknown as { userId: string };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/null',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
    });

    it('should handle numeric userId as string', async () => {
      const numericStringPayload = {
        userId: '0',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(numericStringPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/0',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(mockQueryKey).toHaveBeenCalledWith(0);
    });

    it('should handle negative numeric userId as string', async () => {
      const negativeUserIdPayload = {
        userId: '-1',
      };

      const mockResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useDeleteCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativeUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/carts/users/-1',
      );
      expect(callArgs[1]?.method).toBe('DELETE');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(mockQueryKey).toHaveBeenCalledWith(-1);
    });
  });
});
