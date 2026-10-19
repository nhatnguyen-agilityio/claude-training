// Template: hook test. Put it next to the hook as apis/<same-name>.test.ts.
// Replace: RESOURCE, './resource-file', useGetResource, mock data.
// For a mutation, call result.current.mutate(payload) and assert on
// mockFetch's body and on the invalidated QUERY_KEY (see apis/add-cart.test.ts).
import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetResource } from './resource-file';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    RESOURCE: '/resource',
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
    status: ok ? 200 : 500,
    json: async () => data,
  }) as Response;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

const mockData = [{ id: 1, userId: 1 }];

describe('useGetResource', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data when the request succeeds', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse(mockData));

    const { result } = renderHook(() => useGetResource(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_ENDPOINT}${API_ROUTES.RESOURCE}?_sort=createdAt&_order=desc&userId=1`,
    );
  });

  it('should not fetch when enabled is false', () => {
    renderHook(() => useGetResource(1, false), { wrapper: createWrapper() });

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({}, false));

    const { result } = renderHook(() => useGetResource(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network response was not ok');
  });

  it('should return an error when the network request fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGetResource(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });
});
