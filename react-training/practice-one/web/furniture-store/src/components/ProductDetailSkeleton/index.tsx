import { Skeleton } from '../ui/skeleton';
import BreadcrumbComponent from '../common/Breadcrumb';
import PeopleViewed from '../PeopleViewed';

const ProductDetailSkeleton = () => {
  return (
    <div className="mt-12">
      <BreadcrumbComponent
        className="container"
        items={[
          { label: 'Homepage', href: '/' },
          { label: <Skeleton className="h-4 w-24" /> },
          { label: <Skeleton className="h-4 w-32" />, isCurrentPage: true },
        ]}
      />

      <div className="container mt-4 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:gap-7">
          <div className="flex justify-center mt-4 bg-background-primary py-4 md:hidden">
            <div className="w-full max-w-xs aspect-square">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          <div className="hidden md:grid grid-cols-1 gap-4 w-full">
            <Skeleton className="w-full h-90 lg:h-150" />
            <Skeleton className="w-full h-90 lg:h-150" />
            <Skeleton className="w-full h-90 lg:h-150" />
          </div>

          <div className="md:ml-4 mt-4 md:mt-0 text-left">
            <Skeleton className="h-8 w-3/4 mb-4" />

            <div className="flex items-center mt-2">
              <Skeleton className="h-4 w-20 mr-4" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex mt-4 items-center">
              <Skeleton className="h-8 w-24 mr-3" />
              <Skeleton className="h-6 w-20 mr-3" />
              <Skeleton className="h-6 w-12" />
            </div>

            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-10 flex justify-between">
              <div className="flex">
                <Skeleton className="h-12 w-12 mr-3 rounded-2xl" />
                <Skeleton className="h-12 w-12 mr-3 rounded-2xl" />
                <Skeleton className="h-12 w-12 mr-3 rounded-2xl" />
              </div>
              <Skeleton className="h-12 w-12 mr-4 rounded-2xl" />
            </div>

            <div className="mt-10 w-full">
              <Skeleton className="w-full h-16 rounded-3xl" />
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PeopleViewed />
    </div>
  );
};

export default ProductDetailSkeleton;
