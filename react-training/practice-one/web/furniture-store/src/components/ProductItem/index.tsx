import { ArrowRight } from 'lucide-react';
import Image from '../common/Image';
import Button from '../common/Button';
import { toast } from 'sonner';
import { memo, useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAddCart } from '../../apis/add-cart';

const ProductItem = ({
  id,
  variantId,
  name,
  price,
  imageUrl,
  imageAlt,
  variantColor,
  stock,
}: {
  id: number;
  variantId: number;
  name: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  variantColor?: string;
  stock?: number;
}) => {
  const { user } = useAuth();

  const { mutate, isLoading } = useAddCart();

  const handleAddToCart = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user?.id) return;

      const cartPayload = {
        userId: user.id,
        item: {
          productId: id,
          variantId: variantId,
          quantity: 1,
        },
      };
      mutate(cartPayload, {
        onSuccess: () => {
          toast(`Product ${name} has been added to your cart`, {
            className: 'text-left',
          });
        },
        onError: (error: unknown) => {
          if (
            (error as { message?: string })?.message === 'Insufficient stock'
          ) {
            const availableStock = stock || 0;
            toast.error(
              `Sorry, only ${availableStock} item(s) available in stock for ${name}. Please help check to your cart`,
              {
                className: 'text-left',
              },
            );
          } else {
            toast('Failed to add product to cart. Please try again.', {
              className: 'text-left',
            });
          }
        },
      });
    },
    [id, name, mutate, user?.id, variantId, stock],
  );

  return (
    <div className="mt-6 max-w-85">
      <Link to={`/products/${id}`}>
        <div className="bg-background-primary min-h-48 md:min-h-78 flex items-center relative group hover:bg-gray-200">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width="200"
            height="200"
            className="w-3/5 h-3/5 object-contain mx-auto"
            loading="lazy"
            sizes="(max-width: 768px) 200px, 250px"
          />
          {user && (
            <Button
              variant="outline"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="absolute ml-4 mb-1 bg-app-tertiary border-none rounded-3xl text-white font-semibold py-3 hover:text-white hover:bg-app-primary bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              {isLoading ? 'Adding...' : 'Add to cart'}
              <ArrowRight />
            </Button>
          )}
        </div>
        <div className="flex justify-between items-center my-2 font-bold">
          <p className="line-clamp-1 text-left">{name}</p>
          <p className="px-4 py-1 bg-background-primary rounded-2xl">{`$${price}`}</p>
        </div>
        <div className="flex">
          <div
            className="w-7 h-7 mr-4 rounded-full"
            style={{ backgroundColor: variantColor }}
          ></div>
        </div>
      </Link>
    </div>
  );
};

export default memo(ProductItem);
