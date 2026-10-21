import { useQueries } from '@tanstack/react-query';
import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';
import type { ProductInterface } from '../interfaces/products';

const fetchCartProduct = async (id: number): Promise<ProductInterface> => {
  const res = await fetch(`${API_ENDPOINT}${API_ROUTES.PRODUCTS}${id}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useGetCartProducts = (productIds: number[]) => {
  return useQueries({
    queries: productIds.map((id) => ({
      queryKey: ['product', id],
      queryFn: () => fetchCartProduct(id),
      staleTime: 1000 * 60 * 5,
    })),
    combine: (results) => ({
      data: results
        .map((result) => result.data)
        .filter((product): product is ProductInterface => !!product),
      isPending: results.every((result) => result.isPending),
      isError: results.some((result) => result.isError),
    }),
  });
};
