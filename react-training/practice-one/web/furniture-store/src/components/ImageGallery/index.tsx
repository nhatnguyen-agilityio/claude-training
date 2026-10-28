import Image from '../common/Image';
import ShowMore from '../common/ShowMore';
import CategoryButtons from '../CategoryButtons';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { CATEGORY_LIST } from '../../constants/category';

const images = [
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 10,
    desktopSpan: 10,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 5,
    desktopSpan: 5,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 10,
    desktopSpan: 10,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 5,
    desktopSpan: 10,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 10,
    desktopSpan: 5,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 5,
    desktopSpan: 10,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 10,
    desktopSpan: 10,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 5,
    desktopSpan: 10,
  },
  {
    src: 'https://ucarecdn.com/95ff3f50-97fb-4954-b2d5-87ffc702c62f/-/format/auto/',
    mobileSpan: 10,
    desktopSpan: 5,
  },
];

const ImageGallery = () => {
  const [selectedItem, setSelectedItem] = useState('All');

  return (
    <div className="mt-10 container">
      <h2 className="font-bold text-xl md:text-4xl text-left">
        Design inspiration and modern home ideas
      </h2>
      <CategoryButtons
        buttonList={CATEGORY_LIST}
        selectedCategory={selectedItem}
        onCategorySelect={setSelectedItem}
      />
      <div className="mx-auto py-6">
        <div className="grid grid-cols-2 grid-rows-4 md:grid-cols-3 gap-3 auto-rows-[10px] md:hidden">
          {images.slice(0, 8).map((img, i) => (
            <Card
              key={i}
              className={`overflow-hidden rounded-none shadow-none border-none py-0`}
            >
              <Image
                src={img.src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </Card>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-2 grid-rows-3 md:grid-cols-3 gap-4 auto-rows-[20px]">
          {images.map((img, i) => (
            <Card
              key={i}
              className={`overflow-hidden rounded-none border-none shadow-none py-0`}
            >
              <Image
                src={img.src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-8 md:w-1/2 mx-auto">
        <p>Showing {images.length} of 100 results</p>
        <Progress value={9} className="mt-6 h-1" aria-label="Progress" />
        <ShowMore
          onClick={() => {
            toast(
              'This feature is currently in development and will be available soon.',
            );
          }}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default ImageGallery;
