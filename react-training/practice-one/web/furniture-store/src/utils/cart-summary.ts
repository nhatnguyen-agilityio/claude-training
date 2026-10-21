import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../constants/cart';
import type { CartInterface, CartSummaryInterface } from '../interfaces/cart';
import type { ProductInterface } from '../interfaces/products';

export const calculateCartSummary = (
  cartItems: CartInterface[],
  products: ProductInterface[],
): CartSummaryInterface => {
  const subtotal = cartItems.reduce((sum, cartItem) => {
    const product = products.find(
      (product) => product.id === cartItem.item.productId,
    );
    return sum + (product?.price ?? 0) * cartItem.item.quantity;
  }, 0);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return { subtotal, shipping, total: subtotal + shipping };
};

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;
