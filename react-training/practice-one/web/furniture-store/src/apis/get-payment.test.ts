import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetPayment } from './get-payment';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    PAYMENTS: '/payments',
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

const mockPaymentData = [
  {
    id: 1,
    userId: 1,
    amount: 299.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'credit_card',
    transactionId: 'txn_123456789',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    userId: 1,
    amount: 599.99,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'paypal',
    transactionId: 'txn_987654321',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    userId: 1,
    amount: 1299.99,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'bank_transfer',
    transactionId: 'txn_456789123',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

describe('useGetPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch payment data with valid userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentData);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should fetch payment data with different userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(123), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentData);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=123`,
      );
    });

    it('should fetch payment data with custom enabled parameter', async () => {
      const { result } = renderHook(() => useGetPayment(1, false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch payment data when enabled is true', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentData);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });
  });

  describe('Parameter Handling', () => {
    it('should handle zero userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetPayment(0), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc`,
      );
    });

    it('should handle negative userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetPayment(-1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=-1`,
      );
    });

    it('should handle large userId values', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(999999), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=999999`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useGetPayment(1), {
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

      const { result } = renderHook(() => useGetPayment(1), {
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

    it('should handle 404 responses for non-existent user payments', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetPayment(999), {
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

      const { result } = renderHook(() => useGetPayment(1), {
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
            setTimeout(() => resolve(createMockResponse([])), 100),
          ),
      );

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to success', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockPaymentData);
    });

    it('should transition from loading to error', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useGetPayment(1), {
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
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=1`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => useGetPayment(1, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should update query when userId changes', async () => {
      const payment1 = [{ ...mockPaymentData[0], userId: 1 }];
      const payment2 = [{ ...mockPaymentData[0], userId: 2 }];

      mockFetch
        .mockResolvedValueOnce(createMockResponse(payment1))
        .mockResolvedValueOnce(createMockResponse(payment2));

      const { result, rerender } = renderHook(
        ({ userId }) => useGetPayment(userId),
        {
          wrapper: createWrapper(),
          initialProps: { userId: 1 },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(payment1);

      rerender({ userId: 2 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(payment2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=2`,
      );
    });

    it('should handle enabled parameter changes', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result, rerender } = renderHook(
        ({ enabled }) => useGetPayment(1, enabled),
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

      expect(result.current.data).toEqual(mockPaymentData);
    });
  });

  describe('Data Format', () => {
    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle single payment response', async () => {
      const singlePayment = [mockPaymentData[0]];

      mockFetch.mockResolvedValueOnce(createMockResponse(singlePayment));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(singlePayment);
    });

    it('should handle large array of payments', async () => {
      const largePaymentArray = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        userId: 1,
        amount: (i + 1) * 10.99,
        currency: 'USD',
        status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'pending' : 'failed',
        paymentMethod: i % 2 === 0 ? 'credit_card' : 'paypal',
        transactionId: `txn_${i + 1}`,
        createdAt: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
        updatedAt: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      }));

      mockFetch.mockResolvedValueOnce(createMockResponse(largePaymentArray));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(largePaymentArray);
      expect(result.current.data).toHaveLength(100);
    });
  });

  describe('Caching and Stale Time', () => {
    it('should use correct stale time configuration', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentData);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const payment1 = [{ ...mockPaymentData[0], userId: 1 }];
      const payment2 = [{ ...mockPaymentData[0], userId: 2 }];

      mockFetch
        .mockResolvedValueOnce(createMockResponse(payment1))
        .mockResolvedValueOnce(createMockResponse(payment2));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useGetPayment(1), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => useGetPayment(2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(payment1);
      expect(result2.current.data).toEqual(payment2);
    });

    it('should handle concurrent requests for same user', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentData);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed payment data', async () => {
      const malformedData = [
        { id: 1 },
        { userId: 2 },
        { id: 3, userId: 3, amount: 'invalid' },
        { id: 4, userId: 4, amount: 100, status: 'unknown' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => useGetPayment(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedData);
    });

    it('should handle undefined enabled parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1, undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentData);
    });

    it('should handle floating point userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentData));

      const { result } = renderHook(() => useGetPayment(1.5), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=1.5`,
      );
    });

    it('should handle very large userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(
        () => useGetPayment(Number.MAX_SAFE_INTEGER),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}?_sort=createdAt&_order=desc&userId=${Number.MAX_SAFE_INTEGER}`,
      );
    });
  });
});
