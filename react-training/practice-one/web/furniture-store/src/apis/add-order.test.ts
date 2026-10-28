import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddOrder } from './add-order';
import type { OrderInterface } from '../interfaces/order';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    ORDERS: '/orders',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

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

const mockOrderPayload: OrderInterface = {
  userId: 1,
  status: 'pending',
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1234567890',
  items: [
    {
      productId: 101,
      variantId: 1,
      quantity: 2,
    },
    {
      productId: 102,
      variantId: 2,
      quantity: 1,
    },
  ],
};

describe('useAddOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Successful Mutations', () => {
    it('should successfully add order with valid payload', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should add orderDate timestamp to payload', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body).toHaveProperty('orderDate');
      expect(body.orderDate).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });

    it('should handle async mutation with mutateAsync', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockOrderPayload);

      expect(response).toEqual(mockResponse);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle order with minimal required fields', async () => {
      const minimalPayload: OrderInterface = {
        items: [
          {
            productId: 101,
            variantId: 1,
            quantity: 1,
          },
        ],
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...minimalPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(minimalPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle order with all optional fields', async () => {
      const fullPayload: OrderInterface = {
        id: 123,
        userId: 1,
        orderDate: 1640995200000,
        status: 'confirmed',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        email: 'customer@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1987654321',
        items: [
          {
            productId: 201,
            variantId: 3,
            quantity: 3,
          },
        ],
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...fullPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
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
        status: 'confirmed',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        country: 'USA',
        email: 'customer@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+1987654321',
        items: expect.arrayContaining([
          expect.objectContaining({
            productId: 201,
            variantId: 3,
            quantity: 3,
          }),
        ]),
        orderDate: expect.any(String),
      });
    });

    it('should handle order with multiple items', async () => {
      const multiItemPayload: OrderInterface = {
        ...mockOrderPayload,
        items: [
          {
            productId: 101,
            variantId: 1,
            quantity: 2,
          },
          {
            productId: 102,
            variantId: 2,
            quantity: 1,
          },
          {
            productId: 103,
            variantId: 3,
            quantity: 5,
          },
        ],
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...multiItemPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(multiItemPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.items).toHaveLength(3);
      expect(body.items[0]).toMatchObject({
        productId: 101,
        variantId: 1,
        quantity: 2,
      });
      expect(body.items[1]).toMatchObject({
        productId: 102,
        variantId: 2,
        quantity: 1,
      });
      expect(body.items[2]).toMatchObject({
        productId: 103,
        variantId: 3,
        quantity: 5,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Insufficient inventory',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Insufficient inventory');
    });

    it('should handle HTTP error with malformed error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null, false),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
    });

    it('should handle 404 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

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

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid JSON');
    });
  });

  describe('Loading States', () => {
    it('should reset loading state after mutation completion', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockOrderPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      const mockResponse1: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      const mockResponse2: OrderInterface = {
        id: 2,
        ...mockOrderPayload,
        orderDate: 1640995300000,
      };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockResponse1))
        .mockResolvedValueOnce(createMockResponse(mockResponse2));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const payload1 = { ...mockOrderPayload, userId: 1 };
      const payload2 = { ...mockOrderPayload, userId: 2 };

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
    it('should handle OrderInterface response', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        userId: 1,
        orderDate: 1640995200000,
        status: 'pending',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        items: [
          {
            productId: 101,
            variantId: 1,
            quantity: 2,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockOrderPayload);

      expect(response).toEqual(mockResponse);
      expect(response.id).toBe(1);
      expect(response.userId).toBe(1);
      expect(response.status).toBe('pending');
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockOrderPayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('success'));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockOrderPayload);

      expect(response).toBe('success');
    });

    it('should handle object response with extra fields', async () => {
      const objectResponse = {
        success: true,
        orderId: 123,
        trackingNumber: 'TRK123456',
        estimatedDelivery: '2024-01-15',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockOrderPayload);

      expect(response).toEqual(objectResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useAddOrder(), { wrapper });
      const { result: result2 } = renderHook(() => useAddOrder(), { wrapper });

      const payload1 = { ...mockOrderPayload, userId: 1 };
      const payload2 = { ...mockOrderPayload, userId: 2 };

      result1.current.mutate(payload1);
      result2.current.mutate(payload2);

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent mutations', async () => {
      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValue(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      const payload1 = { ...mockOrderPayload, status: 'pending' };
      const payload2 = { ...mockOrderPayload, status: 'confirmed' };

      result.current.mutate(payload1);
      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle order with empty items array', async () => {
      const emptyItemsPayload: OrderInterface = {
        userId: 1,
        items: [],
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...emptyItemsPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(emptyItemsPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.items).toEqual([]);
    });

    it('should handle order with zero userId', async () => {
      const zeroUserIdPayload: OrderInterface = {
        userId: 0,
        items: [
          {
            productId: 101,
            variantId: 1,
            quantity: 1,
          },
        ],
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...zeroUserIdPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.userId).toBe(0);
    });

    it('should handle order with negative userId', async () => {
      const negativeUserIdPayload: OrderInterface = {
        userId: -1,
        items: [
          {
            productId: 101,
            variantId: 1,
            quantity: 1,
          },
        ],
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...negativeUserIdPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativeUserIdPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.userId).toBe(-1);
    });

    it('should handle malformed order payload', async () => {
      const malformedPayload = {
        userId: 'invalid',
        status: null,
        email: 'not-an-email',
        items: [
          {
            productId: null,
            variantId: 'invalid',
            quantity: 'not-a-number',
          },
        ],
      } as unknown as OrderInterface;

      const mockResponse: OrderInterface = {
        id: 1,
        ...mockOrderPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
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

    it('should handle order with special characters in address', async () => {
      const specialAddressPayload: OrderInterface = {
        ...mockOrderPayload,
        address: '123 Main St & Oak Ave, Apt #4B, City/State',
        city: 'São Paulo',
        country: 'Brasil',
        firstName: 'José',
        lastName: 'González',
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...specialAddressPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialAddressPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse((callArgs?.[1]?.body as string) || '{}');
      expect(body.address).toBe('123 Main St & Oak Ave, Apt #4B, City/State');
      expect(body.city).toBe('São Paulo');
      expect(body.country).toBe('Brasil');
      expect(body.firstName).toBe('José');
      expect(body.lastName).toBe('González');
    });

    it('should handle order with very long strings', async () => {
      const longStringPayload: OrderInterface = {
        ...mockOrderPayload,
        address: 'A'.repeat(1000),
        city: 'B'.repeat(500),
        email: 'very-long-email-address@very-long-domain-name.com',
        firstName: 'C'.repeat(100),
        lastName: 'D'.repeat(100),
        phoneNumber: '+12345678901234567890',
      };

      const mockResponse: OrderInterface = {
        id: 1,
        ...longStringPayload,
        orderDate: 1640995200000,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const { result } = renderHook(() => useAddOrder(), {
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
      expect(body.email).toBe(
        'very-long-email-address@very-long-domain-name.com',
      );
      expect(body.firstName).toBe('C'.repeat(100));
      expect(body.lastName).toBe('D'.repeat(100));
      expect(body.phoneNumber).toBe('+12345678901234567890');
    });
  });
});
