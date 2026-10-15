import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_ROUTES } from '../constants/api-routers';
import { API_ENDPOINT } from '../constants/env-variables';
import { QUERY_KEY } from '../constants/query-keys';

const fetchProducts = async (
  start = 0,
  end = 20,
  sortBy = 'createdAt',
  order: 'asc' | 'desc' = 'desc',
  categoryId?: string | null,
  searchParam?: string | null,
  subCategoryName?: string | null,
) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.PRODUCTS_WITH_STOCK}`);
  url.searchParams.set('_start', String(start));
  url.searchParams.set('_end', String(end));
  url.searchParams.set('_sort', String(sortBy));
  url.searchParams.set('_order', String(order));

  // If categoryId exists, filter the list of products by main category
  if (categoryId) {
    url.searchParams.set('mainCategoryId', String(categoryId));
  }

  // If subCategoryName exists and not 'All', filter by subcategory
  if (subCategoryName && subCategoryName !== 'All') {
    url.searchParams.set('subCategoryId', String(subCategoryName));
  }

  if (searchParam) {
    url.searchParams.set('name_like', searchParam);
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const items = await res.json();

  return {
    items: items || [],
    total: res.headers.get('X-Total-Count'),
  };
};

export const GetProducts = (
  start = 0,
  end = 20,
  mainCategoryId = '',
  enabled = true,
) => {
  return useQuery({
    queryKey: QUERY_KEY.PRODUCTS(start, end, mainCategoryId),
    queryFn: () =>
      fetchProducts(start, end, 'createdAt', 'desc', mainCategoryId),
    enabled,
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};

const mapSort = (
  position: string,
): { sortBy: 'createdAt' | 'price'; order: 'asc' | 'desc' } => {
  switch (position) {
    case 'lowToHigh':
      return { sortBy: 'price', order: 'asc' };
    case 'highToLow':
      return { sortBy: 'price', order: 'desc' };
    case 'mostRecent':
    default:
      return { sortBy: 'createdAt', order: 'desc' };
  }
};

const fetchProductsPage = async (
  pageIndex = 0,
  pageSize = 20,
  position = 'mostRecent',
  categoryId?: string | null,
  searchParam?: string | null,
  subCategoryName?: string | null,
) => {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const { sortBy, order } = mapSort(position);
  return fetchProducts(
    start,
    end,
    sortBy,
    order,
    categoryId,
    searchParam,
    subCategoryName,
  );
};

export const GetProductsInfinite = (
  pageSize = 20,
  position = 'mostRecent',
  categoryId?: string | null,
  searchParam?: string | null,
  subCategoryName?: string | null,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEY.PRODUCTS_INFINITE(
      pageSize,
      position,
      categoryId,
      searchParam,
      subCategoryName,
    ),
    queryFn: ({ pageParam = 0 }) =>
      fetchProductsPage(
        pageParam,
        pageSize,
        position,
        categoryId,
        searchParam,
        subCategoryName,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.items && lastPage.items.length === pageSize
        ? allPages.length
        : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
