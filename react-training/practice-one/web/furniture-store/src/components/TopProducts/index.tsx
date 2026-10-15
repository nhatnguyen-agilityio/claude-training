import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetProductsInfinite } from '../../apis/products';
import type { ProductInterface } from '../../interfaces/products';
import ShowMore from '../common/ShowMore';
import FilterDropdown from '../FilterDropdown';
import ProductItem from '../ProductItem';
import { Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

const TopProducts = ({
  categoryId,
  searchProducts = '',
  subCategoryName = 'All',
}: {
  categoryId?: string | null;
  searchProducts?: string | null;
  subCategoryName?: string;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const position = searchParams.get('sort') || 'mostRecent';
  const pageParam = searchParams.get('topProductsPage');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const setPosition = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'mostRecent') {
      newParams.delete('sort');
    } else {
      newParams.set('sort', value);
    }
    // Reset page when changing sort
    newParams.delete('topProductsPage');
    setSearchParams(newParams);
  };

  const pageSize = 20;
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetProductsInfinite(
    pageSize,
    position,
    categoryId,
    searchProducts,
    subCategoryName,
  );

  // Fetch pages up to the stored page number on mount/when filters change
  useEffect(() => {
    if (data && currentPage > 1) {
      const currentLoadedPages = data.pages.length;
      // Fetch additional pages if needed to reach the stored page number
      if (currentLoadedPages < currentPage && hasNextPage) {
        fetchNextPage();
      }
    }
  }, [data, currentPage, hasNextPage, fetchNextPage]);

  const items: ProductInterface[] = useMemo(() => {
    return data?.pages?.flatMap((page) => page.items) ?? [];
  }, [data]);

  const total = useMemo(() => {
    return Number(data?.pages?.[0]?.total) || 0;
  }, [data]);

  if (isPending) {
    return (
      <div className="mt-6 md:mt-12 container">
        <div className="flex flex-col md:flex-row md:justify-between">
          <p className="text-left text-xl md:text-4xl font-bold mb-4 my-auto">
            Top Products
          </p>
          <div className="flex justify-start">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="mt-6">
              <div className="bg-background-primary min-h-48 md:min-h-78 flex items-center relative">
                <Skeleton className="w-3/5 h-40 md:h-56 mx-auto" />
              </div>
              <div className="flex justify-between items-center my-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-7 w-16 rounded-2xl" />
              </div>
              <div className="flex">
                <Skeleton className="w-7 h-7 mr-4 rounded-full" />
                <Skeleton className="w-7 h-7 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 md:w-1/2 mx-auto">
          <div>
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="mt-6 h-1 w-full" />
          <div className="mt-6 flex justify-center">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 md:mt-12 container">
        <p className="text-left text-xl font-bold mb-2 md:mb-5 md:text-4xl">
          Products
        </p>
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <div className="mt-6 md:mt-12 container">
          <p className="text-left text-xl font-bold mb-2 md:mb-5 md:text-4xl">
            Top Products
          </p>
        </div>
        <div className="mt-8 md:w-1/2 mx-auto min-h-96 flex items-center px-5 justify-center">
          <p className="text-center text-xl font-medium">
            No products found. Try adjusting your filters or search
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="mt-6 md:mt-12 container">
      <div className="flex flex-col md:flex-row md:justify-between">
        <p className="text-left text-xl md:text-4xl font-bold mb-4 my-auto">
          Top Products
        </p>
        <div className="flex justify-start">
          <FilterDropdown position={position} setPosition={setPosition} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {items.map((product: ProductInterface) => {
          const firstVariant = product.variants && product.variants[0];
          const firstImage =
            firstVariant && firstVariant.images && firstVariant.images[0];
          if (!firstVariant || !firstImage) return null;
          return (
            <ProductItem
              key={product.id}
              id={product.id}
              variantId={firstVariant.id}
              name={product.name}
              price={product.price}
              imageUrl={firstImage.url}
              imageAlt={firstImage.alt}
              variantColor={firstVariant.hex}
              stock={firstVariant.stock}
            />
          );
        })}
      </div>
      <div className="mt-8 md:w-1/2 mx-auto">
        <p>
          Showing {items.length} of {total} results
        </p>
        <Progress
          value={hasNextPage ? (items.length / total) * 100 : 100}
          className="mt-6 h-1"
          aria-label="Progress"
        />
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 my-4 justify-center">
            <Loader2 className="h-8 w-8 text-app-primary animate-spin" />
            <p className="text-app-primary">Loading more...</p>
          </div>
        )}
        <ShowMore
          onClick={() => {
            fetchNextPage();
            const newParams = new URLSearchParams(searchParams);
            const nextPage = (data?.pages.length || 0) + 1;
            newParams.set('topProductsPage', String(nextPage));
            setSearchParams(newParams);
          }}
          disabled={!hasNextPage || isFetchingNextPage}
        />
      </div>
    </div>
  );
};

export default TopProducts;
