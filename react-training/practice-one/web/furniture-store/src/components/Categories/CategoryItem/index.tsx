import { MoveRight } from 'lucide-react';
import Image from '../../common/Image';
import { Link } from 'react-router-dom';
import { memo } from 'react';

const CategoryItem = ({
  id,
  name,
  imageUrl,
  imageAlt,
  className = '',
  imageClassName = '',
}: {
  id: number;
  name: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
  imageClassName?: string;
}) => {
  return (
    <div
      className={`bg-background-primary w-full h-43 md:h-75 mb-2 flex justify-between md:flex-col-reverse md:items-center lg:flex-row ${className}`}
    >
      <div className="ml-7 md:ml-0 flex items-center md:flex-col">
        <p className="md:mt-2 text-xl font-semibold lg:text-4xl">{name}</p>
        <Link
          to={`/products?categoryId=${id}&categoryTitle=${name}`}
          aria-label={`${name} products`}
          className="hidden border-1 py-3 font-medium text-sm border-black rounded-4xl items-center mt-4 w-32 md:flex cursor-pointer bg-transparent hover:bg-gray-300 text-black justify-center min-h-[44px] min-w-[44px] gap-2 whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          Shop now
          <MoveRight className="inline-block w-4 h-4 font-semibold ml-2" />
        </Link>
      </div>
      <div className={`w-1/2 py-2 md:py-0 ${imageClassName}`}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default memo(CategoryItem);
