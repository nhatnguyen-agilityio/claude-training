import { useQuery } from '@tanstack/react-query';
import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';
import { QUERY_KEY } from '../constants/query-keys';

const fetchSubCategories = async (mainCategoryId?: string | null) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.SUB_CATEGORIES}`);
  if (mainCategoryId) {
    url.searchParams.set('mainCategoryId', String(mainCategoryId));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export const GetSubCategories = (
  mainCategoryId?: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: QUERY_KEY.SUB_CATEGORIES(mainCategoryId || null),
    queryFn: () => fetchSubCategories(mainCategoryId),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
