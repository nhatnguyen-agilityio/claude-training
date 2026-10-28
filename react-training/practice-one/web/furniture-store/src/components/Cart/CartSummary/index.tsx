import { useGetCartProducts } from '../../../apis/cart-products';
import { FREE_SHIPPING_THRESHOLD } from '../../../constants/cart';
import type { CartInterface } from '../../../interfaces/cart';
import { calculateCartSummary, formatPrice } from '../../../utils/cart-summary';
import { Skeleton } from '../../ui/skeleton';
import Button from '../../common/Button';

const CartSummary = ({ cartItems }: { cartItems: CartInterface[] }) => {
  const productIds = cartItems.map((cartItem) => cartItem.item.productId);

  const {
    data: products,
    isPending,
    isError,
    refetch,
  } = useGetCartProducts(productIds);

  if (isPending) {
    return (
      <div className="w-full px-3 md:px-0 mb-20 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-3 md:px-0 mb-20 flex items-center justify-between">
        <p className="text-sm text-red-500">Failed to load order summary</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          Try again
        </Button>
      </div>
    );
  }

  const { subtotal, shipping, total } = calculateCartSummary(
    cartItems,
    products,
  );

  return (
    <div className="w-full px-3 md:px-0 mb-20 space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
      </div>
      <div className="flex justify-between text-lg font-semibold text-app-primary">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {shipping > 0 && (
        <p className="text-sm text-gray-600">
          {`Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping`}
        </p>
      )}
    </div>
  );
};

export default CartSummary;
