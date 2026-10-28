import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/query-keys';
import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';

const fetchPaymentDetail = async (id: string) => {
  const res = await fetch(`${API_ENDPOINT}${API_ROUTES.PAYMENTS}${id}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useGetPaymentDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEY.PAYMENT_DETAIL(id),
    queryFn: () => fetchPaymentDetail(id),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
