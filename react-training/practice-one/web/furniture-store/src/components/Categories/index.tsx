import { GetMainCategories } from '../../apis/main-categories';
import CategoryItem from './CategoryItem';
import { Skeleton } from '../ui/skeleton';

interface CategoryInterface {
  id: number;
  name: string;
  image: {
    url: string;
    alt: string;
  };
}

const Categories = () => {
  const {
    data: categories,
    isPending,
    isError,
    error,
  } = GetMainCategories(true, 4);

  if (isPending) {
    const fakeMainCategoriesItems = Array.from({ length: 4 });

    return (
      <div className="mt-6 md:mt-12 container">
        <p className="text-left text-xl font-bold mb-2 md:mb-5 md:text-4xl">
          Categories
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {fakeMainCategoriesItems.map((_, index) => {
            const isLarge =
              index === 0 || index === fakeMainCategoriesItems.length - 1;
            return (
              <div
                key={index}
                className={`flex justify-between gap-4 h-43 md:h-75 p-4 rounded-xl bg-muted/30
                  ${
                    isLarge
                      ? 'md:col-span-2 md:items-center'
                      : 'md:flex-col-reverse md:items-center md:justify-around lg:justify-between lg:items-end lg:flex-row lg:pb-8'
                  }
                `}
              >
                <div
                  className={`flex w-1/2 ${isLarge ? 'md:w-2/5 md:ml-4 items-center lg:items-start' : 'md:w-3/5 items-center'}  md:flex-col`}
                >
                  <Skeleton className="h-6 w-full md:w-2/3" />
                  <Skeleton className="h-10 rounded-3xl w-full hidden md:block mt-4 md:w-2/3" />
                </div>
                <Skeleton
                  className={`rounded-xl w-1/2 py-2 md:py-0
                    ${isLarge ? 'h-32 md:h-64 md:w-3/5' : 'h-32 md:w-38 lg:w-52'}
                  `}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 md:mt-12 container">
        <p className="text-left text-xl font-bold mb-2 md:mb-5 md:text-4xl">
          Categories
        </p>
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 md:mt-12 container">
      <p className="text-left text-xl font-bold mb-2 md:mb-5 md:text-4xl">
        Categories
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category: CategoryInterface, index: number) => (
          <CategoryItem
            key={category.id}
            id={category.id}
            name={category.name}
            imageUrl={category.image.url}
            imageAlt={category.image.alt}
            className={
              index === 0 || index === categories.length - 1
                ? 'md:col-span-2 md:flex-row md:justify-between md:pl-10'
                : 'md:justify-center lg:justify-around lg:items-end lg:pb-8'
            }
            imageClassName={
              index === 0 || index === categories.length - 1
                ? 'md:w-auto md:h-full'
                : 'md:w-38 lg:w-52'
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
