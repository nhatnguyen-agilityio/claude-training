import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/query-keys';
import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';

const fetchProductDetail = async (id: string) => {
  const res = await fetch(`${API_ENDPOINT}${API_ROUTES.PRODUCTS}${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useGetProductDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEY.PRODUCT_DETAIL(id),
    queryFn: () => fetchProductDetail(id),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
