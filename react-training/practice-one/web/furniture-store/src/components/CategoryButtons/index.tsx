import { memo } from 'react';
import Button from '../common/Button';
import { CarouselNext, CarouselPrevious, CarouselItem, CarouselContent, Carousel } from '../ui/carousel';

const CategoryButtons = ({
  buttonList,
  selectedCategory,
  onCategorySelect,
}: {
  buttonList: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}) => {
  return (
    <div className="mt-4">
      <Carousel opts={{
          align: "start",
          slidesToScroll: "auto",
          containScroll: "trimSnaps",
        }}
        className="w-full px-10 md:px-11"
      >
        <CarouselContent className='ml-0'>
          {buttonList.map((item, index) => (
            <CarouselItem key={index} className="pl-0 pr-2 basis-auto shrink-0">
              <div>
                <Button
                  onClick={() => {
                    onCategorySelect(item);
                  }}
                  variant={'outline'}
                  className={`rounded-2xl py-2 px-4 text-sm text-black font-medium hover:bg-gray-300 border-none transition-colors ${
                    selectedCategory === item
                      ? 'bg-app-primary text-white hover:bg-app-primary hover:text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]'
                      : 'bg-background-primary hover:text-black'
                  }`}
                >
                  {item}
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 top-1/2 -translate-y-1/2 bg-white shadow-md" />
        <CarouselNext className="right-0 top-1/2 -translate-y-1/2 bg-white shadow-md" />
      </Carousel>
    </div>
  );
};

export default memo(CategoryButtons);
