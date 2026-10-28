import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/query-keys';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';

const fetchPayment = async (
  userId: number,
  sortBy = 'createdAt',
  order: 'asc' | 'desc' = 'desc',
) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.PAYMENTS}`);
  url.searchParams.set('_sort', String(sortBy));
  url.searchParams.set('_order', String(order));
  if (userId) {
    url.searchParams.set('userId', String(userId));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useGetPayment = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEY.PAYMENT(userId),
    queryFn: () => fetchPayment(userId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
