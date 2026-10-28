import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GetProducts, GetProductsInfinite } from './products';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    PRODUCTS: '/products',
    PRODUCTS_WITH_STOCK: '/products/with-stock',
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
    headers: new Headers({
      'X-Total-Count': '100',
    }),
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

const createWrapper = (queryClient?: QueryClient) => {
  const client =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          staleTime: 0,
        },
      },
    });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };
};

const mockProducts = [
  {
    id: 1,
    name: 'Modern Chair',
    price: 299.99,
    createdAt: '2024-01-01T00:00:00Z',
    mainCategoryId: 1,
    subCategoryId: 1,
    variants: [
      {
        id: 101,
        hex: '#FF5733',
        size: 'Medium',
        stock: 5,
        images: [{ url: 'test.jpg', alt: 'Modern Chair' }],
      },
    ],
  },
  {
    id: 2,
    name: 'Wooden Table',
    price: 599.99,
    createdAt: '2024-01-02T00:00:00Z',
    mainCategoryId: 2,
    subCategoryId: 2,
    variants: [
      {
        id: 201,
        hex: '#8B4513',
        size: 'Large',
        stock: 3,
        images: [{ url: 'test.jpg', alt: 'Wooden Table' }],
      },
    ],
  },
  {
    id: 3,
    name: 'Leather Sofa',
    price: 1299.99,
    createdAt: '2024-01-03T00:00:00Z',
    mainCategoryId: 1,
    subCategoryId: 3,
    variants: [
      {
        id: 301,
        hex: '#654321',
        size: 'XL',
        stock: 2,
        images: [{ url: 'test.jpg', alt: 'Leather Sofa' }],
      },
    ],
  },
];

describe('GetProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch products with default parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        items: mockProducts,
        total: '100',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc`,
      );
    });

    it('should fetch products with custom parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(10, 30, '1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        items: mockProducts,
        total: '100',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=10&_end=30&_sort=createdAt&_order=desc&mainCategoryId=1`,
      );
    });

    it('should fetch products with custom enabled parameter', async () => {
      const { result } = renderHook(() => GetProducts(0, 20, '', false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch products when enabled is true', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(0, 20, '2', true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        items: mockProducts,
        total: '100',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&mainCategoryId=2`,
      );
    });
  });

  describe('Parameter Handling', () => {
    it('should handle empty mainCategoryId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(0, 20, ''), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc`,
      );
    });

    it('should handle numeric mainCategoryId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(0, 20, '123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&mainCategoryId=123`,
      );
    });

    it('should handle large pagination values', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(100, 200, '1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=100&_end=200&_sort=createdAt&_order=desc&mainCategoryId=1`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => GetProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(networkError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => GetProducts(), {
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

      const { result } = renderHook(() => GetProducts(), {
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

      const { result } = renderHook(() => GetProducts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should transition from loading to success', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProducts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual({
        items: mockProducts,
        total: '100',
      });
    });
  });

  describe('Query Configuration', () => {
    it('should use correct query key', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      renderHook(() => GetProducts(0, 20, '1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&mainCategoryId=1`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => GetProducts(0, 20, '1', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should call API with different parameters when props change', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockProducts));

      const { rerender } = renderHook(
        ({ start, end, mainCategoryId }) =>
          GetProducts(start, end, mainCategoryId),
        {
          wrapper: createWrapper(),
          initialProps: { start: 0, end: 20, mainCategoryId: '1' },
        },
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&mainCategoryId=1`,
        );
      });

      rerender({ start: 10, end: 30, mainCategoryId: '2' });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=10&_end=30&_sort=createdAt&_order=desc&mainCategoryId=2`,
        );
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Format', () => {
    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => GetProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        items: [],
        total: '100',
      });
    });

    it('should handle single product response', async () => {
      const singleProduct = [mockProducts[0]];

      mockFetch.mockResolvedValueOnce(createMockResponse(singleProduct));

      const { result } = renderHook(() => GetProducts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        items: singleProduct,
        total: '100',
      });
    });
  });
});

describe('GetProductsInfinite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch first page with default parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc`,
      );
    });

    it('should fetch with custom parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(10, 'lowToHigh', '1'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=10&_sort=price&_order=asc&mainCategoryId=1`,
      );
    });

    it('should fetch with search parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent', null, 'chair'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&name_like=chair`,
      );
    });

    it('should fetch with subCategoryName parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent', '1', null, 'Chairs'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&mainCategoryId=1&subCategoryId=Chairs`,
      );
    });

    it('should not add subCategoryId when subCategoryName is "All"', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent', '1', null, 'All'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&mainCategoryId=1`,
      );
    });
  });

  describe('Sorting Parameters', () => {
    it('should handle lowToHigh sorting', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'lowToHigh'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=price&_order=asc`,
      );
    });

    it('should handle highToLow sorting', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'highToLow'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=price&_order=desc`,
      );
    });

    it('should handle mostRecent sorting (default)', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc`,
      );
    });
  });

  describe('Pagination', () => {
    it('should fetch next page when hasNextPage is true', async () => {
      const firstPage = mockProducts.slice(0, 2);
      const secondPage = mockProducts.slice(2);

      mockFetch
        .mockResolvedValueOnce(createMockResponse(firstPage))
        .mockResolvedValueOnce(createMockResponse(secondPage));

      const { result } = renderHook(() => GetProductsInfinite(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: firstPage, total: '100' },
      ]);
      expect(result.current.hasNextPage).toBe(true);

      // Fetch next page
      await result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages).toEqual([
        { items: firstPage, total: '100' },
        { items: secondPage, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=2&_end=4&_sort=createdAt&_order=desc`,
      );
    });

    it('should not fetch next page when server total is reached', async () => {
      const lastPage = mockProducts.slice(0, 1); // Less than pageSize

      // Mock a response that indicates we've fetched all items from server
      const mockResponseWithSmallTotal = (data: unknown) => ({
        ok: true,
        json: async () => data,
        status: 200,
        statusText: 'OK',
        headers: new Headers({
          'X-Total-Count': '1', // Total matches what we fetched
        }),
      });

      mockFetch.mockResolvedValueOnce(
        mockResponseWithSmallTotal(lastPage) as Response,
      );

      const { result } = renderHook(() => GetProductsInfinite(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: lastPage, total: '1' },
      ]);
      expect(result.current.hasNextPage).toBe(false);
    });

    it('should handle pagination with custom pageSize', async () => {
      const firstPage = mockProducts.slice(0, 1);
      const secondPage = mockProducts.slice(1, 2);

      mockFetch
        .mockResolvedValueOnce(createMockResponse(firstPage))
        .mockResolvedValueOnce(createMockResponse(secondPage));

      const { result } = renderHook(() => GetProductsInfinite(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: firstPage, total: '100' },
      ]);

      // Fetch next page
      const fetchPromise = result.current.fetchNextPage();

      await fetchPromise;

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages).toEqual([
        { items: firstPage, total: '100' },
        { items: secondPage, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=1&_end=2&_sort=createdAt&_order=desc`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(networkError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        new Error('Network response was not ok'),
      );
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

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle fetchNextPage functionality', async () => {
      const firstPage = mockProducts.slice(0, 2);
      const secondPage = mockProducts.slice(2);

      mockFetch
        .mockResolvedValueOnce(createMockResponse(firstPage))
        .mockResolvedValueOnce(createMockResponse(secondPage));

      const { result } = renderHook(() => GetProductsInfinite(2), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: firstPage, total: '100' },
      ]);
      expect(result.current.hasNextPage).toBe(true);

      // Fetch next page
      await result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      expect(result.current.data?.pages).toEqual([
        { items: firstPage, total: '100' },
        { items: secondPage, total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Query Configuration', () => {
    it('should use correct query key', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      renderHook(() => GetProductsInfinite(20, 'lowToHigh', '1', 'search'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=price&_order=asc&mainCategoryId=1&name_like=search`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent', null, null, null, false),
        {
          wrapper: createWrapper(),
        },
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should update query when parameters change', async () => {
      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockProducts))
        .mockResolvedValueOnce(createMockResponse(mockProducts.slice(0, 1)));

      const { result, rerender } = renderHook(
        ({ categoryId, searchParam }) =>
          GetProductsInfinite(20, 'mostRecent', categoryId, searchParam),
        {
          wrapper: createWrapper(),
          initialProps: { categoryId: '1', searchParam: null as string | null },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts, total: '100' },
      ]);

      rerender({ categoryId: '2', searchParam: 'test' as string | null });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        { items: mockProducts.slice(0, 1), total: '100' },
      ]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Format', () => {
    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([
        {
          items: [],
          total: '100',
        },
      ]);
      expect(result.current.hasNextPage).toBe(false);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toEqual([{ items: [], total: '100' }]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed product data', async () => {
      const malformedData = [
        { id: 1 },
        { name: 'No ID' },
        { id: 3, name: 'Valid', price: 100 },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => GetProductsInfinite(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Server only filters by stock, malformed data passes through
      expect(result.current.data?.pages).toEqual([
        { items: malformedData, total: '100' },
      ]);
    });

    it('should handle special characters in search parameter', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent', null, 'chair & table'),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&name_like=chair+%26+table`,
      );
    });

    it('should handle very long search parameter', async () => {
      const longSearch = 'a'.repeat(1000);
      mockFetch.mockResolvedValueOnce(createMockResponse(mockProducts));

      const { result } = renderHook(
        () => GetProductsInfinite(20, 'mostRecent', null, longSearch),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}?_start=0&_end=20&_sort=createdAt&_order=desc&name_like=${encodeURIComponent(longSearch)}`,
      );
    });
  });
});
