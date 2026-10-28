import Image from '../common/Image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';
import type { ImageInterface } from '../../interfaces/image';

interface ProductImageGalleryProps {
  images: ImageInterface[];
}

const ProductImageGallery = ({ images }: ProductImageGalleryProps) => {
  const displayImages = images?.slice(0, 3) || [];

  return (
    <>
      {/* Mobile carousel */}
      <div className="flex justify-center mt-4 bg-background-primary py-4 md:hidden">
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {displayImages.map((item: ImageInterface, index: number) => (
              <CarouselItem key={index}>
                <div className="aspect-square w-full flex items-center justify-center">
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width="320"
                    height="320"
                    className="w-full h-full object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    sizes="(max-width: 768px) 320px, 320px"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop/Tablet grid */}
      <div className="hidden md:grid grid-cols-1 gap-4 w-full">
        {displayImages.map((item: ImageInterface, index: number) => (
          <div
            key={index}
            className="w-full h-auto md:min-h-90 lg:min-h-150 flex justify-center items-center bg-background-primary"
          >
            <Image
              src={item.url}
              alt={item.alt}
              className="object-contain"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductImageGallery;
