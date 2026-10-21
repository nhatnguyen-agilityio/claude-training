import { calculateCartSummary, formatPrice } from './cart-summary';
import type { CartInterface } from '../interfaces/cart';
import type { ProductInterface } from '../interfaces/products';

const createCartItem = (
  productId: number,
  quantity: number,
): CartInterface => ({
  id: productId,
  userId: 1,
  item: { productId, variantId: 1, quantity },
});

const createProduct = (id: number, price: number): ProductInterface => ({
  id,
  name: `Product ${id}`,
  price,
  variants: [],
});

describe('calculateCartSummary', () => {
  it('should add up price times quantity when the cart has several items', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 2), createCartItem(2, 1)],
      [createProduct(1, 50), createProduct(2, 30)],
    );

    expect(summary.subtotal).toBe(130);
  });

  it('should charge the shipping fee when the subtotal is below the threshold', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 2)],
      [createProduct(1, 100)],
    );

    expect(summary.shipping).toBe(25);
    expect(summary.total).toBe(225);
  });

  it('should make shipping free when the subtotal is above the threshold', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 3)],
      [createProduct(1, 200)],
    );

    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(600);
  });
});

describe('formatPrice', () => {
  it('should show two decimals when the price has cents', () => {
    expect(formatPrice(12.34)).toBe('$12.34');
  });
});
