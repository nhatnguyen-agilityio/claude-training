import { useQueries } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/query-keys';
import type { ProductInterface } from '../interfaces/products';
import { fetchProductDetail } from './product-detail';

export const useGetCartProducts = (productIds: number[]) => {
  // The same product can be in the cart more than once (one row per variant)
  const uniqueProductIds = [...new Set(productIds)];

  return useQueries({
    queries: uniqueProductIds.map((id) => ({
      // Same key as the product page, so both share one cached request
      queryKey: QUERY_KEY.PRODUCT_DETAIL(String(id)),
      queryFn: (): Promise<ProductInterface> => fetchProductDetail(String(id)),
      staleTime: 1000 * 60 * 5,
    })),
    combine: (results) => ({
      data: results
        .map((result) => result.data)
        .filter((product): product is ProductInterface => !!product),
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
      refetch: () => {
        results
          .filter((result) => result.isError)
          .forEach((result) => result.refetch());
      },
    }),
  });
};
