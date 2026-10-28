import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdatePayment } from './update-payment';
import type { PaymentInterface } from '../interfaces/payment';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    PAYMENTS: '/payments',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

jest.mock('../constants/query-keys', () => ({
  QUERY_KEY: {
    PAYMENT: jest.fn((userId: number) => ['payment', userId]),
    PAYMENT_DETAIL: jest.fn((paymentId: string) => [
      'paymentDetail',
      paymentId,
    ]),
  },
}));

import { QUERY_KEY } from '../constants/query-keys';

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockQueryKeyPayment = QUERY_KEY.PAYMENT as jest.MockedFunction<
  typeof QUERY_KEY.PAYMENT
>;
const mockQueryKeyPaymentDetail =
  QUERY_KEY.PAYMENT_DETAIL as jest.MockedFunction<
    typeof QUERY_KEY.PAYMENT_DETAIL
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

const mockPaymentPayload: PaymentInterface = {
  id: 1,
  userId: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '1234567890',
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
  cardNumber: '1234567890123456',
  cvv: '123',
  expirationDate: '12/25',
  useShippingAddress: true,
};

const mockUpdatePayload = {
  paymentId: 123,
  paymentPayload: mockPaymentPayload,
};

describe('useUpdatePayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockQueryKeyPayment.mockClear();
    mockQueryKeyPaymentDetail.mockClear();
  });

  describe('Successful Mutations', () => {
    it('should successfully update payment with valid payload', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call PUT endpoint with correct URL and payload', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/payments123');
      expect(callArgs[1]?.method).toBe('PUT');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        mockPaymentPayload,
      );
    });

    it('should handle async mutation with mutateAsync', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toEqual(mockPaymentPayload);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle paymentId as string', async () => {
      const stringPaymentIdPayload = {
        paymentId: 'payment-123',
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(stringPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/paymentspayment-123',
      );
    });

    it('should handle paymentId as number', async () => {
      const numberPaymentIdPayload = {
        paymentId: 456,
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(numberPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/payments456');
    });

    it('should handle payment with minimal required fields', async () => {
      const minimalPaymentPayload = {
        paymentId: 123,
        paymentPayload: {
          userId: 1,
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(minimalPaymentPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual({
        userId: 1,
      });
    });

    it('should handle payment with all optional fields', async () => {
      const fullPaymentPayload = {
        paymentId: 123,
        paymentPayload: {
          id: 1,
          userId: 1,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phoneNumber: '9876543210',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          country: 'USA',
          cardNumber: '9876543210987654',
          cvv: '456',
          expirationDate: '06/26',
          useShippingAddress: false,
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(fullPaymentPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        fullPaymentPayload.paymentPayload,
      );
    });

    it('should handle payment with undefined optional fields', async () => {
      const partialPaymentPayload = {
        paymentId: 123,
        paymentPayload: {
          userId: 1,
          firstName: 'John',
          lastName: undefined,
          email: undefined,
          phoneNumber: undefined,
          address: undefined,
          city: undefined,
          country: undefined,
          cardNumber: undefined,
          cvv: undefined,
          expirationDate: undefined,
          useShippingAddress: undefined,
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(partialPaymentPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        partialPaymentPayload.paymentPayload,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useUpdatePayment(), {
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

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to update payment information');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Payment not found',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Payment not found');
    });

    it('should handle HTTP error with malformed error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null, false),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to update payment information');
    });

    it('should handle 404 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to update payment information');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useUpdatePayment(), {
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
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Query Data Setting', () => {
    it('should set query data for payment detail on successful update', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPaymentDetail).toHaveBeenCalledWith('123');
    });

    it('should set query data with correct paymentId as string', async () => {
      const stringPaymentIdPayload = {
        paymentId: 'payment-456',
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(stringPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPaymentDetail).toHaveBeenCalledWith('payment-456');
    });

    it('should set query data with correct paymentId as number', async () => {
      const numberPaymentIdPayload = {
        paymentId: 789,
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(numberPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPaymentDetail).toHaveBeenCalledWith('789');
    });

    it('should handle zero paymentId', async () => {
      const zeroPaymentIdPayload = {
        paymentId: 0,
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPaymentDetail).toHaveBeenCalledWith('0');
    });
  });

  describe('Query Invalidation', () => {
    it('should invalidate payment query on successful update', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockUpdatePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPayment).toHaveBeenCalledWith(1);
    });

    it('should invalidate correct query key for different users', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockPaymentPayload));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        paymentId: 1,
        paymentPayload: { ...mockPaymentPayload, userId: 1 },
      };
      const payload2 = {
        paymentId: 2,
        paymentPayload: { ...mockPaymentPayload, userId: 2 },
      };

      result.current.mutate(payload1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPayment).toHaveBeenCalledWith(1);

      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPayment).toHaveBeenCalledWith(2);
    });

    it('should handle zero userId', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const zeroUserIdPayload = {
        paymentId: 123,
        paymentPayload: { ...mockPaymentPayload, userId: 0 },
      };

      result.current.mutate(zeroUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPayment).toHaveBeenCalledWith(0);
    });

    it('should handle negative userId', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const negativeUserIdPayload = {
        paymentId: 123,
        paymentPayload: { ...mockPaymentPayload, userId: -1 },
      };

      result.current.mutate(negativeUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPayment).toHaveBeenCalledWith(-1);
    });

    it('should handle undefined userId', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const undefinedUserIdPayload = {
        paymentId: 123,
        paymentPayload: { ...mockPaymentPayload, userId: undefined },
      };

      result.current.mutate(undefinedUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKeyPayment).toHaveBeenCalledWith(NaN);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      const mockResponse1 = mockPaymentPayload;
      const mockResponse2 = mockPaymentPayload;

      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockResponse1))
        .mockResolvedValueOnce(createMockResponse(mockResponse2));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        paymentId: 1,
        paymentPayload: { ...mockPaymentPayload, userId: 1 },
      };
      const payload2 = {
        paymentId: 2,
        paymentPayload: { ...mockPaymentPayload, userId: 2 },
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
    it('should handle PaymentInterface response', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toEqual(mockPaymentPayload);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('success'));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toBe('success');
    });

    it('should handle object response with extra fields', async () => {
      const objectResponse = {
        ...mockPaymentPayload,
        extraField: 'extra value',
        timestamp: 1234567890,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toEqual(objectResponse);
    });

    it('should handle array response', async () => {
      const arrayResponse = [mockPaymentPayload, mockPaymentPayload];

      mockFetch.mockResolvedValueOnce(createMockResponse(arrayResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockUpdatePayload);

      expect(response).toEqual(arrayResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useUpdatePayment(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useUpdatePayment(), {
        wrapper,
      });

      const payload1 = {
        paymentId: 1,
        paymentPayload: { ...mockPaymentPayload, userId: 1 },
      };
      const payload2 = {
        paymentId: 2,
        paymentPayload: { ...mockPaymentPayload, userId: 2 },
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
      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        paymentId: 1,
        paymentPayload: { ...mockPaymentPayload, userId: 1 },
      };
      const payload2 = {
        paymentId: 2,
        paymentPayload: { ...mockPaymentPayload, userId: 2 },
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
    it('should handle paymentId with special characters', async () => {
      const specialPaymentIdPayload = {
        paymentId: 'payment-123_test',
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/paymentspayment-123_test',
      );
    });

    it('should handle paymentId with spaces', async () => {
      const spacePaymentIdPayload = {
        paymentId: ' payment 123 ',
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(spacePaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        'http://localhost:3001/payments%20payment%20123',
      );
    });

    it('should handle paymentId with very long string', async () => {
      const longPaymentIdPayload = {
        paymentId: 'a'.repeat(1000),
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(longPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe(
        `http://localhost:3001/payments${'a'.repeat(1000)}`,
      );
    });

    it('should handle malformed payment payload', async () => {
      const malformedPayload = {
        paymentId: 123,
        paymentPayload: {
          userId: 'invalid',
          firstName: null,
          lastName: undefined,
          email: 123,
          phoneNumber: 'not-a-number',
          cardNumber: true,
          cvv: [],
          expirationDate: {},
          useShippingAddress: 'yes',
        },
      } as unknown as { paymentId: number; paymentPayload: PaymentInterface };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        malformedPayload.paymentPayload,
      );
    });

    it('should handle zero paymentId', async () => {
      const zeroPaymentIdPayload = {
        paymentId: 0,
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroPaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/payments0');
    });

    it('should handle negative paymentId', async () => {
      const negativePaymentIdPayload = {
        paymentId: -1,
        paymentPayload: mockPaymentPayload,
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativePaymentIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/payments-1');
    });

    it('should handle payment with very long field values', async () => {
      const longFieldPayload = {
        paymentId: 123,
        paymentPayload: {
          ...mockPaymentPayload,
          firstName: 'a'.repeat(1000),
          lastName: 'b'.repeat(1000),
          email: 'c'.repeat(1000),
          address: 'd'.repeat(1000),
          city: 'e'.repeat(1000),
          country: 'f'.repeat(1000),
          cardNumber: '1'.repeat(1000),
          cvv: '2'.repeat(1000),
          expirationDate: '3'.repeat(1000),
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(longFieldPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        longFieldPayload.paymentPayload,
      );
    });

    it('should handle payment with empty string field values', async () => {
      const emptyStringPayload = {
        paymentId: 123,
        paymentPayload: {
          ...mockPaymentPayload,
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          address: '',
          city: '',
          country: '',
          cardNumber: '',
          cvv: '',
          expirationDate: '',
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(emptyStringPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        emptyStringPayload.paymentPayload,
      );
    });

    it('should handle payment with boolean field variations', async () => {
      const booleanPayload = {
        paymentId: 123,
        paymentPayload: {
          ...mockPaymentPayload,
          useShippingAddress: false,
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(booleanPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        booleanPayload.paymentPayload,
      );
    });

    it('should handle payment with numeric field variations', async () => {
      const numericPayload = {
        paymentId: 123,
        paymentPayload: {
          ...mockPaymentPayload,
          id: 0,
          userId: -1,
          phoneNumber: '0',
        },
      };

      const mockResponse = mockPaymentPayload;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useUpdatePayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(numericPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        numericPayload.paymentPayload,
      );
    });
  });
});
