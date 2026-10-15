import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';
import { QUERY_KEY } from '../constants/query-keys';

const fetchMainCategories = async (pageSize?: number) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.MAIN_CATEGORIES}`);
  if (pageSize) {
    url.searchParams.set('_limit', String(pageSize));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const GetMainCategories = (enabled = true, pageSize?: number) => {
  return useQuery({
    queryKey: QUERY_KEY.MAIN_CATEGORIES(pageSize),
    queryFn: () => fetchMainCategories(pageSize),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
