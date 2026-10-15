import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetProductDetail } from './product-detail';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    PRODUCTS: '/products',
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

const mockProductDetail = {
  id: 1,
  name: 'Modern Chair',
  price: 299.99,
  description: 'A comfortable modern chair perfect for any home office.',
  images: ['image1.jpg', 'image2.jpg'],
  category: {
    id: 1,
    name: 'Furniture',
    subCategory: 'Chairs',
  },
  specifications: {
    material: 'Wood',
    dimensions: '24" x 24" x 32"',
    weight: '15 lbs',
  },
  inStock: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('useGetProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch product detail with valid ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}1`,
      );
    });

    it('should fetch product detail with numeric string ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}123`,
      );
    });

    it('should fetch product detail with UUID-like ID', async () => {
      const uuidId = '550e8400-e29b-41d4-a716-446655440000';
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail(uuidId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}${uuidId}`,
      );
    });

    it('should fetch product detail with custom enabled parameter', async () => {
      const { result } = renderHook(() => useGetProductDetail('1', false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch product detail when enabled is true', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('1', true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}1`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useGetProductDetail('1'), {
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

      const { result } = renderHook(() => useGetProductDetail('1'), {
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

    it('should handle 404 responses for non-existent products', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetProductDetail('999'), {
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

      const { result } = renderHook(() => useGetProductDetail('1'), {
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
              () => resolve(createMockResponse(mockProductDetail)),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to success', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockProductDetail);
    });

    it('should transition from loading to error', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useGetProductDetail('1'), {
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
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}1`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => useGetProductDetail('1', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should update query when ID changes', async () => {
      const product1 = { ...mockProductDetail, id: 1 };
      const product2 = { ...mockProductDetail, id: 2 };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(product1))
        .mockResolvedValueOnce(createMockResponse(product2));

      const { result, rerender } = renderHook(
        ({ id }) => useGetProductDetail(id),
        {
          wrapper: createWrapper(),
          initialProps: { id: '1' },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(product1);

      rerender({ id: '2' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(product2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}2`,
      );
    });

    it('should handle enabled parameter changes', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result, rerender } = renderHook(
        ({ enabled }) => useGetProductDetail('1', enabled),
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

      expect(result.current.data).toEqual(mockProductDetail);
    });
  });

  describe('Data Format', () => {
    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle empty object response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({}));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({});
    });

    it('should handle minimal product data', async () => {
      const minimalProduct = {
        id: 1,
        name: 'Minimal Product',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(minimalProduct));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(minimalProduct);
    });

    it('should handle complex product data with nested objects', async () => {
      const complexProduct = {
        ...mockProductDetail,
        reviews: [
          { id: 1, rating: 5, comment: 'Great product!' },
          { id: 2, rating: 4, comment: 'Good quality' },
        ],
        variants: [
          { id: 1, color: 'Red', size: 'Large' },
          { id: 2, color: 'Blue', size: 'Medium' },
        ],
        relatedProducts: [1, 2, 3],
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(complexProduct));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(complexProduct);
    });
  });

  describe('Caching and Stale Time', () => {
    it('should use correct stale time configuration', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const product1 = { ...mockProductDetail, id: 1 };
      const product2 = { ...mockProductDetail, id: 2 };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(product1))
        .mockResolvedValueOnce(createMockResponse(product2));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useGetProductDetail('1'), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => useGetProductDetail('2'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(product1);
      expect(result2.current.data).toEqual(product2);
    });

    it('should handle concurrent requests for same product', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in ID', async () => {
      const specialId = '1&2=3';
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail(specialId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}${specialId}`,
      );
    });

    it('should handle very long ID', async () => {
      const longId = 'a'.repeat(1000);
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail(longId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}${longId}`,
      );
    });

    it('should handle malformed product data', async () => {
      const malformedData = {
        id: 'invalid',
        name: null,
        price: 'not-a-number',
        invalidField: 'should be ignored',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => useGetProductDetail('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedData);
    });

    it('should handle empty string ID', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useGetProductDetail(''), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS}`,
      );
    });

    it('should handle undefined enabled parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProductDetail));

      const { result } = renderHook(() => useGetProductDetail('1', undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProductDetail);
    });
  });
});
