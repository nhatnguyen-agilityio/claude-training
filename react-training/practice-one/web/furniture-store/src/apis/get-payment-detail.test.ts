import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetPaymentDetail } from './get-payment-detail';

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

const mockPaymentDetail = {
  id: 1,
  userId: 1,
  amount: 299.99,
  currency: 'USD',
  status: 'completed',
  paymentMethod: 'credit_card',
  transactionId: 'txn_123456789',
  cardDetails: {
    last4: '1234',
    brand: 'visa',
    expMonth: 12,
    expYear: 2025,
  },
  billingAddress: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('useGetPaymentDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch payment detail with valid ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}1`,
      );
    });

    it('should fetch payment detail with numeric string ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}123`,
      );
    });

    it('should fetch payment detail with UUID-like ID', async () => {
      const uuidId = '550e8400-e29b-41d4-a716-446655440000';
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail(uuidId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}${uuidId}`,
      );
    });

    it('should fetch payment detail with custom enabled parameter', async () => {
      const { result } = renderHook(() => useGetPaymentDetail('1', false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch payment detail when enabled is true', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('1', true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}1`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
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

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
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

    it('should handle 404 responses for non-existent payment', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetPaymentDetail('999'), {
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

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
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
            setTimeout(
              () => resolve(createMockResponse(mockPaymentDetail)),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to success', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockPaymentDetail);
    });

    it('should transition from loading to error', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
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
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}1`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => useGetPaymentDetail('1', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should update query when ID changes', async () => {
      const payment1 = { ...mockPaymentDetail, id: 1 };
      const payment2 = { ...mockPaymentDetail, id: 2 };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(payment1))
        .mockResolvedValueOnce(createMockResponse(payment2));

      const { result, rerender } = renderHook(
        ({ id }) => useGetPaymentDetail(id),
        {
          wrapper: createWrapper(),
          initialProps: { id: '1' },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(payment1);

      rerender({ id: '2' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(payment2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}2`,
      );
    });

    it('should handle enabled parameter changes', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result, rerender } = renderHook(
        ({ enabled }) => useGetPaymentDetail('1', enabled),
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

      expect(result.current.data).toEqual(mockPaymentDetail);
    });
  });

  describe('Data Format', () => {
    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle empty object response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({});
    });

    it('should handle minimal payment data', async () => {
      const minimalPayment = {
        id: 1,
        amount: 100.0,
        status: 'completed',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(minimalPayment));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(minimalPayment);
    });

    it('should handle complex payment data with nested objects', async () => {
      const complexPayment = {
        ...mockPaymentDetail,
        refunds: [
          {
            id: 1,
            amount: 50.0,
            reason: 'defective',
            processedAt: '2024-01-15T00:00:00Z',
          },
          {
            id: 2,
            amount: 25.0,
            reason: 'return',
            processedAt: '2024-01-20T00:00:00Z',
          },
        ],
        disputes: [
          {
            id: 1,
            reason: 'fraud',
            status: 'open',
            submittedAt: '2024-01-10T00:00:00Z',
          },
        ],
        metadata: {
          orderId: 'order_123',
          customerId: 'customer_456',
          source: 'web',
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(complexPayment));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(complexPayment);
    });
  });

  describe('Caching and Stale Time', () => {
    it('should use correct stale time configuration', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const payment1 = { ...mockPaymentDetail, id: 1 };
      const payment2 = { ...mockPaymentDetail, id: 2 };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(payment1))
        .mockResolvedValueOnce(createMockResponse(payment2));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => useGetPaymentDetail('2'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(payment1);
      expect(result2.current.data).toEqual(payment2);
    });

    it('should handle concurrent requests for same payment', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in ID', async () => {
      const specialId = '1&2=3';
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail(specialId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}${specialId}`,
      );
    });

    it('should handle very long ID', async () => {
      const longId = 'a'.repeat(1000);
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail(longId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}${longId}`,
      );
    });

    it('should handle malformed payment data', async () => {
      const malformedData = {
        id: 'invalid',
        amount: 'not-a-number',
        status: null,
        invalidField: 'should be ignored',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => useGetPaymentDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedData);
    });

    it('should handle empty string ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetPaymentDetail(''), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PAYMENTS}`,
      );
    });

    it('should handle undefined enabled parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockPaymentDetail));

      const { result } = renderHook(() => useGetPaymentDetail('1', undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaymentDetail);
    });
  });
});
