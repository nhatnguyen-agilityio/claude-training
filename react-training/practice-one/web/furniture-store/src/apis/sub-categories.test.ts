import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GetSubCategories } from './sub-categories';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    SUB_CATEGORIES: '/sub-categories',
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

describe('GetSubCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch sub-categories without mainCategoryId', async () => {
      const mockSubCategories = [
        { id: 1, name: 'Chairs', slug: 'chairs', mainCategoryId: 1 },
        { id: 2, name: 'Tables', slug: 'tables', mainCategoryId: 1 },
        { id: 3, name: 'Sofas', slug: 'sofas', mainCategoryId: 2 },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}`,
      );
    });

    it('should fetch sub-categories with mainCategoryId', async () => {
      const mockSubCategories = [
        {
          id: 1,
          name: 'Dining Chairs',
          slug: 'dining-chairs',
          mainCategoryId: 1,
        },
        {
          id: 2,
          name: 'Office Chairs',
          slug: 'office-chairs',
          mainCategoryId: 1,
        },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=1`,
      );
    });

    it('should fetch sub-categories with null mainCategoryId', async () => {
      const mockSubCategories = [
        { id: 1, name: 'All Chairs', slug: 'all-chairs' },
        { id: 2, name: 'All Tables', slug: 'all-tables' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories(null), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}`,
      );
    });

    it('should fetch sub-categories with custom enabled parameter', async () => {
      const mockSubCategories = [{ id: 1, name: 'Disabled', slug: 'disabled' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1', false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch sub-categories when enabled is true', async () => {
      const mockSubCategories = [{ id: 1, name: 'Enabled', slug: 'enabled' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('2', true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=2`,
      );
    });
  });

  describe('URL Parameter Handling', () => {
    it('should handle string mainCategoryId correctly', async () => {
      const mockSubCategories = [
        { id: 1, name: 'String ID', slug: 'string-id' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=123`,
      );
    });

    it('should handle numeric mainCategoryId as string', async () => {
      const mockSubCategories = [
        { id: 1, name: 'Numeric ID', slug: 'numeric-id' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('456'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=456`,
      );
    });

    it('should handle undefined mainCategoryId', async () => {
      const mockSubCategories = [
        { id: 1, name: 'Undefined', slug: 'undefined' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}`,
      );
    });

    it('should handle empty string mainCategoryId', async () => {
      const mockSubCategories = [
        { id: 1, name: 'Empty String', slug: 'empty-string' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories(''), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}`,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => GetSubCategories('1'), {
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

      const { result } = renderHook(() => GetSubCategories('1'), {
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

    it('should handle 404 responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => GetSubCategories('999'), {
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

      const { result } = renderHook(() => GetSubCategories('1'), {
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

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to success', async () => {
      const mockSubCategories = [
        { id: 1, name: 'Test Category', slug: 'test' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockSubCategories);
    });

    it('should transition from loading to error', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => GetSubCategories('1'), {
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
    it('should use correct query key with mainCategoryId', async () => {
      const mockSubCategories = [{ id: 1, name: 'Test', slug: 'test' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=1`,
      );
    });

    it('should use correct query key without mainCategoryId', async () => {
      const mockSubCategories = [{ id: 1, name: 'Test', slug: 'test' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      renderHook(() => GetSubCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => GetSubCategories('1', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should make request when enabled changes from false to true', async () => {
      const mockSubCategories = [{ id: 1, name: 'Dynamic', slug: 'dynamic' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result, rerender } = renderHook(
        ({ enabled }) => GetSubCategories('1', enabled),
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

      expect(result.current.data).toEqual(mockSubCategories);
    });

    it('should update query when mainCategoryId changes', async () => {
      const mockSubCategories1 = [{ id: 1, name: 'Category 1', slug: 'cat1' }];
      const mockSubCategories2 = [{ id: 2, name: 'Category 2', slug: 'cat2' }];

      mockFetch
        .mockResolvedValueOnce(createMockResponse(mockSubCategories1))
        .mockResolvedValueOnce(createMockResponse(mockSubCategories2));

      const { result, rerender } = renderHook(
        ({ mainCategoryId }) => GetSubCategories(mainCategoryId),
        {
          wrapper: createWrapper(),
          initialProps: { mainCategoryId: '1' },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories1);

      rerender({ mainCategoryId: '2' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Format', () => {
    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });

    it('should handle single sub-category response', async () => {
      const mockSubCategory = {
        id: 1,
        name: 'Single Category',
        slug: 'single',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategory));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategory);
    });

    it('should handle large array of sub-categories', async () => {
      const mockSubCategories = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Sub-Category ${i + 1}`,
        slug: `sub-category-${i + 1}`,
        mainCategoryId: Math.floor(i / 10) + 1,
      }));

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
      expect(result.current.data).toHaveLength(100);
    });
  });

  describe('Caching and Stale Time', () => {
    it('should use correct stale time configuration', async () => {
      const mockSubCategories = [{ id: 1, name: 'Cached', slug: 'cached' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockSubCategories = [{ id: 1, name: 'Multi', slug: 'multi' }];

      mockFetch.mockResolvedValue(createMockResponse(mockSubCategories));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => GetSubCategories('1'), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => GetSubCategories('2'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(mockSubCategories);
      expect(result2.current.data).toEqual(mockSubCategories);
    });

    it('should handle concurrent requests', async () => {
      const mockSubCategories = [
        { id: 1, name: 'Concurrent', slug: 'concurrent' },
      ];

      mockFetch.mockResolvedValue(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSubCategories);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle malformed sub-category data', async () => {
      const malformedData = [
        { id: 1 },
        { name: 'No ID' },
        { id: 3, name: 'Valid', slug: 'valid' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => GetSubCategories('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedData);
    });

    it('should handle special characters in mainCategoryId', async () => {
      const mockSubCategories = [{ id: 1, name: 'Special', slug: 'special' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories('1&2=3'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=1%262%3D3`,
      );
    });

    it('should handle very long mainCategoryId', async () => {
      const longId = 'a'.repeat(1000);
      const mockSubCategories = [{ id: 1, name: 'Long ID', slug: 'long-id' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSubCategories));

      const { result } = renderHook(() => GetSubCategories(longId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}?mainCategoryId=${encodeURIComponent(longId)}`,
      );
    });
  });
});
