import { createElement, type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetCartProducts } from './cart-products';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    PRODUCTS: '/products/',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const createMockResponse = (data: unknown, status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  }) as Response;

const createProduct = (id: number) => ({
  id,
  name: `Product ${id}`,
  price: id * 10,
  variants: [],
});

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };

describe('useGetCartProducts', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return every product when all requests succeed', async () => {
    mockFetch.mockImplementation(async (url) =>
      createMockResponse(createProduct(Number(String(url).split('/').pop()))),
    );

    const { result } = renderHook(() => useGetCartProducts([1, 2]), {
      wrapper: createWrapper(createQueryClient()),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data.map((product) => product.id)).toEqual([1, 2]);
    expect(result.current.isError).toBe(false);
  });

  it('should fetch a product only once when it is in the cart twice', async () => {
    mockFetch.mockResolvedValue(createMockResponse(createProduct(1)));

    const { result } = renderHook(() => useGetCartProducts([1, 1]), {
      wrapper: createWrapper(createQueryClient()),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result.current.data).toHaveLength(1);
  });

  it('should share the product detail cache when the product page already loaded it', async () => {
    const client = createQueryClient();
    client.setQueryData(['product', '1'], createProduct(1));

    const { result } = renderHook(() => useGetCartProducts([1]), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.data[0].id).toBe(1);
  });

  it('should stay pending when only some products have loaded', async () => {
    mockFetch.mockImplementation((url) =>
      String(url).endsWith('/1')
        ? Promise.resolve(createMockResponse(createProduct(1)))
        : new Promise(() => {}),
    );

    const { result } = renderHook(() => useGetCartProducts([1, 2]), {
      wrapper: createWrapper(createQueryClient()),
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(result.current.isPending).toBe(true);
  });

  it('should not be pending when the cart is empty', () => {
    const { result } = renderHook(() => useGetCartProducts([]), {
      wrapper: createWrapper(createQueryClient()),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('should report an error when a product is not found', async () => {
    mockFetch.mockResolvedValue(createMockResponse({}, 404));
    const client = createQueryClient();

    const { result } = renderHook(() => useGetCartProducts([1]), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(client.getQueryState(['product', '1'])?.error?.message).toBe(
      'Product not found',
    );
  });

  it('should load the product when refetch is called after a failure', async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({}, 500));

    const { result } = renderHook(() => useGetCartProducts([1]), {
      wrapper: createWrapper(createQueryClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    mockFetch.mockResolvedValueOnce(createMockResponse(createProduct(1)));
    act(() => result.current.refetch());

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(result.current.data[0].id).toBe(1);
  });
});
