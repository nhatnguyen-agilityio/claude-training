import { Link } from 'react-router-dom';
import Image from '../common/Image';
import Button from '../common/Button';
import { TriangleAlert } from 'lucide-react';
import CartItem from './CartItem';
import { useAuth } from '../../hooks/useAuth';
import { useGetUserCart } from '../../apis/user-cart';
import type { CartInterface } from '../../interfaces/cart';
import { Skeleton } from '../ui/skeleton';

const Cart = ({
  onNext,
  onLogin,
}: {
  onNext: () => void;
  onLogin: () => void;
}) => {
  const { user } = useAuth();

  const {
    data: userCart,
    isPending,
    isError,
    error,
  } = useGetUserCart(Number(user?.id), !!user?.id);

  if (isPending) {
    return (
      <>
        <div className="px-2 flex flex-col items-center md:w-4/5 mx-auto lg:px-7">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full mb-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <Skeleton className="w-full h-14" />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="px-2 flex flex-col items-center md:w-4/5 mx-auto lg:px-7">
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <div className="mb-6">
              <TriangleAlert className="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Failed to load cart
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              {error?.message ||
                'Something went wrong while loading your cart. Please try again.'}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-app-primary hover:bg-app-tertiary text-white px-6 py-4 rounded-3xl"
            >
              Try Again
            </Button>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <Link to="/products">
            <Button className="w-full h-14 bg-app-primary rounded-none text-white text-lg font-semibold hover:bg-app-tertiary">
              SHOP ALL
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-2 flex flex-col items-center md:w-4/5 mx-auto lg:px-7">
        {user ? (
          <>
            {userCart.length > 0 ? (
              <>
                {userCart.map((item: CartInterface) => (
                  <CartItem key={item.id} cartItem={item} />
                ))}
              </>
            ) : (
              <div className="mt-15 text-center text-2xl">
                <p>Your cart is empty</p>
                <div className="mt-5 w-3/5 h-3/5 mx-auto">
                  <Image
                    src="https://ucarecdn.com/7c8fb29d-1c6e-43bd-af7e-dbb55c271c1f/-/format/auto/"
                    alt="Squircle"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-15 text-center text-2xl">
              <p>Your need login to see your cart</p>
              <div className="mt-5 w-3/5 h-3/5 mx-auto">
                <Image
                  src="https://ucarecdn.com/7c8fb29d-1c6e-43bd-af7e-dbb55c271c1f/-/format/auto/"
                  alt="Squircle"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </>
        )}
      </div>
      {user ? (
        <>
          {userCart.length > 0 && (
            <div
              className={`${userCart.length < 4 ? 'fixed bottom-0 left-0 right-0' : 'sticky bottom-0'}`}
            >
              <Button
                onClick={onNext}
                className="w-full h-14 bg-app-primary rounded-none text-white text-lg font-semibold hover:bg-app-tertiary"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="fixed bottom-0 left-0 right-0">
          <Button
            onClick={onLogin}
            className="w-full h-14 bg-app-primary rounded-none text-white text-lg font-semibold hover:bg-app-tertiary"
          >
            Login
          </Button>
        </div>
      )}
    </>
  );
};

export default Cart;
