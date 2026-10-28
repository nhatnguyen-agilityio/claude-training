import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../constants/cart';
import type { CartInterface, CartSummaryInterface } from '../interfaces/cart';
import type { ProductInterface } from '../interfaces/products';

export const calculateCartSummary = (
  cartItems: CartInterface[],
  products: ProductInterface[],
): CartSummaryInterface => {
  // Add up in whole cents so floating-point drift can't push $500.00 below the threshold
  const subtotalInCents = cartItems.reduce((sum, cartItem) => {
    const product = products.find(
      (product) => product.id === cartItem.item.productId,
    );
    return (
      sum + Math.round((product?.price ?? 0) * 100) * cartItem.item.quantity
    );
  }, 0);
  const subtotal = subtotalInCents / 100;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return { subtotal, shipping, total: subtotal + shipping };
};

export const formatPrice = (value: number) => `$${value.toFixed(2)}`;
