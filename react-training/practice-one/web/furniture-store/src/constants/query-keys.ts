export const QUERY_KEY = {
  MAIN_CATEGORIES: (pageSize?: number) => ['mainCategories', pageSize],
  SUB_CATEGORIES: (mainCategory: string | null) => [
    'subCategories',
    mainCategory,
  ],
  PRODUCTS: (start: number, end: number, mainCategoryId?: string) => [
    'products',
    start,
    end,
    mainCategoryId,
  ],
  PRODUCTS_INFINITE: (
    pageSize: number,
    position: string,
    categoryId?: string | null,
    searchParam?: string | null,
    subCategoryName?: string | null,
  ) => [
    'products',
    'infinite',
    pageSize,
    position,
    categoryId,
    searchParam,
    subCategoryName,
  ],
  PRODUCT_DETAIL: (id: string) => ['product', id],
  USER_CART: (userId: number) => ['cart', userId],
  PAYMENT: (userId: number) => ['payment', userId],
  PAYMENT_DETAIL: (id: string) => ['payment', id],
};
