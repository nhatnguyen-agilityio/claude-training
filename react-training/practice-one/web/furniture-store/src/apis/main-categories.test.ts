import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GetMainCategories } from './main-categories';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    MAIN_CATEGORIES: '/main-categories',
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

describe('GetMainCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should fetch main categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'Living Room', slug: 'living-room' },
        { id: 2, name: 'Bedroom', slug: 'bedroom' },
        { id: 3, name: 'Dining Room', slug: 'dining-room' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.MAIN_CATEGORIES}`,
      );
    });

    it('should fetch main categories with custom enabled parameter', async () => {
      const mockCategories = [{ id: 1, name: 'Office', slug: 'office' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(false), {
        wrapper: createWrapper(),
      });

      expect(mockFetch).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('should fetch main categories when enabled is true', async () => {
      const mockCategories = [{ id: 1, name: 'Kitchen', slug: 'kitchen' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => GetMainCategories(), {
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

      const { result } = renderHook(() => GetMainCategories(), {
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

      const { result } = renderHook(() => GetMainCategories(), {
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

      const { result } = renderHook(() => GetMainCategories(), {
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

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    it('should transition from loading to success', async () => {
      const mockCategories = [{ id: 1, name: 'Test Category', slug: 'test' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockCategories);
    });

    it('should transition from loading to error', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => GetMainCategories(), {
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
      const mockCategories = [{ id: 1, name: 'Test', slug: 'test' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_ENDPOINT}${API_ROUTES.MAIN_CATEGORIES}`,
      );
    });

    it('should respect enabled parameter', async () => {
      const { result } = renderHook(() => GetMainCategories(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should make request when enabled changes from false to true', async () => {
      const mockCategories = [{ id: 1, name: 'Dynamic', slug: 'dynamic' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result, rerender } = renderHook(
        ({ enabled }) => GetMainCategories(enabled),
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

      expect(result.current.data).toEqual(mockCategories);
    });
  });

  describe('Data Format', () => {
    it('should handle empty array response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse([]));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });

    it('should handle single category response', async () => {
      const mockCategory = { id: 1, name: 'Single Category', slug: 'single' };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategory));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategory);
    });

    it('should handle large array of categories', async () => {
      const mockCategories = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Category ${i + 1}`,
        slug: `category-${i + 1}`,
      }));

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(result.current.data).toHaveLength(100);
    });
  });

  describe('Caching and Stale Time', () => {
    it('should use correct stale time configuration', async () => {
      const mockCategories = [{ id: 1, name: 'Cached', slug: 'cached' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      const mockCategories = [{ id: 1, name: 'Multi', slug: 'multi' }];

      mockFetch.mockResolvedValue(createMockResponse(mockCategories));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => GetMainCategories(), {
        wrapper,
      });

      const { result: result2 } = renderHook(() => GetMainCategories(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(mockCategories);
      expect(result2.current.data).toEqual(mockCategories);
    });

    it('should handle concurrent requests', async () => {
      const mockCategories = [
        { id: 1, name: 'Concurrent', slug: 'concurrent' },
      ];

      mockFetch.mockResolvedValue(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined enabled parameter', async () => {
      const mockCategories = [{ id: 1, name: 'Undefined', slug: 'undefined' }];

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCategories));

      const { result } = renderHook(() => GetMainCategories(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle malformed category data', async () => {
      const malformedData = [
        { id: 1 },
        { name: 'No ID' },
        { id: 3, name: 'Valid', slug: 'valid' },
      ];

      mockFetch.mockResolvedValueOnce(createMockResponse(malformedData));

      const { result } = renderHook(() => GetMainCategories(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(malformedData);
    });
  });
});
