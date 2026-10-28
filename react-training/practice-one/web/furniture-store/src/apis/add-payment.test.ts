import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddPayment } from './add-payment';
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
  },
}));

import { QUERY_KEY } from '../constants/query-keys';

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
const mockQueryKey = QUERY_KEY.PAYMENT as jest.MockedFunction<
  typeof QUERY_KEY.PAYMENT
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
  userId: 1,
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
  name: 'John Doe',
  cardNumber: '4111111111111111',
  cvv: '123',
  expirationDate: '12/25',
  useShippingAddress: true,
};

describe('useAddPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockQueryKey.mockClear();
  });

  describe('Successful Mutations', () => {
    it('should successfully add payment with valid payload', async () => {
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should add createdAt timestamp to payload', async () => {
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

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
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockPaymentPayload);

      expect(response).toEqual(mockResponse);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle payment with minimal required fields', async () => {
      const minimalPayload: PaymentInterface = {
        userId: 1,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...minimalPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(minimalPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle payment with all optional fields', async () => {
      const fullPayload: PaymentInterface = {
        id: 123,
        userId: 1,
        address: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        email: 'customer@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1987654321',
        name: 'Jane Smith',
        cardNumber: '5555555555554444',
        cvv: '456',
        expirationDate: '06/26',
        useShippingAddress: false,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...fullPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(fullPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body).toMatchObject({
        userId: 1,
        address: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        email: 'customer@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1987654321',
        name: 'Jane Smith',
        cardNumber: '5555555555554444',
        cvv: '456',
        expirationDate: '06/26',
        useShippingAddress: false,
        createdAt: expect.any(String),
      });
    });

    it('should handle payment without userId', async () => {
      const noUserIdPayload: PaymentInterface = {
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...noUserIdPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(noUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create payment information');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Invalid credit card number',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid credit card number');
    });

    it('should handle HTTP error with malformed error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null, false),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create payment information');
    });

    it('should handle 404 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create payment information');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid JSON');
    });
  });

  describe('Loading States', () => {
    it('should reset loading state after mutation completion', async () => {
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Query Invalidation', () => {
    it('should invalidate payment query on successful mutation with userId', async () => {
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockPaymentPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).toHaveBeenCalledWith(mockPaymentPayload.userId);
    });

    it('should not invalidate query when userId is undefined', async () => {
      const noUserIdPayload: PaymentInterface = {
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...noUserIdPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(noUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockQueryKey).not.toHaveBeenCalled();
    });

    it('should invalidate correct query key for different users', async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const payload1 = { ...mockPaymentPayload, userId: 1 };
      const payload2 = { ...mockPaymentPayload, userId: 2 };

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
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      const mockResponse1: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      const mockResponse2: PaymentInterface = {
        id: 2,
        ...mockPaymentPayload,
      };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockResponse1))
        .mockResolvedValueOnce(createMockResponse(mockResponse2));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const payload1 = { ...mockPaymentPayload, userId: 1 };
      const payload2 = { ...mockPaymentPayload, userId: 2 };

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
      const mockResponse: PaymentInterface = {
        id: 1,
        userId: 1,
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockPaymentPayload);

      expect(response).toEqual(mockResponse);
      expect(response.id).toBe(1);
      expect(response.userId).toBe(1);
      expect(response.cardNumber).toBe('4111111111111111');
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockPaymentPayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('success'));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockPaymentPayload);

      expect(response).toBe('success');
    });

    it('should handle object response with extra fields', async () => {
      const objectResponse = {
        success: true,
        paymentId: 123,
        transactionId: 'TXN123456',
        processingTime: '2.5s',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockPaymentPayload);

      expect(response).toEqual(objectResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useAddPayment(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useAddPayment(), {
        wrapper,
      });

      const payload1 = { ...mockPaymentPayload, userId: 1 };
      const payload2 = { ...mockPaymentPayload, userId: 2 };

      result1.current.mutate(payload1);
      result2.current.mutate(payload2);

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent mutations', async () => {
      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      const payload1 = {
        ...mockPaymentPayload,
        cardNumber: '4111111111111111',
      };
      const payload2 = {
        ...mockPaymentPayload,
        cardNumber: '5555555555554444',
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
    it('should handle payment with zero userId', async () => {
      const zeroUserIdPayload: PaymentInterface = {
        userId: 0,
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...zeroUserIdPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Zero is falsy, so query should not be invalidated
      expect(mockQueryKey).not.toHaveBeenCalled();
    });

    it('should handle payment with negative userId', async () => {
      const negativeUserIdPayload: PaymentInterface = {
        userId: -1,
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...negativeUserIdPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativeUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Negative numbers are truthy, so query should be invalidated
      expect(mockQueryKey).toHaveBeenCalledWith(-1);
    });

    it('should handle malformed payment payload', async () => {
      const malformedPayload = {
        userId: 'invalid',
        email: 'not-an-email',
        cardNumber: null,
        cvv: 'invalid',
        expirationDate: 'invalid-date',
        useShippingAddress: 'not-boolean',
      } as unknown as PaymentInterface;

      const mockResponse: PaymentInterface = {
        id: 1,
        ...mockPaymentPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.userId).toBe('invalid');
    });

    it('should handle payment with special characters', async () => {
      const specialCharPayload: PaymentInterface = {
        userId: 1,
        address: '123 Main St & Oak Ave, Apt #4B',
        city: 'São Paulo',
        country: 'Brasil',
        email: 'josé.gonzález@example.com',
        firstName: 'José',
        lastName: 'González',
        phoneNumber: '+55 11 99999-9999',
        name: 'José González',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...specialCharPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialCharPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.address).toBe('123 Main St & Oak Ave, Apt #4B');
      expect(body.city).toBe('São Paulo');
      expect(body.country).toBe('Brasil');
      expect(body.email).toBe('josé.gonzález@example.com');
      expect(body.firstName).toBe('José');
      expect(body.lastName).toBe('González');
      expect(body.phoneNumber).toBe('+55 11 99999-9999');
      expect(body.name).toBe('José González');
    });

    it('should handle payment with very long strings', async () => {
      const longStringPayload: PaymentInterface = {
        userId: 1,
        address: 'A'.repeat(1000),
        city: 'B'.repeat(500),
        country: 'C'.repeat(100),
        email: 'very-long-email-address@very-long-domain-name.com',
        firstName: 'D'.repeat(100),
        lastName: 'E'.repeat(100),
        phoneNumber: '+12345678901234567890',
        name: 'F'.repeat(200),
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: true,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...longStringPayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(longStringPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.address).toBe('A'.repeat(1000));
      expect(body.city).toBe('B'.repeat(500));
      expect(body.country).toBe('C'.repeat(100));
      expect(body.email).toBe(
        'very-long-email-address@very-long-domain-name.com',
      );
      expect(body.firstName).toBe('D'.repeat(100));
      expect(body.lastName).toBe('E'.repeat(100));
      expect(body.phoneNumber).toBe('+12345678901234567890');
      expect(body.name).toBe('F'.repeat(200));
    });

    it('should handle payment with useShippingAddress as false', async () => {
      const useShippingFalsePayload: PaymentInterface = {
        userId: 1,
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        name: 'John Doe',
        cardNumber: '4111111111111111',
        cvv: '123',
        expirationDate: '12/25',
        useShippingAddress: false,
      };

      const mockResponse: PaymentInterface = {
        id: 1,
        ...useShippingFalsePayload,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddPayment(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(useShippingFalsePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.useShippingAddress).toBe(false);
    });
  });
});
