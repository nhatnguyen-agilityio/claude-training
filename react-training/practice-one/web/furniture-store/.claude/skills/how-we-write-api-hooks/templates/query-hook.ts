// Template: query hook (reading data).
// Replace: RESOURCE (API_ROUTES / QUERY_KEY names), fetchResource, useGetResource, params.
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../constants/query-keys';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';

const fetchResource = async (userId: number) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.RESOURCE}`);
  url.searchParams.set('_sort', 'createdAt');
  url.searchParams.set('_order', 'desc');
  if (userId) {
    url.searchParams.set('userId', String(userId));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const useGetResource = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEY.RESOURCE(userId),
    queryFn: () => fetchResource(userId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
