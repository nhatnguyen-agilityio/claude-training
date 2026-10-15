import { useState, useCallback, type MouseEvent, useEffect } from 'react';
import { Check, Box, Sprout } from 'lucide-react';
import Image from '../common/Image';
import Button from '../common/Button';
import { Input } from '../ui/input';
import { useSearchParams } from 'react-router-dom';
import type { ProductVariant } from '../../interfaces/products';

interface ProductInfoProps {
  name: string;
  rating: { average: number };
  price: number;
  basePrice: number;
  description: string;
  variants: ProductVariant[];
  userId?: string;
  isLoading?: boolean;
  onAddToCart: (variantId: number, quantity: number) => void;
}

const ProductInfo = ({
  name,
  rating,
  price,
  basePrice,
  description,
  variants,
  userId,
  isLoading = false,
  onAddToCart,
}: ProductInfoProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const variantIdParam = searchParams.get('variantId');

  // Find the initial selected index based on URL parameter
  const getInitialSelectedIndex = () => {
    if (variantIdParam) {
      const index = variants.findIndex(v => v.id === Number(variantIdParam));
      return index !== -1 ? index : 0;
    }
    return 0;
  };

  const [selected, setSelected] = useState<number>(getInitialSelectedIndex());
  const [selectedVariantId, setSelectedVariantId] = useState<number>(
    variants[selected]?.id || variants[0]?.id || 0,
  );
  const [quantity, setQuantity] = useState<number | string>(1);

  // Sync with URL when variantIdParam changes
  useEffect(() => {
    if (variantIdParam) {
      const index = variants.findIndex(v => v.id === Number(variantIdParam));
      if (index !== -1) {
        setSelected(index);
        setSelectedVariantId(variants[index].id);
      }
    }
  }, [variantIdParam, variants]);

  const handleAddToCartClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (selectedVariantId) {
        onAddToCart(selectedVariantId, Number(quantity));
      }
    },
    [onAddToCart, selectedVariantId, quantity],
  );

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setQuantity('');
      return;
    }

    const numValue = Number(inputValue);
    if (isNaN(numValue)) return;

    const maxStock = variants[selected]?.stock || 100;
    const newQuantity = numValue > maxStock ? maxStock : numValue;
    setQuantity(newQuantity);
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || Number(quantity) <= 0) {
      setQuantity(1);
    }
  };

  return (
    <div className="md:ml-4 mt-4 md:mt-0 text-left">
      <h2 className="text-2xl font-semibold md:text-2xl lg:text-3xl">{name}</h2>

      <div className="flex items-center mt-2">
        <Image
          src="https://ucarecdn.com/6d4896c2-5d21-4d7c-ae54-fa89f9f73410/-/format/auto/"
          alt="Rate Stars"
        />
        <p className="text-sm ml-4 font-light">{rating.average}</p>
      </div>

      <div className="flex mt-4 items-center">
        <p className="text-app-primary font-semibold text-2xl mr-3">
          {`$${price}`}
        </p>
        <p className="text-gray-500 line-through mr-3">{`$${basePrice}`}</p>
        <p className="py-1 px-3 bg-red-50 rounded-4xl text-red-700">-40%</p>
        <p className="ml-3 font-medium">
          In stock: {variants[selected]?.stock || 0}
        </p>
      </div>

      <p className="mt-4 md:text-lg lg:text-xl font-light">{description}</p>

      <div className="mt-10 flex justify-between">
        <div className="flex">
          {variants.map((item: ProductVariant, index: number) => (
            <div
              key={index}
              onClick={() => {
                setSelected(index);
                setSelectedVariantId(item.id);

                // Update URL with selected variant
                const newParams = new URLSearchParams(searchParams);
                newParams.set('variantId', String(item.id));
                setSearchParams(newParams);
              }}
              className="h-12 w-12 mr-3 rounded-2xl flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: item.hex }}
            >
              {selected === index ? (
                <Check className="text-white font-bold" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="h-12 w-12 mr-4">
          <Input
            aria-label="Quantity"
            type="number"
            min={1}
            max={variants[selected]?.stock || 100}
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            className="bg-background-primary rounded-2xl h-full p-0 text-center lg:pl-3"
          />
        </div>
      </div>

      <div className="mt-10 w-full">
        <Button
          variant={'outline'}
          onClick={handleAddToCartClick}
          disabled={isLoading || !userId}
          className="w-full py-3 bg-app-primary hover:bg-app-tertiary hover:text-white border-none rounded-3xl text-white font-light text-xl [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
        >
          {!userId
            ? 'Sign in to add item to cart'
            : isLoading
              ? 'Adding to cart...'
              : 'Add to cart'}
        </Button>
      </div>

      <div>
        <div className="flex mt-12">
          <Box className="mr-2" />
          <p>Free shipping included</p>
        </div>
        <div className="flex mt-8">
          <Sprout className="mr-2" />
          <p>Made from the best of materials sourced</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
