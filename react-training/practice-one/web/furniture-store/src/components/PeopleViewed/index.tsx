import type { EmblaCarouselType } from 'embla-carousel';
import { memo, useEffect, useState } from 'react';
import ProductItem from '../ProductItem';
import type { ProductInterface } from '../../interfaces/products';
import { GetProducts } from '../../apis/products';
import { TriangleAlert } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { Progress } from '../ui/progress';

const PeopleViewed = ({
  categoryId = 1,
}: {
  categoryId?: number | undefined;
}) => {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const {
    data: listProducts,
    isPending,
    isError,
  } = GetProducts(0, 8, String(categoryId));

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(api.scrollSnapList().length);
    };

    update();
    api.on('select', update);

    return () => {
      api.off('select', update);
    };
  }, [api]);

  if (isPending) {
    return (
      <div className="container my-12">
        <div className="flex justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <div className="hidden mr-4 md:flex">
            <Skeleton className="w-8 h-8 mr-3" />
            <Skeleton className="w-8 h-8" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mt-6">
              <Skeleton className="bg-background-primary min-h-48 md:min-h-78 mb-4" />
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-2xl" />
              </div>
              <div className="flex">
                <Skeleton className="w-7 h-7 mr-4 rounded-full" />
                <Skeleton className="w-7 h-7 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="my-8 h-2 md:hidden" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container my-12">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold md:font-semibold">
            People Also Viewed
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center min-h-48 text-center">
          <div className="mb-4">
            <TriangleAlert className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">
            Failed to load recommended products
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-12">
      <Carousel setApi={(api) => setApi(api ?? null)} className="w-full">
        <div className="flex justify-between">
          <p className="text-xl md:text-2xl font-bold md:font-semibold">
            People Also Viewed
          </p>
          <div className="hidden mr-4 md:flex">
            <CarouselPrevious className="static translate-y-0 w-8 h-8 bg-background-primary border-none hover:bg-gray-300" />
            <CarouselNext className="static translate-y-0 w-8 h-8 ml-3 bg-background-primary border-none hover:bg-gray-300" />
          </div>
        </div>
        <div>
          <CarouselContent>
            {listProducts?.items?.map(
              (item: ProductInterface, index: number) => (
                <CarouselItem key={index} className="basis-1/2 lg:basis-1/4">
                  <ProductItem
                    key={item.id}
                    id={item.id}
                    variantId={item.variants[0]?.id}
                    name={item.name}
                    price={item.price}
                    imageUrl={item.variants[0]?.images[0].url}
                    imageAlt={item.variants[0]?.images[0].alt}
                    variantColor={item.variants[0]?.hex}
                    stock={item.variants[0]?.stock}
                  />
                </CarouselItem>
              ),
            )}
          </CarouselContent>
        </div>
      </Carousel>
      <Progress
        value={count > 0 ? (current / count) * 100 : 0}
        className="my-8 h-2 md:hidden"
        aria-label="Progress"
      />
    </div>
  );
};

export default memo(PeopleViewed);
