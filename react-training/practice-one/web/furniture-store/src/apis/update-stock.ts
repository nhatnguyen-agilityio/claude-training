import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';

export interface StockUpdateInterface {
  variantId: number;
  quantity: number;
}

export interface StockUpdatePayloadInterface {
  items: StockUpdateInterface[];
}

const updateStock = async (stockPayload: StockUpdatePayloadInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.UPDATE_STOCK}`);
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stockPayload),
  });

  if (!res.ok) {
    let message = 'Failed to update stock';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    unknown,
    Error,
    StockUpdatePayloadInterface
  >({
    mutationFn: (stockPayload) => updateStock(stockPayload),
    onSuccess: () => {
      // Invalidate all product-related queries to refresh stock values
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.includes('products') || queryKey.includes('product');
        },
      });
    },
  });

  return {
    mutate,
    mutateAsync,
    ...rest,
    isLoading: isPending,
    error: error?.message || '',
  };
};
